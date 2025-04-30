import {executeCode} from '../controllers/code-exec.controller';
import {RouteConfig} from '../lib/route.factory';
import RouteFactory from '../lib/route.factory';

import * as snippet from '../controllers/snippets.controller';
import * as submission from '../controllers/submissions.controller';

const snippetRoutes: RouteConfig[] = [
  {
    handler: snippet.find,
    method: 'get',
    path: '/',
  },
  {
    handler: snippet.findById,
    method: 'get',
    path: '/:id',
  },
  {
    handler: snippet.update,
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
router.registerRoutes(snippetRoutes);

export default router.getRouter();
