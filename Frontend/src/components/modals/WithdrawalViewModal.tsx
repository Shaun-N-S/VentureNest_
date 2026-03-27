import type { WithdrawalListItem } from "../../types/withdrawalTypes";
import { Dialog, DialogContent } from "../ui/dialog";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: WithdrawalListItem | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const WithdrawalViewModal = ({
  isOpen,
  onClose,
  data,
  onApprove,
  onReject,
}: Props) => {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-xl">
        {/* HEADER */}
        <h2 className="text-xl font-bold mb-6">Withdrawal Details</h2>

        {/* TOP SECTION (PROJECT + FOUNDER) */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* PROJECT */}
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            {data.project?.logoUrl ? (
              <img
                src={data.project.logoUrl}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-300 rounded-full" />
            )}

            <div>
              <p className="text-sm text-gray-500">Project</p>
              <p className="font-semibold">
                {data.project?.startupName ?? "-"}
              </p>
            </div>
          </div>

          {/* FOUNDER */}
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            {data.project?.founder?.profileImg ? (
              <img
                src={data.project.founder.profileImg}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                {data.project?.founder?.userName?.[0] ?? "F"}
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500">Founder</p>
              <p className="font-semibold">
                {data.project?.founder?.userName ?? "-"}
              </p>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="font-semibold text-green-600">₹{data.amount}</span>
          </div>

          <div>
            <p className="text-gray-500 text-sm mb-1">Request Reason</p>
            <p className="text-sm text-gray-800">
              {data.requestReason || "No reason provided"}
            </p>
          </div>

          {data.rejectionReason && (
            <div>
              <p className="text-gray-500 text-sm mb-1">Rejection Reason</p>
              <p className="text-sm text-red-600">{data.rejectionReason}</p>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                data.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : data.status === "APPROVED"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {data.status}
            </span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        {data.status === "PENDING" && (
          <div className="flex gap-3">
            <button
              onClick={() => onApprove(data.withdrawalId)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium"
            >
              Approve
            </button>

            <button
              onClick={() => onReject(data.withdrawalId)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium"
            >
              Reject
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalViewModal;
