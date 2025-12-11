import { X } from "lucide-react";
import Pagination from "../../components/pagination/Pagination";
import Table from "../../components/table/Table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useFetchAllInvestorsKyc, useFetchAllUsersKyc } from "../../hooks/Admin/KYCHooks";
import type { KYCStatus } from "../../types/KycStatusType";
import VerificationModal from "../../components/modals/ProfileVerificationModal";

// Define base interface for common properties
interface BaseRow {
    _id: string;
    userName: string;
    profileImg: string;
    email: string;
    role: string;
    idNumber: string;
    kycStatus: KYCStatus;
    website?: string;
    dateOfBirth?: string;
    linkedInUrl?: string;
}

interface UserRow extends BaseRow {
    id?: string | number;
    role: "USER";
    selfieImg?: string;
    aadharImg?: string;
    phoneNumber?: string;
    address?: string;
}

interface InvestorRow extends BaseRow {
    id?: string | number;
    role: "INVESTOR";
    specialization?: string;
    selfieImg?: string;
    aadharImg?: string;
    phoneNumber?: string;
    address?: string;
    investmentMin?: number;
    investmentMax?: number;
    companyName?: string;
    location?: string;
}

const VerificationPage = () => {
    const [activeTab, setActiveTab] = useState<"users" | "investors">("users");
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserRow | InvestorRow | null>(null);

    const { data: userData, refetch: refetchUsers } = useFetchAllUsersKyc(
        page,
        limit,
        statusFilter,
        debouncedSearch
    );
    const { data: investorData, refetch: refetchInvestors } = useFetchAllInvestorsKyc(
        page,
        limit,
        statusFilter,
        debouncedSearch
    );

    console.log("Search params:", { page, limit, statusFilter, debouncedSearch, activeTab }, "userData :", userData, "investorData :", investorData);

    // Get data from API based on active tab
    const allData = useMemo(() => {
        if (activeTab === "users") {
            return (userData?.data?.data?.usersKyc as UserRow[]) || [];
        } else {
            return (investorData?.data?.data?.investorsKyc as InvestorRow[]) || [];
        }
    }, [activeTab, userData, investorData]);

    // Paginate data
    const paginatedData = allData;

    const totalPages =
        activeTab === "users"
            ? userData?.data?.data?.totalPages || 1
            : investorData?.data?.data?.totalPages || 1;

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    }, []);

    const handleSearchClick = useCallback(() => {
        setDebouncedSearch(searchInput.trim());
        setPage(1);
    }, [searchInput]);

    const handleClearSearch = useCallback(() => {
        setSearchInput("");
        setDebouncedSearch("");
        setPage(1);
    }, []);

    const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
        setPage(1);
    }, []);

    const handleViewClick = useCallback((row: UserRow | InvestorRow) => {
        setSelectedUser(row);
        setModalOpen(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setModalOpen(false);
    }, []);

    // User headers
    const userHeaders = useMemo(
        () => [
            {
                id: "no",
                label: "No",
                render: (row: UserRow) =>
                    String(
                        (page - 1) * limit +
                        (paginatedData as UserRow[]).findIndex((u) => u._id === row._id) +
                        1
                    ),
            },
            {
                id: "name",
                label: "Name",
                render: (row: UserRow) => (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            {row.profileImg ? (
                                <img
                                    src={row.profileImg}
                                    alt={row.userName}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-white">
                                    {row.userName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <span>{row.userName}</span>
                    </div>
                ),
            },
            {
                id: "role",
                label: "Role",
                render: (row: UserRow) => row.role,
            },
            {
                id: "view",
                label: "View",
                render: (row: UserRow) => (
                    <button
                        onClick={() => handleViewClick(row)}
                        className="px-6 py-1.5 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition"
                    >
                        View
                    </button>
                ),
            },
            {
                id: "status",
                label: "Status",
                render: (row: UserRow) => (
                    <span
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold ${row.kycStatus === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : row.kycStatus === "REJECTED"
                                ? "bg-red-100 text-red-700"
                                : row.kycStatus === "SUBMITTED"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-yellow-100 text-yellow-700"
                            }`}
                    >
                        {row.kycStatus.charAt(0) + row.kycStatus.slice(1).toLowerCase()}
                    </span>
                ),
            },
        ],
        [page, limit, paginatedData, handleViewClick]
    );

    // Investor headers
    const investorHeaders = useMemo(
        () => [
            {
                id: "sl",
                label: "Sl",
                render: (row: InvestorRow) =>
                    String(
                        (page - 1) * limit +
                        (paginatedData as InvestorRow[]).findIndex((u) => u._id === row._id) +
                        1
                    ),
            },
            {
                id: "name",
                label: "Name",
                render: (row: InvestorRow) => (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            {row.profileImg ? (
                                <img
                                    src={row.profileImg}
                                    alt={row.userName}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-white">
                                    {row.userName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <span>{row.userName}</span>
                    </div>
                ),
            },
            {
                id: "role",
                label: "Role",
                render: (row: InvestorRow) => row.role,
            },
            {
                id: "view",
                label: "View",
                render: (row: InvestorRow) => (
                    <button
                        onClick={() => handleViewClick(row)}
                        className="px-6 py-1.5 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition"
                    >
                        View
                    </button>
                ),
            },
            {
                id: "status",
                label: "Status",
                render: (row: InvestorRow) => (
                    <span
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold ${row.kycStatus === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : row.kycStatus === "REJECTED"
                                ? "bg-red-100 text-red-700"
                                : row.kycStatus === "SUBMITTED"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-yellow-100 text-yellow-700"
                            }`}
                    >
                        {row.kycStatus.charAt(0) + row.kycStatus.slice(1).toLowerCase()}
                    </span>
                ),
            },
        ],
        [page, limit, paginatedData, handleViewClick]
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Verifications</h1>

                    {/* Tabs */}
                    <Tabs
                        value={activeTab}
                        onValueChange={(value) => {
                            setActiveTab(value as "users" | "investors");
                            setPage(1);
                        }}
                        className="w-full"
                    >
                        <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg">
                            <TabsTrigger
                                value="users"
                                className="px-6 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                            >
                                Users
                            </TabsTrigger>
                            <TabsTrigger
                                value="investors"
                                className="px-6 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                            >
                                Investors
                            </TabsTrigger>
                        </TabsList>

                        {/* Search and Filter */}
                        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
                            <div className="flex gap-2 w-full md:w-1/3 relative">
                                <input
                                    type="text"
                                    placeholder="Search by name or email"
                                    value={searchInput}
                                    onChange={handleSearchChange}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
                                    className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                />
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
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Search
                                </button>
                            </div>

                            <select
                                value={statusFilter}
                                onChange={handleStatusChange}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                            >
                                <option value="">All Status</option>
                                <option value="APPROVED">Approved</option>
                                <option value="SUBMITTED">Submitted</option>
                                {/* <option value="PENDING">Pending</option> */}
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>

                        <TabsContent value="users" className="mt-0">
                            <Table<UserRow> headers={userHeaders} data={paginatedData as UserRow[]} />
                        </TabsContent>

                        <TabsContent value="investors" className="mt-0">
                            <Table<InvestorRow>
                                headers={investorHeaders}
                                data={paginatedData as InvestorRow[]}
                            />
                        </TabsContent>
                    </Tabs>

                    {/* Pagination */}
                    {paginatedData.length > 0 && (
                        <Pagination totalPages={totalPages} currentPage={page} setPage={setPage} />
                    )}
                </div>
            </div>

            {/* Verification Modal */}
            <VerificationModal
                isOpen={modalOpen}
                onClose={handleModalClose}
                data={selectedUser}
            />
        </div>
    );
};

export default VerificationPage;