/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'ap-northeast-1'});

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

// Helper Metods
const checkIfEntryExists = async(id) => {
  try {
    var params = {
          TableName : "Openbank_dev",
          KeyConditionExpression   : "PK = :pk",
          ExpressionAttributeValues: {
              ":pk": id
          }
      };
      var result = await ddbDocumentClient.query(params).promise();
      console.log("Query result: ", result);
      return result;
  }
  catch (error)
  {
      console.error(error);
  }
};

/**********************
 * Example get method *
 **********************/

app.get('/bank', async(req, res) =>
{
  const lUserId = req.body.userId;
  const lPartitionKey = `UR#${lUserId}`;

  var lParams = {
    TableName: 'Openbank_dev',
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: {
      ':pk': lPartitionKey,
    },
    Select: "SPECIFIC_ATTRIBUTES",
    AttributesToGet: ["subscribedBanks"],
  };

  const lResult = await ddbDocumentClient.query(lParams).promise()
  console.log(lResult);
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

app.get('/bank/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

/****************************
* Example post method *
****************************/

app.post('/bank', async (req, res) => {
  
  const lBody = req.body;
  const lPartitionKey = lBody["PK"];

  const lQueryResult = await checkIfEntryExists(lPartitionKey);

  if (lQueryResult.Count > 0)
  {
    const lUser = lQueryResult.Items[0];
    try {
      const lParams = {
        TableName: 'Openbank_dev',
        Key: { PK : lUser.PK, SK: lUser.SK },
        UpdateExpression: 'set lastLoggedIn = :lastLoggedIn',
        ExpressionAttributeValues: {
          ':lastLoggedIn': lBody.lastLoggedIn,
          },
        };
        await ddbDocumentClient.update(lParams).promise();
        console.log("Updated bank");
    }
    catch (error)
    {
        console.error(error);
    }
    
    // TODO: update last logged in.
    return res.json({success: 'post call succeed!', url: req.url, body: { message: `Welcome back, ${lBody.nickName}`, severity: "low"}});
  }
  try {
        var lParams =
        {
            Item: lBody,
            TableName: "Openbank_dev",
        };
        await ddbDocumentClient.put(lParams).promise();
    }
    catch (error)
    {
        console.error(error);
    }

  return res.json({success: 'post call succeed!', url: req.url, body: { message: `Thanks for signing up, ${lBody.nickName}`, severity: "low"}})
});

app.post('/user/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
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

app.delete('/bank', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/bank/*', function(req, res) {
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
