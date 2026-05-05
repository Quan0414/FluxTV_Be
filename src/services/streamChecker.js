import axios from 'axios';
import Channel from '../models/Channel.js';

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

export const startStreamCheckJob = (intervalMs = 5 * 60 * 1000) => {
  const runCheck = async () => {
    try {
      console.log('Starting background stream check...');
      const channels = await Channel.find({ isActive: true });
      
      const batchSize = 10; // Process 10 channels concurrently
      for (let i = 0; i < channels.length; i += batchSize) {
        const batchChannels = channels.slice(i, i + batchSize);
        const updates = await Promise.all(batchChannels.map(async (channel) => {
          const status = await checkStream(channel.streamUrl);
          return {
            updateOne: {
              filter: { _id: channel._id },
              update: { 
                $set: { 
                  isOnline: status.isOnline, 
                  latency: status.latency, 
                  lastCheckedAt: new Date() 
                } 
              }
            }
          };
        }));

        if (updates.length > 0) {
          await Channel.bulkWrite(updates);
        }
      }
      console.log(`Finished background stream check. Checked ${channels.length} channels.`);
    } catch (error) {
      console.error('Error in background stream check:', error);
    }
  };

  // Run initial check after 5 seconds
  setTimeout(runCheck, 5000);

  // Run periodically
  setInterval(runCheck, intervalMs);
};
