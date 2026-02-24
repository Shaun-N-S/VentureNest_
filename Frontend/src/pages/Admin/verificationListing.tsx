import { X } from "lucide-react";
import Pagination from "../../components/pagination/Pagination";
import Table from "../../components/table/Table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useCallback, useMemo, useState } from "react";
import {
  useFetchAllInvestorsKyc,
  useFetchAllUsersKyc,
} from "../../hooks/Admin/KYCHooks";
import type { KYCStatus } from "../../types/KycStatusType";
import VerificationModal from "../../components/modals/ProfileVerificationModal";
import { useGetAllProjectRegistrations } from "../../hooks/Admin/ProjectHooks";
import type { ProjectRegistrationStatus } from "../../types/projectRegistrationStatus";
import type { AdminProjectRegistration } from "../../types/AdminProjectRegistrationType";
import ProjectVerificationModal from "../../components/modals/ProjectVerificationModal";
import { useDebounce } from "../../hooks/Debounce/useDebounce";

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

type ProjectRow = AdminProjectRegistration;

const VerificationPage = () => {
  const [activeTab, setActiveTab] = useState<
    "users" | "investors" | "projects"
  >("users");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [statusFilter, setStatusFilter] = useState<
    ProjectRegistrationStatus | ""
  >("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<
    UserRow | InvestorRow | null
  >(null);
  const [selectedProject, setSelectedProject] = useState<ProjectRow | null>(
    null,
  );

  const { data: userData } = useFetchAllUsersKyc(
    page,
    limit,
    statusFilter,
    debouncedSearch,
    activeTab === "users",
  );

  const { data: investorData } = useFetchAllInvestorsKyc(
    page,
    limit,
    statusFilter,
    debouncedSearch,
    activeTab === "investors",
  );

  const projectStatus =
    activeTab === "projects"
      ? (statusFilter as ProjectRegistrationStatus | undefined)
      : undefined;

  const { data: projectRegistrationData } = useGetAllProjectRegistrations(
    page,
    limit,
    projectStatus,
    debouncedSearch,
    activeTab === "projects",
  );

  const allData = useMemo(() => {
    if (activeTab === "users") {
      return userData?.data?.data?.usersKyc ?? [];
    }

    if (activeTab === "investors") {
      return investorData?.data?.data?.investorsKyc ?? [];
    }

    return projectRegistrationData?.registrations ?? [];
  }, [activeTab, userData, investorData, projectRegistrationData]);

  // Paginate data
  const paginatedData = allData;

  const totalPages =
    activeTab === "users"
      ? (userData?.data?.data?.totalPages ?? 1)
      : activeTab === "investors"
        ? (investorData?.data?.data?.totalPages ?? 1)
        : (projectRegistrationData?.totalPages ?? 1);

  const handleViewClick = useCallback(
    (row: UserRow | InvestorRow | ProjectRow) => {
      if ("registrationId" in row) {
        setSelectedProject(row);
        setSelectedUser(null);
      } else {
        setSelectedUser(row);
        setSelectedProject(null);
      }

      setModalOpen(true);
    },
    [],
  );

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;

      setStatusFilter(value === "" ? "" : (value as ProjectRegistrationStatus));

      setPage(1);
    },
    [],
  );

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
              1,
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
                  {row?.userName ? row.userName.charAt(0).toUpperCase() : "U"}
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
        render: (row: UserRow) => {
          const status = row?.kycStatus;

          if (!status || typeof status !== "string") {
            return (
              <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                Pending
              </span>
            );
          }

          return (
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                status === "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : status === "REJECTED"
                    ? "bg-red-100 text-red-700"
                    : status === "SUBMITTED"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
            </span>
          );
        },
      },
    ],
    [page, limit, paginatedData, handleViewClick],
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
              (paginatedData as InvestorRow[]).findIndex(
                (u) => u._id === row._id,
              ) +
              1,
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
                  {row?.userName ? row.userName.charAt(0).toUpperCase() : "I"}
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
        render: (row: InvestorRow) => {
          const status = row?.kycStatus;

          if (!status || typeof status !== "string") {
            return (
              <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                Pending
              </span>
            );
          }

          return (
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                status === "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : status === "REJECTED"
                    ? "bg-red-100 text-red-700"
                    : status === "SUBMITTED"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
            </span>
          );
        },
      },
    ],
    [page, limit, paginatedData, handleViewClick],
  );

  const projectHeaders = useMemo(
    () => [
      {
        id: "sl",
        label: "Sl",
        render: (row: ProjectRow) =>
          String(
            (page - 1) * limit +
              allData.findIndex(
                (p: ProjectRow) => p.registrationId === row.registrationId,
              ) +
              1,
          ),
      },
      {
        id: "startup",
        label: "Startup",
        render: (row: ProjectRow) => (
          <div className="flex items-center gap-2">
            {row?.project?.logoUrl ? (
              <img
                src={row.project.logoUrl}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full" />
            )}
            <span>{row?.project?.startupName ?? "-"}</span>
          </div>
        ),
      },
      {
        id: "founder",
        label: "Founder",
        render: (row: ProjectRow) => (
          <div className="flex items-center gap-2">
            {row?.founder?.profileImg ? (
              <img
                src={row.founder.profileImg}
                alt={row.founder.userName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-white">
                {row?.founder?.userName
                  ? row.founder.userName.charAt(0).toUpperCase()
                  : "F"}
              </div>
            )}
            <span>{row?.founder?.userName ?? "-"}</span>
          </div>
        ),
      },
      {
        id: "status",
        label: "Status",
        render: (row: ProjectRow) => {
          const status = row.status;

          const STATUS_CONFIG: Record<
            ProjectRegistrationStatus,
            { className: string; label: string }
          > = {
            APPROVED: {
              className: "bg-green-100 text-green-700",
              label: "Approved",
            },
            REJECTED: {
              className: "bg-red-100 text-red-700",
              label: "Rejected",
            },
            SUBMITTED: {
              className: "bg-blue-100 text-blue-700",
              label: "Submitted",
            },
            PENDING: {
              className: "bg-yellow-100 text-yellow-700",
              label: "Pending",
            },
          };

          const config = STATUS_CONFIG[status];

          return (
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-semibold ${config.className}`}
            >
              {config.label}
            </span>
          );
        },
      },
      {
        id: "view",
        label: "View",
        render: (row: ProjectRow) => (
          <button
            onClick={() => handleViewClick(row)}
            className="px-6 py-1.5 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition"
          >
            View
          </button>
        ),
      },
    ],
    [page, limit, allData, handleViewClick],
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Verifications
          </h1>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value as "users" | "investors" | "projects");
              setPage(1);
              setModalOpen(false);
              setSelectedUser(null);
              setSelectedProject(null);
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
              <TabsTrigger
                value="projects"
                className="px-6 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Projects
              </TabsTrigger>
            </TabsList>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
              <div className="flex gap-2 w-full md:w-1/3 relative">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />

                {searchInput && (
                  <button
                    onClick={() => setSearchInput("")}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-red-500"
                  >
                    <X size={18} />
                  </button>
                )}
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
              <Table<UserRow>
                headers={userHeaders}
                data={paginatedData as UserRow[]}
              />
            </TabsContent>

            <TabsContent value="investors" className="mt-0">
              <Table<InvestorRow>
                headers={investorHeaders}
                data={paginatedData as InvestorRow[]}
              />
            </TabsContent>

            <TabsContent value="projects" className="mt-0">
              <Table<ProjectRow & { id: string }>
                headers={projectHeaders}
                data={(allData as ProjectRow[]).map((p) => ({
                  ...p,
                  id: p.registrationId,
                }))}
              />
            </TabsContent>
          </Tabs>

          {/* Pagination */}
          {paginatedData.length > 0 && (
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              setPage={setPage}
            />
          )}
        </div>
      </div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={modalOpen && !!selectedUser}
        onClose={handleModalClose}
        data={selectedUser}
      />

      <ProjectVerificationModal
        isOpen={modalOpen && !!selectedProject}
        onClose={() => {
          setModalOpen(false);
          setSelectedProject(null);
        }}
        data={selectedProject}
      />
    </div>
  );
};

export default VerificationPage;
