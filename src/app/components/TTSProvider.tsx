'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface TTSContextType {
  speak: (text: string, isEnglish?: boolean) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice) => void;
  isSpeaking: boolean;
  stop: () => void;
}

const TTSContext = createContext<TTSContextType | null>(null);

export function TTSProvider({ children }: { children: React.ReactNode }) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasWindowLoaded, setHasWindowLoaded] = useState(false);

  useEffect(() => {
    setHasWindowLoaded(true);
  }, []);

  // Initialize voices
  useEffect(() => {
    if (!hasWindowLoaded) return;

    function loadVoices() {
      try {
        const synth = window.speechSynthesis;
        const availableVoices = synth.getVoices();
        
        if (availableVoices.length === 0) {
          // In some browsers, voices might not be available immediately
          // We'll try again in a moment
          setTimeout(loadVoices, 100);
          return;
        }
        
        const frenchVoices = availableVoices.filter(voice => 
          voice.lang.startsWith('fr') || voice.lang === 'fr-FR'
        );
        const englishVoices = availableVoices.filter(voice => 
          voice.lang.startsWith('en')
        );
        
        setVoices([...frenchVoices, ...englishVoices]);
        
        // Set default voices
        if (frenchVoices.length > 0 && !selectedVoice) {
          setSelectedVoice(frenchVoices[0]);
        }
        
        setIsLoading(false);
        setError(null);
      } catch (err) {
        setError('Failed to load speech voices. Please check if your browser supports speech synthesis.');
        setIsLoading(false);
      }
    }

    // Check if speechSynthesis is available
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Chrome needs this event, other browsers can get voices immediately
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices(); // Initial load for non-Chrome browsers

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      setError('Speech synthesis is not supported in your browser.');
      setIsLoading(false);
    }
  }, [hasWindowLoaded, selectedVoice]);

  const speak = useCallback(async (text: string, isEnglish = false) => {
    if (!hasWindowLoaded || !window.speechSynthesis) {
      setError('Speech synthesis is not available');
      return;
    }

    try {
      setError(null);
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Select appropriate voice based on language
      if (isEnglish) {
        const englishVoice = voices.find(v => v.lang.startsWith('en'));
        utterance.voice = englishVoice || null;
        utterance.lang = 'en-US';
      } else {
        utterance.voice = selectedVoice;
        utterance.lang = 'fr-FR';
      }
      
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1;
      
      setIsSpeaking(true);
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        setError('Error playing speech');
        setIsSpeaking(false);
        console.error('Speech synthesis error:', event);
      };
      
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to speak text');
      setIsSpeaking(false);
    }
  }, [voices, selectedVoice, hasWindowLoaded]);

  const stop = useCallback(() => {
    if (hasWindowLoaded && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [hasWindowLoaded]);

  return (
    <TTSContext.Provider 
      value={{ 
        speak, 
        isLoading, 
        error, 
        voices,
        selectedVoice,
        setSelectedVoice,
        isSpeaking,
        stop
      }}
    >
      {children}
    </TTSContext.Provider>
  );
}

export function useTTS() {
  const context = useContext(TTSContext);
  if (!context) {
    throw new Error('useTTS must be used within a TTSProvider');
  }
  return context;
}