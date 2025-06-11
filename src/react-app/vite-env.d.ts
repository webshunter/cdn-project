/// <reference types="vite/client" />

interface Window {
  chatbot: {
    init: () => void;
  };
}

declare module '/chatbot.js' {
  export function init(): void;
}
