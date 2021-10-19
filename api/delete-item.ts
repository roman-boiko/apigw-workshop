import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, DeleteItemCommand, DeleteBackupCommandInput, DeleteItemCommandInput } from "@aws-sdk/client-dynamodb";

const tableName = process.env.TABLE_NAME;
const ddbClient:DynamoDBClient = new DynamoDBClient({});
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters!.id;
    
    const params:DeleteItemCommandInput = {
        TableName: tableName,
        Key: {
            id: {S: id!},
        }
    };

    try {
        await ddbClient.send(new DeleteItemCommand(params));
        const responseBody = `Deleted item ${id}`;
        return {
            statusCode: 200,
            body: responseBody
        }
    }
    catch (error){
        console.error(error);
        const responseBody = `Error deleting item ${id}`;
        return {
            statusCode: 500,
            body: responseBody
        }
    }
    
}