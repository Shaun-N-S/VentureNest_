import { useState, useMemo, useEffect } from "react";
import Table from "../../components/table/Table";
import Pagination from "../../components/pagination/Pagination";
import toast from "react-hot-toast";
import type { WithdrawalListItem } from "../../types/withdrawalTypes";
import {
  useAdminWithdrawals,
  useApproveWithdrawal,
  useRejectWithdrawal,
} from "../../hooks/Admin/FinanceHooks";
import RejectReasonModal from "../../components/modals/RejectReasonModal";
import WithdrawalViewModal from "../../components/modals/WithdrawalViewModal";
import { useDebounce } from "../../hooks/Debounce/useDebounce";

interface TableRow extends WithdrawalListItem {
  id: string;
}

const WithdrawalListing = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<WithdrawalListItem | null>(null);

  const { data } = useAdminWithdrawals(
    page,
    limit,
    statusFilter,
    debouncedSearch,
  );

  const { mutate: approve } = useApproveWithdrawal();
  const { mutate: reject } = useRejectWithdrawal();

  const withdrawals = useMemo(() => data?.data || [], [data]);

  const totalPages = useMemo(
    () => Math.ceil((data?.total || 0) / limit),
    [data, limit],
  );

  const formatted: TableRow[] = withdrawals.map((w: WithdrawalListItem) => ({
    ...w,
    id: w.withdrawalId,
  }));

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const handleView = (row: TableRow) => {
    setSelectedWithdrawal(row);
    setViewOpen(true);
  };


  const headers = [
    {
      id: "index",
      label: "#",
      render: (row: TableRow) =>
        String(
          (page - 1) * limit + formatted.findIndex((u) => u.id === row.id) + 1,
        ),
    },
    {
      id: "project",
      label: "Project",
      render: (row: TableRow) => (
        <div className="flex items-center gap-3">
          {row.project?.logoUrl ? (
            <img
              src={row.project.logoUrl}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
          )}

          <span className="font-medium">{row.project?.startupName ?? "-"}</span>
        </div>
      ),
    },
    {
      id: "founder",
      label: "Founder",
      render: (row: TableRow) => (
        <div className="flex items-center gap-2">
          {row.project?.founder?.profileImg ? (
            <img
              src={row.project.founder.profileImg}
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-xs">
              {row.project?.founder?.userName?.[0] ?? "F"}
            </div>
          )}

          <span>{row.project?.founder?.userName ?? "-"}</span>
        </div>
      ),
    },
    {
      id: "amount",
      label: "Amount",
      render: (row: TableRow) => `₹${row.amount}`,
    },
    {
      id: "status",
      label: "Status",
      render: (row: TableRow) => {
        const STATUS_CONFIG: Record<string, string> = {
          PENDING: "bg-yellow-100 text-yellow-700",
          APPROVED: "bg-green-100 text-green-700",
          REJECTED: "bg-red-100 text-red-700",
        };

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              STATUS_CONFIG[row.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      id: "action",
      label: "Action",
      render: (row: TableRow) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(row)}
            className="px-6 py-1.5 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-xl font-bold mb-4">Withdrawals</h1>

      {/* SEARCH + FILTER */}
      <div className="flex gap-3 mb-4">
        <input
          placeholder="Search by project"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border px-4 py-2 rounded-lg w-64"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <Table<TableRow> headers={headers} data={formatted} />

      <Pagination
        totalPages={totalPages}
        currentPage={page}
        setPage={setPage}
      />

      <RejectReasonModal
        isOpen={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onSubmit={(reason) => {
          reject(
            { id: selectedId, reason },
            {
              onSuccess: () => {
                toast.success("Rejected");
                setRejectOpen(false);
                setViewOpen(false);
              },
            },
          );
        }}
      />

      <WithdrawalViewModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        data={selectedWithdrawal}
        onApprove={(id: string) => {
          approve(id, {
            onSuccess: () => {
              setViewOpen(false);
            },
          });
        }}
        onReject={(id: string) => {
          setSelectedId(id);
          setRejectOpen(true);
        }}
      />
    </div>
  );
};

export default WithdrawalListing;
