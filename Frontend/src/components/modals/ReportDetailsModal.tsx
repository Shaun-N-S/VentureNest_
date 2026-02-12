import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area"; // FIXED: Import from your UI components folder
import {
  AlertTriangle,
  User,
  Shield,
  X,
  Loader2,
  ExternalLink,
  MessageSquare,
  ClipboardList,
  CheckCircle2,
} from "lucide-react"; // REMOVED: Calendar (unused)
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

const ReportDetailsModal = ({ isOpen, onClose, data }: Props) => {
  const isPost = Boolean(data?.postId);
  const [activeTab, setActiveTab] = useState("reports");

  /* ===================== API ===================== */
  const postReports = useGetReportedPost(data?.postId);
  const projectReports = useGetReportedProject(data?.projectId);

  const postQuery = useGetPostById(
    data?.postId,
    activeTab === "content" && isPost,
  );
  const projectQuery = useGetProjectById(
    data?.projectId,
    activeTab === "content" && !isPost,
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] md:w-full h-[90vh] p-0 overflow-hidden flex flex-col gap-0 border-none shadow-2xl">
        {/* Header */}
        <DialogHeader className="p-5 md:p-6 bg-white border-b sticky top-0 z-10 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="text-red-500 w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                Moderation Queue
              </DialogTitle>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                Case #{data.postId || data.projectId}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        {/* Info Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-white px-3 py-1 text-slate-600 border-slate-200"
            >
              Target:{" "}
              <span className="ml-1 font-bold text-slate-900">
                {isPost ? "Post" : "Project"}
              </span>
            </Badge>
            <Badge
              className={`capitalize px-3 py-1 font-semibold ${
                data.status === "pending"
                  ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-100"
              }`}
            >
              {data.status.replace("_", " ")}
            </Badge>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Total Reports:{" "}
            <span className="text-slate-900 font-bold">{reports.length}</span>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="px-6 pt-4 bg-white border-b">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-100/50 p-1">
              <TabsTrigger
                value="reports"
                className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <ClipboardList size={16} /> Reports List
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <ExternalLink size={16} /> Content Preview
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            {/* CONTENT PREVIEW TAB */}
            <TabsContent
              value="content"
              className="h-full m-0 p-0 focus-visible:outline-none"
            >
              <ScrollArea className="h-full p-6 bg-slate-50/50">
                {postQuery.isLoading || projectQuery.isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-indigo-500 w-10 h-10" />
                    <p className="text-slate-500 animate-pulse">
                      Fetching reported content...
                    </p>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto shadow-sm rounded-2xl overflow-hidden border bg-white mb-6">
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

                    {isPost && postQuery.data && (
                      <PostCard
                        id={postQuery.data.id}
                        author={{
                          id: postQuery.data.author.id,
                          role: postQuery.data.author.role,
                          name: "Reported User",
                          avatar: "/placeholder.svg",
                          followers: 0,
                        }}
                        timestamp={new Date(
                          postQuery.data.createdAt,
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
              </ScrollArea>
            </TabsContent>

            {/* REPORTS LIST TAB */}
            <TabsContent
              value="reports"
              className="h-full m-0 p-0 focus-visible:outline-none"
            >
              <ScrollArea className="h-full px-6 py-4">
                <div className="max-w-4xl mx-auto space-y-4 pb-10">
                  {reports.map((report) => (
                    <div
                      key={report.reportId}
                      className="group bg-white border border-slate-200 rounded-xl transition-all hover:shadow-md overflow-hidden"
                    >
                      <div className="p-5 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {report.reporter.profileImg ? (
                                <img
                                  src={report.reporter.profileImg}
                                  className="w-11 h-11 rounded-full border-2 border-slate-100 shadow-sm object-cover"
                                  alt=""
                                />
                              ) : (
                                <div className="w-11 h-11 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-md">
                                  <User className="w-6 h-6" />
                                </div>
                              )}
                              <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full border shadow-sm">
                                <Shield size={12} className="text-indigo-600" />
                              </div>
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 leading-none">
                                {report.reporter.name}
                              </h4>
                              <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">
                                {report.reporter.role}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-600"
                          >
                            {new Date(report.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>

                        <div className="pl-14 space-y-3">
                          <div className="flex items-center gap-2">
                            <MessageSquare
                              size={14}
                              className="text-indigo-500"
                            />
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                              Violation: {report.reasonCode.replace("_", " ")}
                            </span>
                          </div>

                          {report.reasonText && (
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                              <p className="text-sm text-slate-700 italic leading-relaxed">
                                "{report.reasonText}"
                              </p>
                            </div>
                          )}

                          {report.status === "pending" ? (
                            <div className="pt-4 border-t border-dashed space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">
                                    Resolution
                                  </label>
                                  <select
                                    value={getSelectedStatus(report.reportId)}
                                    onChange={(e) =>
                                      setStatusMap((p) => ({
                                        ...p,
                                        [report.reportId]: e.target
                                          .value as ReportStatus,
                                      }))
                                    }
                                    className="w-full h-10 border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                  >
                                    <option value="reviewed">
                                      Review Complete (No Action)
                                    </option>
                                    <option value="action_taken">
                                      Action Taken (Strict)
                                    </option>
                                    <option value="rejected">
                                      Dismiss / Reject Report
                                    </option>
                                  </select>
                                </div>
                              </div>

                              {getSelectedStatus(report.reportId) ===
                                "action_taken" && (
                                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">
                                    Enforcement Notes
                                  </label>
                                  <Textarea
                                    placeholder="Explain the specific action taken..."
                                    value={getActionTaken(report.reportId)}
                                    onChange={(e) =>
                                      setActionMap((p) => ({
                                        ...p,
                                        [report.reportId]: e.target.value,
                                      }))
                                    }
                                    className="min-h-[80px] text-sm resize-none"
                                  />
                                </div>
                              )}

                              <Button
                                onClick={() =>
                                  handleUpdateStatus(report.reportId)
                                }
                                disabled={updateStatusMutation.isPending}
                                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white gap-2 h-10"
                              >
                                {updateStatusMutation.isPending ? (
                                  <Loader2 className="animate-spin w-4 h-4" />
                                ) : (
                                  <CheckCircle2 size={16} />
                                )}
                                Submit Decision
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 pt-2">
                              <div className="h-px flex-1 bg-slate-100" />
                              <Badge className="bg-green-50 text-green-700 border-green-100 hover:bg-green-50">
                                Decision Recorded:{" "}
                                {report.status.replace("_", " ")}
                              </Badge>
                              <div className="h-px flex-1 bg-slate-100" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailsModal;
