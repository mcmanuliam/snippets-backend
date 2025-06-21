import {Request, Response} from 'express';
import mongoose from 'mongoose';
import env from '../util/env';
import os from 'os';

export function health(_req: Request, res: Response): void {
  try {
    const systemStatus = {
      arch: os.arch(),
      environment: env('NODE_ENV', 'development'),
      hostname: os.hostname(),
      nodeVersion: process.version,
      platform: os.platform(),
    };

    const services = {
      mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    };

    const resources = {
      cpuUsage: process.cpuUsage(),
      loadAverage: os.loadavg(),
      memoryUsage: process.memoryUsage(),
      systemUptime: os.uptime(),
      uptime: process.uptime(),
    };

    res.ok({
      meta: {
        responseTime: `${process.hrtime()[1] / 1_000_000}ms`,
      },
      resources,
      services,
      system: systemStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.negotiate(error);
  }
}
