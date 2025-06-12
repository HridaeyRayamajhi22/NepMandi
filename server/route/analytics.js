import express from 'express';
import { getDashboardData } from '../controllers/analytics.controller.js';
const analyticsRouter = express.Router();
import { admin } from "../middleware/Admin.js";
import auth from "../middleware/auth.js"; // sets req.userId

analyticsRouter.get('/',auth,admin, getDashboardData);
export default analyticsRouter;