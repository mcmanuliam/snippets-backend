import express from 'express';
import oauthRoutes from './oauth.routes';
import postRoutes from './post.routes';
import userRoutes from './user.routes';
import platformRoutes from './platform.routes';

const router = express.Router();

router.use('/oauth', oauthRoutes);
router.use('/user', userRoutes);
router.use('/post', postRoutes);
router.use('/platform', platformRoutes);

export default router;
