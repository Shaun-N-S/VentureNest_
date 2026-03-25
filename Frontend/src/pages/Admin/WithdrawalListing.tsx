import { useState, useMemo, useCallback } from "react";
import Table from "../../components/table/Table";
import Pagination from "../../components/pagination/Pagination";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import type { WithdrawalListItem } from "../../types/withdrawalTypes";
import { useGetProjectWithdrawals } from "../../hooks/Wallet/walletHooks";
import { useAdminWithdrawals, useApproveWithdrawal, useRejectWithdrawal } from "../../hooks/Admin/FinanceHooks";

interface TableRow extends WithdrawalListItem {
  id: string;
}

const WithdrawalListing = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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

  const formatted: TableRow[] = withdrawals.map((w) => ({
    ...w,
    id: w.withdrawalId,
  }));

  const handleSearch = () => {
    setDebouncedSearch(searchInput.trim());
    setPage(1);
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
      label: "Project ID",
      render: (row: TableRow) => row.projectId,
    },
    {
      id: "amount",
      label: "Amount",
      render: (row: TableRow) => `₹${row.amount}`,
    },
    {
      id: "status",
      label: "Status",
      render: (row: TableRow) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            row.status === "PENDING"
              ? "bg-yellow-100 text-yellow-700"
              : row.status === "COMPLETED"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      id: "action",
      label: "Action",
      render: (row: TableRow) =>
        row.status === "PENDING" ? (
          <div className="flex gap-2">
            <button
              onClick={() =>
                approve(row.withdrawalId, {
                  onSuccess: () => toast.success("Approved"),
                })
              }
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Approve
            </button>

            <button
              onClick={() =>
                reject(row.withdrawalId, {
                  onSuccess: () => toast.success("Rejected"),
                })
              }
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Reject
            </button>
          </div>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-xl font-bold mb-4">Withdrawals</h1>

      {/* SEARCH + FILTER */}
      <div className="flex gap-2 mb-4">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border p-2 rounded"
        />

        <button onClick={handleSearch}>Search</button>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Approved</option>
          <option value="FAILED">Rejected</option>
        </select>
      </div>

      <Table<TableRow> headers={headers} data={formatted} />

      <Pagination
        totalPages={totalPages}
        currentPage={page}
        setPage={setPage}
      />
    </div>
  );
};

export default WithdrawalListing;
