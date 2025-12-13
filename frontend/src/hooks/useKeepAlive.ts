import { useEffect } from 'react';

const API_BASE_URL = 'https://travel-social-network-api.onrender.com';
const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Custom hook to keep the backend alive by pinging it every 10 minutes.
 * This prevents the Render free tier from putting the backend to sleep.
 */
export const useKeepAlive = () => {
  useEffect(() => {
    // Function to ping the backend
    const pingBackend = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/ping`, {
          method: 'GET',
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Backend keep-alive ping successful:', data.timestamp);
        } else {
          console.warn('⚠️ Backend ping returned non-OK status:', response.status);
        }
      } catch (error) {
        console.error('❌ Backend keep-alive ping failed:', error);
      }
    };

    // Ping immediately on mount
    pingBackend();

    // Set up interval to ping every 10 minutes
    const intervalId = setInterval(pingBackend, PING_INTERVAL);

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);
};
