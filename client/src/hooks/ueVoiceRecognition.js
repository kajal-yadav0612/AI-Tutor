import { useState, useCallback } from 'react';

const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = useCallback(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
    window.speechRecognition?.stop();
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    transcript,
  };
};

export default useVoiceRecognition;
