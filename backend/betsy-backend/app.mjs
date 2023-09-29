import { 
  DynamoDBClient, 
  ScanCommand, 
} from "@aws-sdk/client-dynamodb";

const dbClient = new DynamoDBClient({ region: "eu-central-1" });

var params = {
  TableName: 'betsy_users',
};

export const handler = async (event, context) => {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));

  const scanUsersCommand = new ScanCommand({TableName: "betsy_users"});
  const response = await dbClient.send(scanUsersCommand);
  console.log(response);
  // return context.logStreamName;
  const body = JSON.stringify(response.Items);
  return {
    "statusCode": 200,
    "headers": {
      "Content-Type": "application/json"
    },
    "body": body
  }
};