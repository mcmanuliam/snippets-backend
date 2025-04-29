import {githubCallback, logout} from '../controllers/auth.controller';
import {authenticated} from '../lib/middleware/authenticated';
import {RouteConfig} from '../lib/route.factory';
import RouteFactory from '../lib/route.factory';
import passport from '../passport';

const routes: RouteConfig[] = [
  {
    method: 'get',
    middlewares: [
      passport.authenticate('github', {scope: ['user:email']}),
    ],
    path: '/github',
  },
  {
    handler: githubCallback,
    method: 'get',
    middlewares: [
      passport.authenticate('github', {
        failureRedirect: '/',
        session: true,
      }),
    ],
    path: '/github/callback',
  },
  {
    handler: logout,
    method: 'get',
    middlewares: [authenticated],
    path: '/logout',
  },
];

const router = new RouteFactory();
router.registerRoutes(routes);

export default router.getRouter();
