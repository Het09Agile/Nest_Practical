import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class UpdateProductMiddleware implements NestMiddleware {
  use(req: any, res: any, next: NextFunction) {
    if (req.body.owner) {
      req.body.owner = undefined;
    }
    next();
  }
}
