import Channel from '../models/Channel.js';
import { checkStream } from '../services/streamChecker.js';

// @desc    Get all channels
// @route   GET /api/channels
export const getChannels = async (req, res, next) => {
  try {
    const { group, q } = req.query;
    let query = { isActive: true };

    if (group) {
      query.group = group;
    }
    
    if (q) {
      query.name = { $regex: q, $options: 'i' };
    }

    const channels = await Channel.find(query).sort({ order: 1 });
    res.json({
      success: true,
      total: channels.length,
      data: channels
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get channel by ID
// @route   GET /api/channels/:id
export const getChannelById = async (req, res, next) => {
  try {
    const channel = await Channel.findOne({ channelId: req.params.id, isActive: true });
    
    if (!channel) {
      return res.status(404).json({ success: false, message: 'Channel not found' });
    }

    res.json({
      success: true,
      data: channel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all groups
// @route   GET /api/groups
export const getGroups = async (req, res, next) => {
  try {
    const groups = await Channel.distinct('group', { isActive: true });
    res.json({
      success: true,
      total: groups.length,
      data: groups
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check channel stream status (Force Refresh)
// @route   GET /api/channels/:id/check
export const checkChannelStream = async (req, res, next) => {
  try {
    const channel = await Channel.findOne({ channelId: req.params.id, isActive: true });
    
    if (!channel) {
      return res.status(404).json({ success: false, message: 'Channel not found' });
    }

    const streamStatus = await checkStream(channel.streamUrl);

    channel.isOnline = streamStatus.isOnline;
    channel.latency = streamStatus.latency;
    channel.lastCheckedAt = new Date();
    await channel.save();
    
    res.json({
      success: true,
      channelId: channel.channelId,
      ...streamStatus,
      checkedAt: new Date()
    });
  } catch (error) {
    next(error);
  }
};
