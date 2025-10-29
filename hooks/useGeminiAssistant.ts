
import { useState } from 'react';
import { supabase } from '@/app/integrations/supabase/client';

export interface GeminiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUri?: string;
  timestamp: Date;
}

export function useGeminiAssistant() {
  const [messages, setMessages] = useState<GeminiMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (prompt: string, imageUri?: string) => {
    setLoading(true);
    setError(null);

    // Add user message to chat
    const userMessage: GeminiMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      imageUri,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const formData = new FormData();
      formData.append('prompt', prompt);

      // If there's an image, fetch it and add to form data
      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        formData.append('image', blob, 'image.jpg');
      }

      // Call the edge function
      const { data, error: functionError } = await supabase.functions.invoke(
        'gemini-assistant',
        {
          body: formData,
        }
      );

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data || !data.response) {
        throw new Error('No response from AI');
      }

      // Add assistant message to chat
      const assistantMessage: GeminiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      return data.response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response';
      setError(errorMessage);
      console.error('Gemini Assistant error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  };
}
