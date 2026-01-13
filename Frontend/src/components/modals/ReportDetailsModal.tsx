import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  AlertTriangle,
  Calendar,
  User,
  Shield,
  X,
  Loader2,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  useGetPostById,
  useGetProjectById,
  useGetReportedPost,
  useGetReportedProject,
  useUpdateReportStatus,
} from "../../hooks/Admin/ReportHooks";
import { ProjectDetailCard } from "../card/ProjectDetailCard";
import { PostCard } from "../card/PostCard";

/* ===================== TYPES ===================== */

type ReportStatus =
  | "pending"
  | "reviewed"
  | "rejected"
  | "action_taken"
  | "archived";

interface ReporterInfo {
  id: string;
  name: string;
  profileImg?: string;
  role: "USER" | "INVESTOR";
}

interface ReportDetail {
  reportId: string;
  reporter: ReporterInfo;
  reasonCode: string;
  reasonText?: string;
  status: ReportStatus;
  createdAt: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: {
    postId?: string;
    projectId?: string;
    status: ReportStatus;
  } | null;
}

/* ===================== COMPONENT ===================== */

const ReportDetailsModal = ({ isOpen, onClose, data }: Props) => {
  const isPost = Boolean(data?.postId);
  const [showTarget, setShowTarget] = useState(false);

  /* ===================== API ===================== */

  const postReports = useGetReportedPost(data?.postId);
  const projectReports = useGetReportedProject(data?.projectId);

  const postQuery = useGetPostById(data?.postId, showTarget && isPost);
  const projectQuery = useGetProjectById(
    data?.projectId,
    showTarget && !isPost
  );

  const updateStatusMutation = useUpdateReportStatus();

  const reports: ReportDetail[] = useMemo(() => {
    return isPost ? (postReports.data ?? []) : (projectReports.data ?? []);
  }, [isPost, postReports.data, projectReports.data]);

  /* ===================== LOCAL STATE ===================== */

  const [statusMap, setStatusMap] = useState<Record<string, ReportStatus>>({});
  const [actionMap, setActionMap] = useState<Record<string, string>>({});

  const getSelectedStatus = (id: string): ReportStatus =>
    statusMap[id] ?? "reviewed";

  const getActionTaken = (id: string): string => actionMap[id] ?? "";

  const handleUpdateStatus = (reportId: string) => {
    const status = getSelectedStatus(reportId);
    const actionTaken = getActionTaken(reportId);

    updateStatusMutation.mutate({
      reportId,
      payload: {
        status,
        ...(status === "action_taken" && { actionTaken }),
      },
    });
  };

  if (!data) return null;

  /* ===================== JSX ===================== */

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="p-6 border-b flex items-center justify-between">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="text-red-500" />
            Report Details
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X />
          </Button>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Summary */}
          <div className="flex justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">
                {isPost ? "Post ID" : "Project ID"}
              </p>
              <p className="font-mono text-xs break-all">
                {data.postId || data.projectId}
              </p>
            </div>

            <Badge className="capitalize bg-yellow-100 text-yellow-700">
              {data.status.replace("_", " ")}
            </Badge>
          </div>

          {/* Show Content Button */}
          <Button variant="outline" onClick={() => setShowTarget((p) => !p)}>
            {showTarget ? "Hide" : "Show"} {isPost ? "Post" : "Project"}
          </Button>

          {/* ===================== CONTENT PREVIEW ===================== */}

          {showTarget && (
            <div className="border rounded-xl p-4 bg-gray-50">
              {(postQuery.isLoading || projectQuery.isLoading) && (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin" />
                </div>
              )}

              {/* PROJECT */}
              {!isPost && projectQuery.data && (
                <ProjectDetailCard
                  id={projectQuery.data.id}
                  name={projectQuery.data.startupName}
                  stage={projectQuery.data.stage}
                  image={projectQuery.data.coverImageUrl}
                  logo={projectQuery.data.logoUrl}
                  likes={0}
                  founders={[
                    {
                      id: projectQuery.data.owner.id,
                      name: projectQuery.data.owner.name,
                      image: projectQuery.data.owner.profileImg ?? "",
                      initials: projectQuery.data.owner.name[0],
                      userRole: "Founder",
                    },
                  ]}
                  aim={projectQuery.data.shortDescription}
                />
              )}

              {/* POST */}
              {isPost && postQuery.data && (
                <PostCard
                  id={postQuery.data.id}
                  author={{
                    name: "Reported User",
                    avatar: "/placeholder.svg",
                    followers: 0,
                  }}
                  timestamp={new Date(
                    postQuery.data.createdAt
                  ).toLocaleString()}
                  content={postQuery.data.content}
                  mediaUrls={postQuery.data.mediaUrls}
                  likes={postQuery.data.likeCount}
                  comments={postQuery.data.commentsCount}
                  context="home"
                />
              )}
            </div>
          )}

          {/* ===================== REPORTS ===================== */}

          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.reportId}
                className="border rounded-xl p-4 space-y-4"
              >
                {/* Reporter */}
                <div className="flex items-center gap-3">
                  {report.reporter.profileImg ? (
                    <img
                      src={report.reporter.profileImg}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div>
                    <p className="font-semibold">{report.reporter.name}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Shield size={14} /> {report.reporter.role}
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <Badge variant="outline">
                  {report.reasonCode.replace("_", " ")}
                </Badge>

                {report.reasonText && (
                  <p className="text-sm text-gray-700">{report.reasonText}</p>
                )}

                {/* Meta */}
                <div className="flex justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(report.createdAt).toLocaleString()}
                  </span>

                  <Badge variant="secondary">
                    {report.status.replace("_", " ")}
                  </Badge>
                </div>

                {/* Actions */}
                {report.status === "pending" && (
                  <div className="border-t pt-4 space-y-3">
                    <select
                      value={getSelectedStatus(report.reportId)}
                      onChange={(e) =>
                        setStatusMap((p) => ({
                          ...p,
                          [report.reportId]: e.target.value as ReportStatus,
                        }))
                      }
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="reviewed">Reviewed</option>
                      <option value="action_taken">Action Taken</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    {getSelectedStatus(report.reportId) === "action_taken" && (
                      <Textarea
                        placeholder="Describe action taken"
                        value={getActionTaken(report.reportId)}
                        onChange={(e) =>
                          setActionMap((p) => ({
                            ...p,
                            [report.reportId]: e.target.value,
                          }))
                        }
                      />
                    )}

                    <Button
                      onClick={() => handleUpdateStatus(report.reportId)}
                      disabled={updateStatusMutation.isPending}
                    >
                      Update Status
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailsModal;
