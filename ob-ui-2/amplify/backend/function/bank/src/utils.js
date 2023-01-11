var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'ap-northeast-1'});

const TABLENAME = "OpenbankDevelopment";

// Create the DynamoDB service object
// var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var ddbDocumentClient = new AWS.DynamoDB.DocumentClient();


// Helper Methods
export const checkIfEntryExists = async(id) =>
{
  try {
   const lParams =
    {
      TableName: TABLENAME,
      Key: { 
        PK: `BK#${id}`,
      },
    };
    var result = await ddbDocumentClient.get(lParams).promise();
    console.log("Bank Query Result: ", result);
    return result.Item !== undefined;
  }
  catch (error)
  {
      console.error(error);
  }
};

export const getItemFromDB = async (aPK) =>
{
  try {
    const lParams =
    {
      TableName: TABLENAME,
      Key: {
        PK: aPK,
      },
    };
    const lResult = await ddbDocumentClient.get(lParams).promise();
    console.log("aPK: ", aPK);
    console.log("Retrieved: ", lResult);
    return lResult.Item;
  }
  catch (error)
  {
    console.log(error);
  };
};

export const updateUserBankSubscription = async (userId, bankId, action="create") =>
{
  const lUserPK = `UR#${userId}`;
  const lGetParams =
  {
    TableName: TABLENAME,
    Key: {
      PK: lUserPK
    },
    AttributesToGet: ["subscribedBanks"],
  };

  const lResult = await ddbDocumentClient.get(lGetParams).promise();

  let lSubscribedBanks = lResult.Item.subscribedBanks;

  console.log("Query result: ", lSubscribedBanks)
  if (action === "delete")
  {
    lSubscribedBanks = lSubscribedBanks.filter(aBankId => aBankId !== bankId)
  }
  else
  {
    if (lSubscribedBanks[0] === "")
    {
      lSubscribedBanks[0] = bankId; // For the first time only.
    }
    else
    {
      const lDuplicateIndex = lSubscribedBanks.findIndex(aBankId => aBankId === bankId);
      if (lDuplicateIndex === -1)
      {
        lSubscribedBanks.push(bankId);
      }
      else
      {
        lSubscribedBanks[lDuplicateIndex] = bankId;
      }
    }
  }

  const lParams = {
    TableName: TABLENAME,
    Key: { PK : lUserPK },
    UpdateExpression: 'set subscribedBanks = :subscribedBanks',
    ExpressionAttributeValues: {
      ':subscribedBanks': lSubscribedBanks,
      },
  };
  await ddbDocumentClient.update(lParams).promise();
  console.log("Updated user");
};
