import express from 'express';

export class AppRouter {
  private static _instance: express.Router;

  static get instance(): express.Router {
    if (!this._instance) {
      this._instance = express.Router();
    }
    return this._instance;
  }
}
