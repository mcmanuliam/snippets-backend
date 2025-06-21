import {authenticate, callback, logout, refresh} from '../controllers/oauth.controller';
import {authenticated} from '../lib/middleware/auth/authenticated';
import {RouteConfig} from '../lib/route.factory';
import RouteFactory from '../lib/route.factory';

const routes: RouteConfig[] = [
  {
    handler: authenticate,
    method: 'get',
    path: '/:provider',
  },
  {
    handler: callback,
    method: 'get',
    path: '/:provider/callback',
  },
  {
    handler: logout,
    method: 'get',
    path: '/logout',
  },
  {
    handler: logout,
    method: 'get',
    middlewares: [authenticated],
    path: '/logout',
  },
  {
    handler: refresh,
    method: 'post',
    path: '/refresh',
  },
];

const router = new RouteFactory();
router.registerRoutes(routes);

export default router.getRouter();
