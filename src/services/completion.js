import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

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
        stream: true,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        responseType: 'text',
      }
    );

    // Split the response into lines and process each line
    const lines = response.data.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') {
          continue;
        }
        try {
          const parsed = JSON.parse(data);
          if (parsed.choices[0].text) {
            onToken(parsed.choices[0].text);
          }
        } catch (e) {
          console.error('Error parsing streaming response:', e);
        }
      }
    }
  } catch (error) {
    console.error('Error in streaming completion service:', error);
    throw new Error(error.message || 'Failed to stream completion');
  }
} 