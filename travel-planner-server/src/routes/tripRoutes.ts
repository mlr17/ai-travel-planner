import express, { Router, RequestHandler } from 'express';
import { generateTrip, healthCheck } from '../controllers/tripController';

const router: Router = express.Router();

/**
 * 生成行程规划
 * POST /api/trips/generate
 */
router.post('/generate', generateTrip as RequestHandler);

/**
 * 健康检查
 * GET /api/trips/health
 */
router.get('/health', healthCheck as RequestHandler);

export default router; 