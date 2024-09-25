const {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} = require("@aws-sdk/client-bedrock-agent-runtime");

const client = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION,
});
const agentId = process.env.AGENT_ID;
const agentAliasId = process.env.AGENT_ALIAS_ID;
const memoryId = process.env.AGENT_MEMORY_ID;

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);
    inputText = body.inputText;
    enableTrace = body.enableTrace;
    sessionId = body.sessionId;

    const input = {
      agentId: agentId,
      agentAliasId: agentAliasId,
      sessionId: sessionId,
      enableTrace: enableTrace || false,
      inputText: inputText,
      memoryId: memoryId,
    };

    if (!inputText) {
      throw new Error("Input text is missing");
    }

    if (!sessionId) {
      throw new Error("Session ID is missing");
    }

    const command = new InvokeAgentCommand(input);

    const response = await client.send(command);

    let completion = "";
    let traceSteps = [];

    console.log("Response:", JSON.stringify(response, null, 2));

    if (response.completion) {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Processing timed out")), 30000)
      );

      try {
        await Promise.race([
          (async () => {
            for await (let chunkEvent of response.completion) {
              console.log("Chunk event:", JSON.stringify(chunkEvent, null, 2));
              if (chunkEvent.chunk && chunkEvent.chunk.bytes) {
                const decodedResponse = new TextDecoder("utf-8").decode(
                  chunkEvent.chunk.bytes
                );
                completion += decodedResponse;
              } else if (chunkEvent.trace) {
                traceSteps.push(chunkEvent.trace);
              } else {
                console.warn("Unexpected chunk format:", chunkEvent);
              }
            }
          })(),
          timeoutPromise,
        ]);
      } catch (error) {
        if (error.message === "Processing timed out") {
          console.warn("Processing timed out, returning partial results");
        } else {
          throw error;
        }
      }
    } else {
      console.warn("No completion in response");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        response: completion || "No completion generated",
        traceSteps: traceSteps,
        sessionId: sessionId,
      }),
    };
  } catch (error) {
    console.error("Error invoking Lambda function:", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        error: error.message || "An unexpected error occurred",
        details: error.stack,
      }),
    };
  }
};
