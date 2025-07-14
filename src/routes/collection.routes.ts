import {RouteConfig} from '../lib/route.factory';
import {authenticated} from '../lib/middleware/auth/authenticated';
import RouteFactory from '../lib/route.factory';
import {find, findById} from '../controllers/collections.controller';

const postRoutes: RouteConfig[] = [
  {
    handler: find,
    method: 'get',
    middlewares: [authenticated],
    path: '/',
  },
  {
    handler: findById,
    method: 'get',
    middlewares: [authenticated],
    path: '/:id([a-fA-F0-9]{24})',
  },
];

const router = new RouteFactory();
router.registerRoutes(postRoutes);

export default router.getRouter();
