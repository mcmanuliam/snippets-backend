import {find, findById} from '../controllers/snippets.controller';
import {createSubmission} from '../controllers/submissions.controller';
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
    handler: createSubmission,
    method: 'post',
    path: '/:id/submission',
  },
];

const router = new RouteFactory();
router.registerRoutes(snippetRoutes);

export default router.getRouter();
