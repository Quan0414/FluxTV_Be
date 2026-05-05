import axios from 'axios';

export const checkStream = async (url) => {
  const startTime = Date.now();
  try {
    // Perform a fast HEAD request to check if stream is reachable
    const response = await axios.head(url, { timeout: 5000 });
    const latency = Date.now() - startTime;
    
    return {
      isOnline: response.status >= 200 && response.status < 400,
      latency,
      statusCode: response.status
    };
  } catch (error) {
    const latency = Date.now() - startTime;
    return {
      isOnline: false,
      latency,
      statusCode: error.response ? error.response.status : null,
      error: error.message
    };
  }
};
