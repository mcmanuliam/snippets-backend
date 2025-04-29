import {Router, Request, Response, NextFunction} from 'express';
import express from 'express';

type Method = 'get' | 'post' | 'put' | 'delete' | 'patch';

type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export interface RouteConfig {
  method: Method;
  path: string;
  middlewares?: RouteHandler[];
  handler?: RouteHandler;
  children?: RouteConfig[];
}

class RouteFactory {
  #router: Router;

  constructor() {
    this.#router = express.Router();
  }

  /**
   * This method takes an array of RouteConfig and registers the routes to the Express router.
   * It also supports nesting routes (via the 'children' property), and appending the basePath.
   *
   * @param routes The array of route configurations to be registered.
   * @param basePath The base path to prepend to the route path. Default is an empty string.
   */
  public registerRoutes(routes: RouteConfig[], basePath = ''): void {
    routes.forEach(({method, path, middlewares = [], handler, children}) => {
      const fullPath = `${basePath}${path}`;

      if (handler) {
        this.#router[method](fullPath, ...middlewares, handler);
      } else {
        this.#router[method](fullPath, ...middlewares);
      }
      if (children) {
        this.registerRoutes(children, fullPath);
      }
    });
  }

  public getRouter(): Router {
    return this.#router;
  }
}

export default RouteFactory;
