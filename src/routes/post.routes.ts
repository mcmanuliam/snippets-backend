import {executeCode} from '../controllers/code-exec.controller';
import {RouteConfig} from '../lib/route.factory';
import RouteFactory from '../lib/route.factory';

import * as post from '../controllers/post.controller';
import * as submission from '../controllers/submissions.controller';

const postRoutes: RouteConfig[] = [
  {
    handler: post.find,
    method: 'get',
    path: '/',
  },
  {
    handler: post.findById,
    method: 'get',
    path: '/:id',
  },
  {
    handler: post.update,
    method: 'put',
    path: '/:id',
  },
  {
    handler: submission.create,
    method: 'post',
    path: '/:id/submission',
  },
  {
    handler: submission.find,
    method: 'get',
    path: '/:id/submission',
  },
  {
    handler: submission.findOrCreate,
    method: 'post',
    path: '/:id/submission/findOrCreate',
  },
  {
    handler: executeCode,
    method: 'post',
    path: '/:id/submission/exec',
  },
];

const router = new RouteFactory();
router.registerRoutes(postRoutes);

export default router.getRouter();
