import axios from 'axios';
import { OPENAI_API_KEY } from '@env';
import OpenAI from 'openai';
import { ToolsCollection } from '../models/toolsCollection';
import { getEventsFromDateCached } from '../models/tools';
import moment from 'moment';

// Important:
// You should never expose any secrets in the bundle of a web or mobile app. The correct usage of this client package is with a backend that proxies the OpenAI call while making sure access is secured. The baseURL parameter for this OpenAI client is thus mandatory. If you set the baseURL to https://api.openai.com/v1, you are basically exposing your OpenAI API key on the internet! This example in this repo uses Backmesh.
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const tc = new ToolsCollection();
tc.addTool("getEventsFromDateCached", "Gets events from a given date range at Grinnell, IA", { 
    type: "object",
    properties: {
      startDate: { type: "string", description: "The start date of the range."},
      endDate: { type: "string", description: "The end date of the range." },
    },
    required: ["startDate", "endDate"],
    additionalProperties: false,
  }, 
  getEventsFromDateCached,
);

/**
 * Generates a completion response from OpenAI's API
 * 
 * @param {string} prompt - The input prompt to generate completion for
 * @returns {Promise<string>} - Returns the generated completion as a string
 * @throws {Error} If OpenAI API key is not configured or API request fails
 * 
 * @example
 * generateCompletion("Tell me a story").then((completion) => {
 *   console.log(completion); // Prints the generated completion
 * });
 */
export async function generateCompletion(prompt) {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured. Please check your .env file.');
    }

    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'gpt-3.5-turbo-instruct',
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error in completion service:', error);
    throw new Error(error.message || 'Failed to generate completion');
  }
}


/**
 * Generates a completion response from OpenAI's API with tools
 * 
 * @param {string} prompt - The input prompt to generate completion for
 * @param {string} responseFormat - The response format to use
 * @returns {Promise<string>} - Returns the generated completion as a string
 * 
 */
export async function generateCompletionWithTools(prompt, responseFormat = null) {
  let input = [
    { role: "system", content: `
      You are WhatsupGrinnell, a large language model trained by OpenAI.
      You are chatting with the user via the mobile app. 
      This means most of the time your lines should be a sentence or two, 
      unless the user's request requires reasoning or long-form outputs. 
      Never use emojis, unless explicitly asked to. 
      Current date: ${new Date().toISOString()}
    `},
    { role: "user", content: prompt }
  ];

  let response = await openai.responses.create({
    model: "gpt-4o",
    input: input,
    tools: tc.getTools(),
    tool_choice: "auto",
  });

  const output = response.output;
  const toolCalls = output.filter(item => item.type === "function_call");

  if(toolCalls.length > 0) {
    for (const toolCall of toolCalls) {
      const toolName = toolCall.name;
      const toolArgs = JSON.parse(toolCall.arguments);
      const result = await tc.executeTool(toolName, Object.values(toolArgs));

      input.push(toolCall);
      input.push({                               // append result message
        type: "function_call_output",
        call_id: toolCall.call_id,
        output: JSON.stringify(result)
      });
    }

    response = await openai.responses.create({
      model: "gpt-4o-mini-2024-07-18",
      input: input,
      text: {
        format: responseFormat ? responseFormat : {type: "text"}
      }
    });
  }

  return response.output_text;
}

/**
 * Streams the completion response from OpenAI's API token by token
 * 
 * @param {string} prompt - The input prompt to generate completion for
 * @param {function} onToken - Callback function that receives each token as it arrives
 * @returns {Promise<void>} - Returns nothing, but calls onToken with each received token
 * @throws {Error} If OpenAI API key is not configured or API request fails
 * 
 * @example
 * streamCompletion("Tell me a story", (token) => {
 *   console.log(token); // Prints each token as it arrives
 * });
 */

export async function streamCompletion(prompt, onToken) {

  // const stream = await openai.responses.create({
  //   model: "gpt-4o",
  //   input: [
  //       {
  //           role: "user",
  //           content: prompt,
  //       },
  //   ],
  //   stream: true,
  // });

  // for await (const event of stream) {
  //   if (event.delta) {
  //     onToken(event.delta);
  //   }
  // }

}