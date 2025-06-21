import {executeCode} from '../controllers/code-exec.controller';
import {RouteConfig} from '../lib/route.factory';
import {authenticated} from '../lib/middleware/auth/authenticated';
import RouteFactory from '../lib/route.factory';
import * as post from '../controllers/post.controller';
import * as submission from '../controllers/submissions.controller';

const postRoutes: RouteConfig[] = [
  {
    handler: post.find,
    method: 'get',
    middlewares: [authenticated],
    path: '/',
  },
  {
    handler: post.findById,
    method: 'get',
    middlewares: [authenticated],
    path: '/:id([a-fA-F0-9]{24})',
  },
  {
    handler: post.findDailyChallenge,
    method: 'get',
    middlewares: [authenticated],
    path: '/daily-challenge',
  },
  {
    handler: submission.update,
    method: 'put',
    middlewares: [authenticated],
    path: '/:id([a-fA-F0-9]{24})/submission',
  },
  {
    handler: submission.findOrCreate,
    method: 'post',
    middlewares: [authenticated],
    path: '/:id([a-fA-F0-9]{24})/submission/findOrCreate',
  },
  {
    handler: executeCode,
    method: 'post',
    middlewares: [authenticated],
    path: '/:id([a-fA-F0-9]{24})/submission/exec',
  },
];

const router = new RouteFactory();
router.registerRoutes(postRoutes);

export default router.getRouter();
