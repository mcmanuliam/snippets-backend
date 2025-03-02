import {find, findById} from '../controllers/snippets.controller';
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
];

const router = new RouteFactory();
router.registerRoutes(snippetRoutes);

export default router.getRouter();
