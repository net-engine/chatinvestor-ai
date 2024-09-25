# Amazon Bedrock Agent Lambda Function

This project contains a Lambda function that interacts with Amazon Bedrock Agent Runtime to process user queries and retrieve information from ASX-listed company announcements and reports.

## Description

This Lambda function serves as an intermediary between an API Gateway and Amazon Bedrock Agent Runtime. It processes incoming requests, invokes the Bedrock Agent, and returns the agent's response. The function is designed to handle queries about ASX-listed companies, providing information from various documents such as quarterly reports, annual reports, and other filings.

## Features

- Processes incoming requests from API Gateway
- Invokes Amazon Bedrock Agent Runtime with user queries
- Handles streaming responses from Bedrock Agent
- Implements timeout mechanism to handle long-running queries
- Returns both partial and complete results based on processing time
- Uses environment variables for configuration

## Prerequisites

- AWS Account
- Node.js 18.x or later
- AWS SDK for JavaScript v3
- Amazon Bedrock Agent set up with necessary knowledge base

## Setup

1. Clone this repository
2. Install dependencies:
   ```npm install```
3. Create a `.env` file in the root directory with the following content:

```
AGENT_ID=your_agent_id
AGENT_ALIAS_ID=your_agent_alias_id
AWS_ACCOUNT_ID=your_aws_account_id
AWS_REGION=your_aws_region
```

4. Deploy the Lambda function to your AWS account (see Deployment section)

## Configuration

The Lambda function uses the following environment variables:

- `AGENT_ID`: Amazon Bedrock Agent ID
- `AGENT_ALIAS_ID`: Agent Alias ID
- `AWS_ACCOUNT_ID`: Your AWS Account ID
- `AWS_REGION`: AWS region for your resources

These should be set in the Lambda function's configuration in the AWS Console.

## Deployment

1. Zip the contents of this directory (excluding node_modules)
2. Upload the zip file to AWS Lambda
3. Set the handler to `index.handler`
4. Configure the function's execution role to have permissions for invoking Bedrock Agent Runtime
5. Set the environment variables in the Lambda function configuration

## Usage

The Lambda function expects an event with the following structure:

```json
{
  "inputText": "Your query here",
  "enableTrace": true,
  "sessionId": "unique_session_id"
}
```

It returns a response with the following structure:

```json
{
  "statusCode": 200,
  "body": {
    "response": "Agent's response",
    "traceSteps": [],
    "sessionId": "session_id"
  }
}
```

## Contributing
Contributions to improve the function are welcome. Please submit a pull request with your proposed changes.
