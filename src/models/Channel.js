import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  channelId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  group: {
    type: String,
    default: 'Uncategorized'
  },
  logo: {
    type: String,
    default: ''
  },
  streamUrl: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'hls'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },

  latency: {
    type: Number,
    default: 0
  },

  lastCheckedAt: {
    type: Date,
    default: null
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Channel = mongoose.model('Channel', channelSchema);
export default Channel;
