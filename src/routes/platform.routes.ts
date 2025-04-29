import {health} from '../controllers/platform.controller';
import {RouteConfig} from '../lib/route.factory';
import RouteFactory from '../lib/route.factory';

const platformRoutes: RouteConfig[] = [{
  handler: health,
  method: 'get',
  path: '/health',
}]

const router = new RouteFactory();
router.registerRoutes(platformRoutes);

export default router.getRouter();
