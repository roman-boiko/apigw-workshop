import * as cdk from '@aws-cdk/core';
import * as dynamo from '@aws-cdk/aws-dynamodb';
import * as lamdaNode from '@aws-cdk/aws-lambda-nodejs';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cognito from '@aws-cdk/aws-cognito'


export class ApigwDemoAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const table = new dynamo.Table(this,'items',{
      partitionKey: {name: 'id', type: dynamo.AttributeType.STRING}
    });

    const userPool = new cognito.UserPool(this, 'userPool', {
      signInAliases: {
        email: true
      },
      autoVerify: {
        email: true,
        phone: true
      },
      passwordPolicy: {
        minLength: 6,
        requireDigits: false,
        requireLowercase: true,
        requireSymbols: false,
        requireUppercase: false
      }
    });
    
    const appClient = new cognito.UserPoolClient(this, "demo-client", {
      userPool: userPool,
      generateSecret: false,
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true
      }
    })

    userPool.addDomain("demodomain",{
      cognitoDomain:{
        domainPrefix: "apigw-demo"
      }
    });

    new cdk.CfnOutput(this, 'userPoolId', {
      value: userPool.userPoolId,
    });
    new cdk.CfnOutput(this, 'appClientId', {
      value: appClient.userPoolClientId,
    });
    
    const putItemHandler = new lamdaNode.NodejsFunction(this, 'putItem', {
      entry: './api/put-item.ts',
      environment: {'TABLE_NAME': table.tableName},
      tracing: lambda.Tracing.ACTIVE
    });

    const deleteItemHandler = new lamdaNode.NodejsFunction(this, 'deleteItem', {
      entry: './api/delete-item.ts',
      environment: {'TABLE_NAME': table.tableName},
      tracing: lambda.Tracing.ACTIVE
    });

    const getItemHandler = new lamdaNode.NodejsFunction(this, 'getItem', {
      entry: './api/get-item.ts',
      environment: {'TABLE_NAME': table.tableName},
      tracing: lambda.Tracing.ACTIVE
    });

    const getItemsHandler = new lamdaNode.NodejsFunction(this, 'getItems', {
      entry: './api/get-items.ts',
      environment: {'TABLE_NAME': table.tableName},
      tracing: lambda.Tracing.ACTIVE
    });

    const findItemsHandler = new lamdaNode.NodejsFunction(this, 'findItems', {
      entry: './api/find-items.ts',
      environment: {'TABLE_NAME': table.tableName},
      tracing: lambda.Tracing.ACTIVE
    });

    const authHandler = new lamdaNode.NodejsFunction(this, 'customAuth', {
      entry: './auth/custom-auth.ts',
      tracing: lambda.Tracing.ACTIVE
    });

    table.grantReadWriteData(putItemHandler);
    table.grantReadWriteData(deleteItemHandler);
    table.grantReadWriteData(getItemHandler);
    table.grantReadWriteData(getItemsHandler);
    table.grantReadWriteData(findItemsHandler);
  }
}
