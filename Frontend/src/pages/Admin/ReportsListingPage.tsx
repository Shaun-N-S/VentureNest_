import { X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import Pagination from "../../components/pagination/Pagination";
import Table from "../../components/table/Table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  useGetAllReportedPosts,
  useGetAllReportedProjects,
} from "../../hooks/Admin/ReportHooks";
import ReportDetailsModal from "../../components/modals/ReportDetailsModal";

/* ===================== TYPES ===================== */

type ReportStatus =
  | "pending"
  | "reviewed"
  | "rejected"
  | "action_taken"
  | "archived";

interface BaseReportRow {
  id: string;
  reportCount: number;
  reasons: string[];
  latestReportAt: string;
  status: ReportStatus;
}

export interface ReportedPostRow extends BaseReportRow {
  postId: string;
}

export interface ReportedProjectRow extends BaseReportRow {
  projectId: string;
}

/* ===================== COMPONENT ===================== */

const ReportManagementPage = () => {
  const [activeTab, setActiveTab] = useState<"posts" | "projects">("posts");
  const [page, setPage] = useState(1);
  const limit = 5;

  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    ReportedPostRow | ReportedProjectRow | null
  >(null);

  /* ===================== API ===================== */

  const { data: postData } = useGetAllReportedPosts();
  const { data: projectData } = useGetAllReportedProjects();

  /* ===================== DATA MAPPING ===================== */

  const postRows: ReportedPostRow[] = useMemo(() => {
    return (
      postData?.map((item) => ({
        id: item.postId,
        postId: item.postId,
        reportCount: item.reportCount,
        reasons: item.reasons,
        latestReportAt: item.latestReportAt,
        status: item.status,
      })) || []
    );
  }, [postData]);

  const projectRows: ReportedProjectRow[] = useMemo(() => {
    return (
      projectData?.map((item) => ({
        id: item.projectId,
        projectId: item.projectId,
        reportCount: item.reportCount,
        reasons: item.reasons,
        latestReportAt: item.latestReportAt,
        status: item.status,
      })) || []
    );
  }, [projectData]);

  const activeRows = activeTab === "posts" ? postRows : projectRows;

  /* ===================== PAGINATION (FRONTEND ONLY) ===================== */

  const totalPages = Math.max(1, Math.ceil(activeRows.length / limit));

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * limit;
    return activeRows.slice(start, start + limit);
  }, [activeRows, page]);

  /* ===================== HANDLERS ===================== */

  const handleViewClick = (row: ReportedPostRow | ReportedProjectRow) => {
    setSelectedItem(row);
    setModalOpen(true);
  };

  /* ===================== TABLE HEADERS ===================== */

  const commonHeaders = [
    {
      id: "count",
      label: "Reports",
      render: (row: BaseReportRow) => (
        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs">
          {row.reportCount}
        </span>
      ),
    },
    {
      id: "reasons",
      label: "Reasons",
      render: (row: BaseReportRow) => (
        <div className="flex flex-wrap gap-1">
          {row.reasons.map((r) => (
            <span
              key={r}
              className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {r.replace("_", " ")}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: "date",
      label: "Last Reported",
      render: (row: BaseReportRow) => (
        <span className="text-sm text-gray-600">
          {new Date(row.latestReportAt).toLocaleString()}
        </span>
      ),
    },
    {
      id: "status",
      label: "Status",
      render: (row: BaseReportRow) => (
        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs capitalize">
          {row.status.replace("_", " ")}
        </span>
      ),
    },
    {
      id: "view",
      label: "View",
      render: (row: any) => (
        <button
          onClick={() => handleViewClick(row)}
          className="px-5 py-1.5 bg-indigo-600 text-white text-xs rounded-full hover:bg-indigo-700"
        >
          View
        </button>
      ),
    },
  ];

  const postHeaders = [
    {
      id: "postId",
      label: "Post ID",
      render: (row: ReportedPostRow) => (
        <span className="font-mono text-xs">{row.postId}</span>
      ),
    },
    ...commonHeaders,
  ];

  const projectHeaders = [
    {
      id: "projectId",
      label: "Project ID",
      render: (row: ReportedProjectRow) => (
        <span className="font-mono text-xs">{row.projectId}</span>
      ),
    },
    ...commonHeaders,
  ];

  /* ===================== JSX ===================== */

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Report Management
        </h1>

        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v as "posts" | "projects");
            setPage(1);
          }}
        >
          <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <Table
              headers={postHeaders}
              data={paginatedRows as ReportedPostRow[]}
            />
          </TabsContent>

          <TabsContent value="projects">
            <Table
              headers={projectHeaders}
              data={paginatedRows as ReportedProjectRow[]}
            />
          </TabsContent>
        </Tabs>

        {activeRows.length > 0 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            setPage={setPage}
          />
        )}
      </div>

      <ReportDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={selectedItem}
      />
    </div>
  );
};

export default ReportManagementPage;
