import * as cdk from '@aws-cdk/core';
import * as dynamo from '@aws-cdk/aws-dynamodb';
import * as lamdaNode from '@aws-cdk/aws-lambda-nodejs';
import * as lambda from '@aws-cdk/aws-lambda'


export class ApigwDemoAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const table = new dynamo.Table(this,"items",{
      partitionKey: {name: 'id', type: dynamo.AttributeType.STRING}
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

    table.grantReadWriteData(putItemHandler);
    table.grantReadWriteData(deleteItemHandler);
    table.grantReadWriteData(getItemHandler);
    table.grantReadWriteData(getItemsHandler);
  }
}
