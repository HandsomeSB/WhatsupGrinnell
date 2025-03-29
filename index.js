import 'react-native-get-random-values';
import { polyfillGlobal } from "react-native/Libraries/Utilities/PolyfillFunctions";
import { ReadableStream } from "web-streams-polyfill";
import { fetch, Headers, Request, Response } from "react-native-fetch-api";
import { TextEncoder } from "text-encoding";

// Polyfill ReadableStream
polyfillGlobal("ReadableStream", () => ReadableStream);

// Polyfill fetch with streaming support
polyfillGlobal(
  "fetch",
  () =>
    (...args) =>
      fetch(args[0], {
        ...args[1],
        reactNative: {
          textStreaming: true
        }
      })
);

// Polyfill other required globals
polyfillGlobal("Headers", () => Headers);
polyfillGlobal("Request", () => Request);
polyfillGlobal("Response", () => Response);
polyfillGlobal("TextEncoder", () => TextEncoder);

// Import the main app entry point
import "expo-router/entry"; 