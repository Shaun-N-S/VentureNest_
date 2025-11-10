import { NextFunction, Request, Response } from "express";

export class PostController {
  constructor() {}

  async addPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
    } catch (error) {
      next(error);
    }
  }
}
