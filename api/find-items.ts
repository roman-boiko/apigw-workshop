import { DynamoDBClient, ScanCommand, ScanCommandInput, ScanCommandOutput } from "@aws-sdk/client-dynamodb";


interface SearchEvent {
    name: string
}

interface SearchResult {
    result: string
}

const tableName = process.env.TABLE_NAME;
const ddbClient:DynamoDBClient = new DynamoDBClient({});
export const handler = async (event: SearchEvent): Promise<SearchResult> => {
    const params:ScanCommandInput = {
        TableName: tableName,
        FilterExpression: "#itemName = :n",
        ExpressionAttributeValues: {
            ":n": {S: event.name}
        },
        ExpressionAttributeNames: {
            "#itemName": "name"
        }
    };

    try {
        const result:ScanCommandOutput =  await ddbClient.send(new ScanCommand(params));
        return {
            result:  JSON.stringify(result.Items)
        };
    }
    catch (error){
        console.error(error);
        return {
            result: `Error searching items`
        };
    }
    
}