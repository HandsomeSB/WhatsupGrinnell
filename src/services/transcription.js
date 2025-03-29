import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

export async function transcribeAudio(audioUri) {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured. Please check your .env file.');
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'audio.m4a',
    });
    formData.append('model', 'whisper-1');

    // Make API request to OpenAI
    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.text;
  } catch (error) {
    console.error('Error in transcription service:', error);
    throw new Error(error.message || 'Failed to transcribe audio');
  }
} 