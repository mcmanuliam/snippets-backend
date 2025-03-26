import {executeCode} from '../controllers/code-exec.controller';
import {find, findById, update} from '../controllers/snippets.controller';
import {createSubmission, findSubmission} from '../controllers/submissions.controller';
import {RouteConfig} from '../util/route.factory';
import RouteFactory from '../util/route.factory';

const snippetRoutes: RouteConfig[] = [
  {
    handler: find,
    method: 'get',
    path: '/',
  },
  {
    handler: findById,
    method: 'get',
    path: '/:id',
  },
  {
    handler: update,
    method: 'put',
    path: '/:id',
  },
  {
    handler: createSubmission,
    method: 'post',
    path: '/:id/submission',
  },
  {
    handler: findSubmission,
    method: 'get',
    path: '/:id/submission',
  },
  {
    handler: executeCode,
    method: 'post',
    path: '/:id/exec',
  },
];

const router = new RouteFactory();
router.registerRoutes(snippetRoutes);

export default router.getRouter();
