import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import * as path from "path";

export class ChatinvestorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const chatLambda = new Function(this, "chatLambdaFunction", {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset(path.join(__dirname, "..", "api")),
      handler: "chat.handler",
    });

    const api = new LambdaRestApi(this, "ChatAPI", {
      handler: chatLambda,
      proxy: false,
    });

    const chat = api.root.addResource("chat");
    chat.addMethod("POST");

    new cdk.CfnOutput(this, "APIEndpoint", {
      value: api.url,
      description: "The API Gateway endpoint URL",
    });
  }
}
