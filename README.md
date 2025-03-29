# WhatsupGrinnell

A React Native application that uses OpenAI's Whisper API for audio transcription.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

3. Start the development server:
```bash
npm start
```

## Features

- Record audio using the device's microphone
- Transcribe audio using OpenAI's Whisper API
- Display transcription results in real-time

## Requirements

- Node.js
- npm or yarn
- Expo CLI
- OpenAI API key
- iOS or Android device (or emulator) for testing

## Usage

1. Press the "Start Recording" button to begin recording audio
2. Press "Stop & Transcribe" when you're done recording
3. Wait for the transcription to complete
4. View the transcribed text on the screen

## Note

Make sure to replace the placeholder API key in the `.env` file with your actual OpenAI API key before running the application. 