import {current, destroy, findById} from '../controllers/user.controller';
import {authenticated} from '../lib/middleware/authenticated';
import {RouteConfig} from '../lib/route.factory';
import RouteFactory from '../lib/route.factory';

const routes: RouteConfig[] = [
  {
    handler: current,
    method: 'get',
    middlewares: [authenticated],
    path: '/current',
  },
  {
    handler: findById,
    method: 'get',
    middlewares: [authenticated],
    path: '/:id',
  },
  {
    handler: destroy,
    method: 'delete',
    middlewares: [authenticated],
    path: '/',
  },
];

const router = new RouteFactory();
router.registerRoutes(routes);

export default router.getRouter();
