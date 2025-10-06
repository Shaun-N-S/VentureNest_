import React, { useState, useCallback, useMemo } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { useGetAllUsers, useUpdateUserStatus } from "../../hooks/AuthHooks";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface User {
  _id: string;
  userName: string;
  email: string;
  status: "ACTIVE" | "BLOCKED";
}

const Users: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(7);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, isLoading, isError, refetch } = useGetAllUsers(
    page,
    limit,
    statusFilter,
    debouncedSearch
  );
  const { mutate: updateUserStatus, isPending: isUpdating } = useUpdateUserStatus();

  const users: User[] = useMemo(() => data?.data?.users || [], [data]);
  const totalPages = useMemo(() => data?.data?.totalPages || 1, [data]);

  // Debounced search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  }, []);

  const handleSearchClick = useCallback(() => {
    setDebouncedSearch(searchInput.trim());
    setPage(1);
  }, [searchInput]);

  // Status filter handler
  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1);
  }, []);

  // Status toggle handler with optimistic UI
  const handleStatusToggle = useCallback(
    async (userId: string, currentStatus: "ACTIVE" | "BLOCKED") => {
      updateUserStatus(
        { userId, currentStatus },
        {
          onSuccess: () => {
            const newStatus = currentStatus === "ACTIVE" ? "blocked" : "activated";
            toast.success(`User ${newStatus} successfully`);
            refetch(); // Refetch data to get updated list
          },
          onError: (err) => {
            if (err instanceof AxiosError) {
              const errorMsg = err.response?.data?.message || "Failed to update user status";
              toast.error(errorMsg);
            } else {
              toast.error("An unexpected error occurred");
            }
          },
        }
      );
    },
    [updateUserStatus, refetch]
  );

  // Pagination handlers
  const handlePrevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  // Loading State
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Error State
  if (isError) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium">Failed to fetch users</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Users Management</h1>

        {/* Search + Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
          <div className="flex gap-2 w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchInput}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchClick();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            <button
              onClick={handleSearchClick}
              disabled={isUpdating}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Search
            </button>
          </div>

          <select
            value={statusFilter}
            onChange={handleStatusChange}
            disabled={isUpdating}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent disabled:opacity-50"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(user._id, user.status)}
                        disabled={isUpdating}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                          user.status === "ACTIVE"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {user.status}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    <div className="text-gray-400">
                      <p className="text-lg mb-2">📭</p>
                      <p className="italic">No users found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {users.length > 0 && (
          <div className="flex justify-between items-center mt-6  justify-center w-full">
            {/* <div className="text-sm text-gray-600">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, (page - 1) * limit + users.length)} entries
            </div> */}
            
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1 || isUpdating}
                onClick={handlePrevPage}
                className={`px-4 py-2 rounded-md font-medium transition duration-200 ${
                  page === 1 || isUpdating
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                }`}
              >
                ← Previous
              </button>

              <span className="px-4 py-2 text-sm text-gray-700 font-medium">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages || isUpdating}
                onClick={handleNextPage}
                className={`px-4 py-2 rounded-md font-medium transition duration-200 ${
                  page === totalPages || isUpdating
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                }`}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Users;