import express from 'express';
import { getChannels, getChannelById, getGroups, checkChannelStream, recheckAllChannels } from '../controllers/channelController.js';

const router = express.Router();

/**
 * @swagger
 * /api/channels/groups:
 *   get:
 *     summary: Lấy danh sách các nhóm kênh
 *     description: Trả về danh sách tất cả các nhóm (VD XemTV)
 *     tags: [Channels]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/groups', getGroups);

/**
 * @swagger
 * /api/channels:
 *   get:
 *     summary: Lấy danh sách toàn bộ kênh
 *     description: Lấy danh sách kênh, hỗ trợ lọc theo nhóm và tìm kiếm
 *     tags: [Channels]
 *     parameters:
 *       - in: query
 *         name: group
 *         schema:
 *           type: string
 *         description: Tên nhóm (VD XemTV)
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm tên kênh
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', getChannels);

/**
 * @swagger
 * /api/channels/{id}:
 *   get:
 *     summary: Lấy chi tiết một kênh
 *     description: Lấy thông tin kênh dựa vào ID (slug)
 *     tags: [Channels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của kênh (VD vtv1)
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy kênh
 */
router.get('/:id', getChannelById);

/**
 * @swagger
 * /api/channels/{id}/check:
 *   get:
 *     summary: Kiểm tra trạng thái stream
 *     description: Kiểm tra xem link HLS của kênh còn sống (online) hay không
 *     tags: [Channels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của kênh (VD vtv1)
 *     responses:
 *       200:
 *         description: Trả về trạng thái online và latency
 *       404:
 *         description: Không tìm thấy kênh
 */
// router.get('/:id/check', checkChannelStream);

/**
 * @swagger
 * /api/channels/recheck:
 *   post:
 *     summary: Kiểm tra trạng thái stream
 *     description: Kiểm tra xem link HLS của kênh còn sống (online) hay không
 *     tags: [Channels]
 *     responses:
 *       200:
 *         description: Trả về trạng thái online và latency
 */
// router.post('/recheck', recheckAllChannels);

export default router;
