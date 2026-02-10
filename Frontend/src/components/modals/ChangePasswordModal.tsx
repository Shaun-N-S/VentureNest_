import { useState } from "react";
import { useChangePassword } from "../../hooks/Auth/AuthHooks";
import toast from "react-hot-toast";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
  token: string;
};

export const ChangePasswordModal = ({
  open,
  onClose,
  token,
}: ChangePasswordModalProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: resetPassword, isPending } = useChangePassword();

  const handleSubmit = () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    resetPassword(
      { password, token },
      {
        onSuccess: () => {
          toast.success("Password updated successfully");
          onClose();
        },
        onError: () => toast.error("Password update failed"),
      },
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-white rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        {/* New Password */}
        <div className="relative mb-3">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-5">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Button className="w-full" onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </div>
  );
};
