import { webhookController } from "@infrastructure/DI/webhook/webhookContainer";
import { Router } from "express";
import express from "express";

export class Webhook_Routes {
  private _router: Router;

  constructor() {
    this._router = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.post(
      "/stripe",
      express.raw({ type: "application/json" }),
      webhookController.handleStripeWebhook
    );
  }

  get_router() {
    return this._router;
  }
}
