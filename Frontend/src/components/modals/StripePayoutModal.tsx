import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import {
  useCreateStripeAccount,
  useGetStripeOnboardingLink,
} from "../../hooks/Wallet/walletHooks";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../store/store";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function StripePayoutModal({ open, onClose }: Props) {
  const user = useSelector((state: Rootstate) => state.authData);

  const { mutate: createAccount, isPending: creating } =
    useCreateStripeAccount();

  const { mutate: getLink, isPending: loadingLink } =
    useGetStripeOnboardingLink();

  const handleSetup = () => {
    if (!user.stripeAccountId) {
      createAccount(undefined, {
        onSuccess: () => {
          getLink();
        },
      });
    } else {
      getLink();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="p-6 space-y-4">
        <h2 className="text-lg font-bold">Setup Payout</h2>

        {!user.stripeAccountId && (
          <p className="text-sm text-gray-500">
            Connect your Stripe account to receive withdrawals.
          </p>
        )}

        {user.stripeAccountId && !user.stripeOnboardingComplete && (
          <p className="text-sm text-yellow-600">
            Complete your Stripe onboarding.
          </p>
        )}

        {user.stripeOnboardingComplete && (
          <p className="text-sm text-green-600">Stripe account connected ✅</p>
        )}

        {!user.stripeOnboardingComplete && (
          <Button
            onClick={handleSetup}
            disabled={creating || loadingLink}
            className="w-full"
          >
            {creating || loadingLink
              ? "Processing..."
              : user.stripeAccountId
                ? "Continue Setup"
                : "Start Setup"}
          </Button>
        )}
      </div>
    </Dialog>
  );
}
