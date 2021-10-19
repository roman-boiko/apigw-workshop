import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, ScanCommand, ScanCommandInput, ScanCommandOutput } from "@aws-sdk/client-dynamodb";

const tableName = process.env.TABLE_NAME;
const ddbClient:DynamoDBClient = new DynamoDBClient({});
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const params:ScanCommandInput = {
        TableName: tableName
    };

    try {
        const result:ScanCommandOutput =  await ddbClient.send(new ScanCommand(params));
        const responseBody = JSON.stringify(result.Items);
        return {
            statusCode: 200,
            body: responseBody
        }
    }
    catch (error){
        console.error(error);
        const responseBody = `Error getting items`;
        return {
            statusCode: 500,
            body: responseBody
        }
    }
    
}