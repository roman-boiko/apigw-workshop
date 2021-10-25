import {APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEvent, PolicyDocument } from "aws-lambda";


const getPolicy = (effect: string, resource: string):PolicyDocument => {
    return {
        Version: '2012-10-17',
        Statement: [{
            Action: "execute-api:Invoke",
            Effect: effect,
            Resource: resource
        }]
    };
}

export const handler = async (event: APIGatewayRequestAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {

    if (event.headers!.auth == "secret"){
        return{
            principalId: "secret",
            policyDocument: getPolicy("Allow", event.methodArn),
        };
    }
    else{
        return{
            principalId: "secret",
            policyDocument: getPolicy("Deny", event.methodArn),
        };
    }
}