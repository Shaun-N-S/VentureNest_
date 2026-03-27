export interface PayoutWebhookEvent {
  type: "SUCCESS" | "FAILED";
  transferId: string;
}

export interface IHandleStripePayoutWebhookUseCase {
  execute(event: PayoutWebhookEvent): Promise<void>;
}
