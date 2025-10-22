import React, { useState, useCallback, useMemo } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import Table from "../../components/table/Table";
import Pagination from "../../components/pagination/Pagination";
import { useGetAllUsers, useUpdateUserStatus } from "../../hooks/AuthHooks";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { X } from "lucide-react";
import StatusChangeModal from "../../components/modals/StatusChangeModal";

interface User {
    _id: string;
    userName: string;
    email: string;
    status: "ACTIVE" | "BLOCKED";
}

interface TableUser extends User {
    id: string;
}

const UsersListing: React.FC = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const { data, isLoading, isError, refetch } = useGetAllUsers(
        page,
        limit,
        statusFilter,
        debouncedSearch
    );
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{
        id: string;
        name: string;
        status: "ACTIVE" | "BLOCKED";
    } | null>(null);


    const { mutate: updateUserStatus, isPending: isUpdating } = useUpdateUserStatus();


    const users: User[] = useMemo(() => data?.data?.data?.users || [], [data]);
    const totalPages = useMemo(() => data?.data?.data?.totalPages || 1, [data]);
    console.log(data?.data?.data?.users);
    console.log(totalPages)


    const formattedUsers: TableUser[] = useMemo(
        () =>
            users.map((u) => ({
                ...u,
                id: u._id,
            })),
        [users]
    );

    // Search handler
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

    // Toggle user active/block status
    const handleStatusToggle = useCallback(
        (userId: string, currentStatus: "ACTIVE" | "BLOCKED") => {
            updateUserStatus(
                { userId, currentStatus },
                {
                    onSuccess: () => {
                        const newStatus = currentStatus === "ACTIVE" ? "blocked" : "activated";
                        toast.success(`User ${newStatus} successfully`);
                        refetch();
                    },
                    onError: (err) => {
                        if (err instanceof AxiosError) {
                            toast.error(err.response?.data?.message || "Failed to update user status");
                        } else {
                            toast.error("An unexpected error occurred");
                        }
                    },
                }
            );
        },
        [updateUserStatus, refetch]
    );

    const handleClearSearch = useCallback(() => {
        setSearchInput("");
        setDebouncedSearch("");
        setPage(1);
        refetch();
    }, [refetch]);

    // Properly typed table headers
    const headers = useMemo(
        () => [
            {
                id: "index",
                label: "#",
                render: (row: TableUser) =>
                    String((page - 1) * limit + formattedUsers.findIndex((u) => u._id === row._id) + 1),
            },
            {
                id: "name",
                label: "Name",
                render: (row: TableUser) => row.userName,
            },
            {
                id: "email",
                label: "Email",
                render: (row: TableUser) => row.email,
            },
            {
                id: "status",
                label: "Status",
                render: (row: TableUser) => (
                    <button
                        onClick={() => {
                            setSelectedUser({ id: row._id, name: row.userName, status: row.status });
                            setModalOpen(true);
                        }}
                        disabled={isUpdating}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition duration-200 disabled:opacity-50 ${row.status === "ACTIVE"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                    >
                        {row.status}
                    </button>
                ),
            },


        ],
        [isUpdating, page, limit, formattedUsers]
    );

    // Loading UI
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

    // Error UI
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

                {/* Search + Filter */}
                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
                    <div className="flex gap-2 w-full md:w-1/3 relative">
                        <input
                            type="text"
                            placeholder="Search by name or email"
                            value={searchInput}
                            onChange={handleSearchChange}
                            onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
                            className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-400"
                        />

                        {/* Clear button inside input */}
                        {searchInput && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute right-20 top-2.5 text-gray-500 hover:text-red-500"
                            >
                                <X size={18} />
                            </button>
                        )}

                        <button
                            onClick={handleSearchClick}
                            disabled={isUpdating}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            Search
                        </button>
                    </div>

                    <select
                        value={statusFilter}
                        onChange={handleStatusChange}
                        disabled={isUpdating}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="BLOCKED">Blocked</option>
                    </select>
                </div>

                {/* Reusable Table */}
                <Table<TableUser> headers={headers} data={formattedUsers} />

                {selectedUser && (
                    <StatusChangeModal
                        isOpen={modalOpen}
                        onClose={() => setModalOpen(false)}
                        name={selectedUser.name}
                        currentStatus={selectedUser.status}
                        onConfirm={() => {
                            handleStatusToggle(selectedUser.id, selectedUser.status);
                            setModalOpen(false);
                        }}
                    />
                )}



                {/* Pagination */}
                {formattedUsers.length > 0 && (
                    <Pagination totalPages={totalPages} currentPage={page} setPage={setPage} />
                )}
            </div>
        </AdminLayout>
    );
};

export default UsersListing;
