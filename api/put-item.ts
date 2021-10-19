import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";

const tableName = process.env.TABLE_NAME;
const ddbClient:DynamoDBClient = new DynamoDBClient({});
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const requestBody = JSON.parse(event.body!);
    const id = requestBody.id;
    const name = requestBody.name;
    console.log(`tableName ${tableName}`)
    console.log(`id ${id} name ${name}`)
    const params:PutItemCommandInput = {
        TableName: tableName,
        Item: {
            id: {S: id},
            name: {S: name} 
        }
    };

    console.log(`params ${params}`)

    try {
        await ddbClient.send(new PutItemCommand(params));
        const responseBody = `Saved item ${id}`;
        return {
            statusCode: 200,
            body: responseBody
        }
    }
    catch (error){
        console.error(error);
        const responseBody = `Error saving item ${id}`;
        return {
            statusCode: 500,
            body: responseBody
        }
    }
    
}