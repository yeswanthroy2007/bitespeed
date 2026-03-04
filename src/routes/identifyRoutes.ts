import { Router } from 'express';
import * as identifyController from '../controllers/identifyController.js';

const router = Router();

router.post('/identify', identifyController.identify);

export default router;
