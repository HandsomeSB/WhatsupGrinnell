import axios from 'axios';
import { OPENAI_API_KEY } from '@env';
import OpenAI from 'openai';
import { ToolsCollection } from './toolsCollection';

// Important:
// You should never expose any secrets in the bundle of a web or mobile app. The correct usage of this client package is with a backend that proxies the OpenAI call while making sure access is secured. The baseURL parameter for this OpenAI client is thus mandatory. If you set the baseURL to https://api.openai.com/v1, you are basically exposing your OpenAI API key on the internet! This example in this repo uses Backmesh.
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});



const { XMLParser } = require('fast-xml-parser');
const parser = new XMLParser();

/**
 * Fetches and parses the Grinnell Chamber RSS feed
 * Returns a JSON object with the RSS feed content
 * List of events in response.rss.channel.item
 * 
 * @returns {Promise<Object>} - Returns the RSS feed content
 * @throws {Error} If the fetch request fails
 */
async function fetchGrinnellChamberRSS() {
  try {
    const response = await axios.get('https://www.grinnellchamber.org/en/events/community_calendar/?action=rss');
    return parser.parse(response.data);
  } catch (error) {
    console.error('Error fetching Grinnell Chamber RSS:', error);
    throw new Error('Failed to fetch Grinnell Chamber events');
  }
}

const tc = new ToolsCollection();
tc.addTool("fetchGrinnellChamberRSS", "Get events happening in Grinnell", {}, fetchGrinnellChamberRSS);

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
