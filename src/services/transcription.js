import axios from "axios";
import { OPENAI_API_KEY } from "@env";

// Add error handling for missing API key
if (!OPENAI_API_KEY) {
  console.error(
    "OpenAI API key is not configured. Please check your .env file or eas.json for production builds."
  );
}

export async function transcribeAudio(audioUri) {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error(
        "OpenAI API key is not configured. Please check your environment configuration."
      );
    }

    if (!audioUri) {
      throw new Error("No audio file provided for transcription");
    }

    const formData = new FormData();
    formData.append("file", {
      uri: audioUri,
      type: "audio/m4a",
      name: "audio.m4a",
    });
    formData.append("model", "whisper-1");

    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.data || !response.data.text) {
      throw new Error("Invalid response from transcription service");
    }

    return response.data.text;
  } catch (error) {
    console.error("Error in transcription service:", error);
    throw new Error("Failed to transcribe audio. Please try again.");
  }
}
