import axios from "axios";
import { Audio } from "expo-av";
import { OPENAI_API_KEY } from "@env";
import { Buffer } from "buffer";

/**
 * Generates and plays audio from text using OpenAI's TTS API
 *
 * @param {string} text - The text to convert to speech
 * @param {string} voice - The voice to use (alloy, echo, fable, onyx, nova, shimmer)
 * @returns {Promise<void>} - Returns nothing, but plays the generated audio
 * @throws {Error} If OpenAI API key is not configured or API request fails
 *
 * @example
 * textToSpeech("Hello, how are you?").then(() => {
 *   console.log("Audio played successfully");
 * });
 */
export async function textToSpeech(text, voice = "alloy") {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error(
        "OpenAI API key is not configured. Please check your .env file."
      );
    }
    console.log("Making API request to OpenAI");
    // Make API request to OpenAI
    const response = await axios.post(
      "https://api.openai.com/v1/audio/speech",
      {
        model: "tts-1",
        input: text,
        voice: voice,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );
    console.log("API request to OpenAI successful");

    // Create and play the audio
    const audioUri = `data:audio/mpeg;base64,${Buffer.from(
      response.data,
      "binary"
    ).toString("base64")}`;
    playAudio(audioUri);

    console.log("Audio played successfully");
  } catch (error) {
    console.error("Error in TTS service:", error);
    throw new Error(error.message || "Failed to generate or play audio");
  }
}

const playAudio = async (audioUri) => {
  try {
    const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
    await sound.playAsync();
  } catch (error) {
    console.error("Error playing audio:", error);
  }
};
