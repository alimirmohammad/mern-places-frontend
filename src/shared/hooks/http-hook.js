import { useCallback, useEffect, useRef, useState } from 'react';

export default function useHttpClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const requestsRef = useRef([]);

  const sendRequest = useCallback(
    async (url, { method = 'GET', body = null, headers = {} } = {}) => {
      try {
        const abortController = new AbortController();
        setIsLoading(true);
        requestsRef.current.push(abortController);
        const response = await fetch(url, {
          method,
          headers,
          body,
          signal: abortController.signal,
        });
        const data = await response.json();
        if (!response.ok) throw data;
        requestsRef.current.pop();
        setIsLoading(false);
        return data;
      } catch (error) {
        requestsRef.current.pop();
        setError(error.message);
        setIsLoading(false);
        throw error;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError('');
  }, []);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      requestsRef.current.forEach(controller => controller.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
}
