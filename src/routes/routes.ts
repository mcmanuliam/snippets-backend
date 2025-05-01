import express from 'express';
import authRoutes from './auth.routes';
import postRoutes from './post.routes';
import userRoutes from './user.routes';
import platformRoutes from './platform.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/post', postRoutes);
router.use('/platform', platformRoutes);

export default router;
