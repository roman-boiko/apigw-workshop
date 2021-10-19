import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, GetItemCommand, GetItemCommandInput, GetItemCommandOutput } from "@aws-sdk/client-dynamodb";

const tableName = process.env.TABLE_NAME;
const ddbClient:DynamoDBClient = new DynamoDBClient({});
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters!.id;
    
    const params:GetItemCommandInput = {
        TableName: tableName,
        Key: {
            id: {S: id!},
        }
    };

    try {
        const result:GetItemCommandOutput =  await ddbClient.send(new GetItemCommand(params));
        const responseBody = JSON.stringify(result.Item);
        return {
            statusCode: 200,
            body: responseBody
        }
    }
    catch (error){
        console.error(error);
        const responseBody = `Error getting item ${id}`;
        return {
            statusCode: 500,
            body: responseBody
        }
    }
    
}