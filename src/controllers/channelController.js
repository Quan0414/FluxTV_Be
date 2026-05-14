import Channel from '../models/Channel.js';
import { checkStream } from '../services/streamChecker.js';
import { StatusCodes } from 'http-status-codes';
import { successResponse, errorResponse } from '../utils/response.js';

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
    return successResponse(res, {
      message: 'Channels fetched successfully',
      data: { channels }
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
      return errorResponse(res, {
        message: 'Channel not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    return successResponse(res, {
      message: 'Channel found successfully',
      data: { channel }
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
    return successResponse(res, {
      message: 'Groups fetched successfully',
      data: { groups }
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
      return errorResponse(res, {
        message: 'Channel not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const streamStatus = await checkStream(channel.streamUrl);

    channel.isOnline = streamStatus.isOnline;
    channel.latency = streamStatus.latency;
    channel.lastCheckedAt = new Date();
    await channel.save();

    return successResponse(res, {
      message: 'Channel checked successfully',
      data: {
        channelId: channel.channelId,
        ...streamStatus,
        checkedAt: new Date()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Recheck all channels stream status
// @route   POST /api/channels/recheck
export const recheckAllChannels = async (req, res, next) => {
  try {
    const channels = await Channel.find({ isActive: true });

    await Promise.all(
      channels.map(async (channel) => {
        try {
          const streamStatus = await checkStream(channel.streamUrl);

          channel.isOnline = streamStatus.isOnline;
          channel.latency = streamStatus.latency;
          channel.lastCheckedAt = new Date();

          await channel.save();

          return {
            channelId: channel.channelId,
            success: true,
            ...streamStatus
          };
        } catch (error) {
          return {
            channelId: channel.channelId,
            success: false
          };
        }
      })
    );

    return successResponse(res, {
      message: 'Recheck completed'
    });
  } catch (error) {
    next(error);
  }
};
