/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
const { getItemFromDB, updateUserBankSubscription } = require("./utils");

// Set the region
AWS.config.update({region: 'ap-northeast-1'});

const TABLENAME = "OpenbankDevelopment";

// Create the DynamoDB service object
// var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var ddbDocumentClient = new AWS.DynamoDB.DocumentClient();
const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

/**********************
 * Example get method *
 **********************/

app.post('/bank', async(req, res) => {

  //1. Get user id from header.
  //2. Get List of 5 banks.
  //3. Get Data for 5 banks and send them.
  
  console.log("Request received: ", req);

  let lUserId = req.body.userId;
  let lPageNumber = req.body.page;
  const lStart = lPageNumber === 1 ? 0 : 5 * (lPageNumber - 1);
  const lEnd = lPageNumber * 5;

  let lSubscribedBanks = [];

  try {
    const lParams =
    {
      TableName: TABLENAME,
      Key: {
        PK: `UR#${lUserId}`,
      },
      AttributesToGet: ["subscribedBanks"],
    };
    const lResult = await ddbDocumentClient.get(lParams).promise();
    lSubscribedBanks = lResult.Item.subscribedBanks;
  }
  catch (error)
  {
    console.log(error);
  };
  
  const lBanks = [];
  console.log(lSubscribedBanks);
  for (let lIndex = lStart; lIndex < Math.min(lSubscribedBanks.length, lEnd); lIndex ++)
  {
    const lSubscribedBankId = lSubscribedBanks[lIndex];
    const lRetrievedBank = await getItemFromDB(`BK#${lSubscribedBankId}`);
    console.log(lRetrievedBank);
    let lQuestions = [];
    for (const lQuestionID of lRetrievedBank.questions)
    {
      const lRetrievedQuestion = await getItemFromDB(`QN#${lQuestionID}`);
      lQuestions.push(lRetrievedQuestion);
    }
    lRetrievedBank.questions = lQuestions;
    // console.log("Retrieved bank: ", lRetrievedBank);
    lBanks.push(lRetrievedBank);
  }
  
  // console.log("Banks: ", lBanks);
  res.json({success: 'get call succeed!', data: lBanks });
});

app.get('/user/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

/****************************
* Example post method *
****************************/

app.post('/bank/new', async (req, res) => {

  // 1. Add BankID to subscribedBanks for user. Create a function for that.
  // 2. Add Questions to the database.
  // 3. Add Bank to the database with list of Question IDs.

  const lBankId = req.body.id;
  const lUserId = req.body.userId;
  const lBody = req.body;

  console.log("Bank Request object:", lBody);

  const lPartitionKey = `BK#${lBankId}`;
  
  // 1. Update User's subscribedBanks.
  await updateUserBankSubscription(lUserId, lBankId);

  //2. Decouple questions and add them to the DB.
  for (const lQuestion of lBody.questions)
  {
    const lQuestionPK = `QN#${lQuestion.id}`;
    const lPutParams =
    {
      Item: { ...lQuestion, bankId: lBankId, PK: lQuestionPK },
      TableName: TABLENAME
    };
    await ddbDocumentClient.put(lPutParams).promise();
  }
  
  //3. Add Bank to the database.
  const lQuestionsList = lBody.questions.map(aQuestion => aQuestion.id);
  const lPutParams =
  {
    Item: { ...lBody, PK: lPartitionKey, questions: lQuestionsList },
    TableName: TABLENAME,
  };
  await ddbDocumentClient.put(lPutParams).promise();

  return res.json({success: 'Bank successfully added.', url: req.url, body: lBody })
});

app.post('/bank/delete', async (req, res) => {
  
  const lBankId = req.body.bankId;
  const lUserId = req.body.userId;
  
  await updateUserBankSubscription(lUserId, lBankId, "delete");

  const lDeleteParams = {
    TableName : TABLENAME,
    Key: {
      PK: `BK#${lBankId}`
    }
  };

  await ddbDocumentClient.delete(lDeleteParams).promise();
  res.json({success: 'Bank successfully deleted!', url: req.url, body: req.body.bankId})
});

/****************************
* Example put method *
****************************/

app.put('/user', function(req, res) {

  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/user/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/user', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/user/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
