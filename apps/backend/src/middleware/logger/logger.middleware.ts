import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const logger = new Logger('HTTP')
    const { method, url, ip, path } = req;
    const startTime = Date.now();
    const baseUrl = req.baseUrl;

    // Log request
    logger.log(`[Request] ${method} ${baseUrl} - ${ip}`);

    // Capture response finish
    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;

      logger.log(`[Response] ${method} ${baseUrl} ${statusCode} - ${duration}ms`);
    });

    next();
  }
}
