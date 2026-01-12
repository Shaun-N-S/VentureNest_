import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { AlertTriangle, Calendar, User, Shield, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  useGetPostById,
  useGetProjectById,
  useGetReportedPost,
  useGetReportedProject,
  useUpdateReportStatus,
} from "../../hooks/Admin/ReportHooks";

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
    if (isPost) return postReports.data ?? [];
    return projectReports.data ?? [];
  }, [isPost, postReports.data, projectReports.data]);

  /* ===================== LOCAL STATE (PER REPORT) ===================== */

  const [statusMap, setStatusMap] = useState<Record<string, ReportStatus>>({});
  const [actionMap, setActionMap] = useState<Record<string, string>>({});

  const getSelectedStatus = (id: string): ReportStatus =>
    statusMap[id] ?? "reviewed";

  const getActionTaken = (id: string): string => actionMap[id] ?? "";

  /* ===================== HANDLERS ===================== */

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
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="p-6 border-b flex flex-row items-center justify-between">
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
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between bg-gray-50 p-4 rounded-lg">
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

          <Button
            variant="outline"
            onClick={() => setShowTarget((prev) => !prev)}
            className="w-fit"
          >
            {showTarget ? "Hide" : "Show"} {isPost ? "Post" : "Project"}
          </Button>

          {showTarget && isPost && (
            <div className="border rounded-xl p-4 bg-gray-50 space-y-3">
              {postQuery.isLoading && <p>Loading post...</p>}

              {postQuery.data && (
                <>
                  <h3 className="font-semibold text-lg">
                    {postQuery.data.title}
                  </h3>

                  {postQuery.data.image && (
                    <img
                      src={postQuery.data.image}
                      className="w-full max-h-64 object-cover rounded-lg"
                    />
                  )}

                  <p className="text-sm text-gray-700 line-clamp-4">
                    {postQuery.data.content}
                  </p>

                  <Button
                    variant="link"
                    onClick={() =>
                      window.open(`/admin/posts/${postQuery.data.id}`, "_blank")
                    }
                  >
                    Open Full Post →
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Reports */}
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.reportId}
                className="border rounded-xl p-4 space-y-4 hover:shadow-sm transition"
              >
                {/* Reporter */}
                <div className="flex items-center gap-3">
                  {report.reporter.profileImg ? (
                    <img
                      src={report.reporter.profileImg}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div>
                    <p className="font-semibold">{report.reporter.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Shield size={14} />
                      {report.reporter.role}
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <Badge variant="outline">
                    {report.reasonCode.replace("_", " ")}
                  </Badge>
                  {report.reasonText && (
                    <p className="mt-2 text-sm text-gray-700">
                      {report.reasonText}
                    </p>
                  )}
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(report.createdAt).toLocaleString()}
                  </div>

                  <Badge variant="secondary" className="capitalize">
                    {report.status.replace("_", " ")}
                  </Badge>
                </div>

                {/* Actions */}
                {report.status === "pending" && (
                  <div className="border-t pt-4 space-y-3">
                    <select
                      value={getSelectedStatus(report.reportId)}
                      onChange={(e) =>
                        setStatusMap((prev) => ({
                          ...prev,
                          [report.reportId]: e.target.value as ReportStatus,
                        }))
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="reviewed">Reviewed</option>
                      <option value="action_taken">Action Taken</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    {getSelectedStatus(report.reportId) === "action_taken" && (
                      <Textarea
                        placeholder="Describe the action taken"
                        value={getActionTaken(report.reportId)}
                        onChange={(e) =>
                          setActionMap((prev) => ({
                            ...prev,
                            [report.reportId]: e.target.value,
                          }))
                        }
                      />
                    )}

                    <Button
                      onClick={() => handleUpdateStatus(report.reportId)}
                      disabled={updateStatusMutation.isPending}
                      className="w-full"
                    >
                      Update Status
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {reports.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No reports found
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailsModal;
