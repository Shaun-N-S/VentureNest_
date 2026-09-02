import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Flag } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import {
  useFetchProjectById,
  useLikeProject,
} from "../../hooks/Project/projectHooks";
import { useCurrentSubscription } from "../../hooks/Subscription/subscriptionHooks";
import { getInvestorAccessTier } from "../../components/project/investorAccess";
import { ProjectHero } from "../../components/project/ProjectHero";
import { ProjectOverviewMetrics } from "../../components/project/ProjectOverviewMetrics";
import { ProjectFounders } from "../../components/project/ProjectFounders";
import { ProjectVision } from "../../components/project/ProjectVision";
import { ProjectPitchDeck } from "../../components/project/ProjectPitchDeck";
import { ProjectDetailSkeleton } from "../../components/project/ProjectDetailSkeleton";
import InvestorInsightsCard from "../../components/project/InvestorInsightsCard";
import { Button } from "../../components/ui/button";
import { ReportModal } from "../../components/modals/ReportModal";
import { ReportTargetType } from "../../types/reportTargetType";
import type { ProjectType } from "../../types/projectType";
import { queryClient } from "../../main";
import type { Rootstate } from "../../store/store";

const ProjectDetailedPage = () => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTargetId, setReportTargetId] = useState<string | null>(null);
  const [investorCount, setInvestorCount] = useState<number | undefined>(
    undefined,
  );

  const { id } = useParams();
  const { data, isLoading } = useFetchProjectById(id!);
  const { mutate: likeProject, isPending } = useLikeProject();
  const role = useSelector((state: Rootstate) => state.authData.role);
  const userId = useSelector((state: Rootstate) => state.authData.id);

  // Admins always have full access — never hit any subscription endpoint for them.
  const isAdmin = role === "ADMIN";
  const { data: currentSubscription } = useCurrentSubscription({
    enabled: !isAdmin,
  });

  const handleInvestorCount = useCallback(
    (count: number) => setInvestorCount(count),
    [],
  );

  const handleProjectLike = (projectId: string) => {
    likeProject(projectId, {
      onSuccess: (res) => {
        const { liked, likeCount } = res.data;

        queryClient.setQueryData(
          ["single-project", projectId],
          (old: { data: { project: ProjectType } } | undefined) => {
            if (!old?.data?.project) return old;

            return {
              ...old,
              data: {
                ...old.data,
                project: {
                  ...old.data.project,
                  liked,
                  likeCount,
                },
              },
            };
          },
        );

        queryClient.setQueryData(
          ["projects", 1, 10],
          (old: { data: { projects: ProjectType[] } } | undefined) => {
            if (!old?.data?.projects) return old;

            return {
              ...old,
              data: {
                ...old.data,
                projects: old.data.projects.map((p) =>
                  p._id === projectId ? { ...p, liked, likeCount } : p,
                ),
              },
            };
          },
        );
      },
      onError: () => toast.error("Failed to like project"),
    });
  };

  const handleReport = (projectId: string) => {
    setReportTargetId(projectId);
    setIsReportOpen(true);
  };

  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  const project = data?.data?.project;

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="space-y-4 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Project not found
          </h2>
          <p className="text-muted-foreground">
            The project you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/">Go back home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const founders = [
    {
      id: project.userId,
      name: project.user?.userName || "Unknown",
      image: project.user?.profileImg || "",
      initials: project.user?.userName?.[0] || "?",
      userRole: project?.userRole || "Founder",
    },
  ];

  const isProjectOwner = project.userId === userId;
  const isVerified = project.registrationStatus === "APPROVED";
  const investorAccessTier = getInvestorAccessTier({
    role,
    isOwner: isProjectOwner,
    subscription: currentSubscription,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl space-y-6 px-4 py-8 md:py-12">
        <ProjectHero
          id={project._id}
          name={project.startupName}
          stage={project.stage}
          category={project.category}
          teamSize={project.teamSize}
          coverImageUrl={project.coverImageUrl}
          logoUrl={project.logoUrl}
          location={project.location}
          createdAt={project.createdAt}
          liked={project.liked}
          likeCount={project.likeCount}
          isVerified={isVerified}
          isRaising={project.donationEnabled === true}
          isOwner={isProjectOwner}
          registrationStatus={project.registrationStatus}
          rejectionReason={project.rejectionReason}
          showSchedule={role === "INVESTOR"}
          canSave={!isAdmin}
          onLike={() => handleProjectLike(project._id)}
          likeLoading={isPending}
        />

        <ProjectOverviewMetrics
          investorCount={investorCount}
          stage={project.stage}
          category={project.category}
          teamSize={project.teamSize}
          registrationStatus={project.registrationStatus}
          isActive={project.isActive}
          likeCount={project.likeCount}
          listedOn={
            project.createdAt
              ? format(new Date(project.createdAt), "MMM yyyy")
              : null
          }
        />

        <ProjectFounders founders={founders} verified={isVerified} />

        <ProjectVision vision={project.shortDescription} />

        {role && (
          <InvestorInsightsCard
            projectId={project._id}
            accessTier={investorAccessTier}
            onCount={handleInvestorCount}
          />
        )}

        <ProjectPitchDeck
          pitchDeckUrl={project.pitchDeckUrl}
          projectWebsite={project.projectWebsite}
        />

        {/* Report — footer, de-emphasised */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="pt-2 text-center"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReport(project._id)}
            className="text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Flag className="mr-1.5 h-3.5 w-3.5" />
            Report this project
          </Button>
        </motion.div>
      </div>

      {/* Report Modal */}
      {isReportOpen && reportTargetId && (
        <ReportModal
          open={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          targetId={reportTargetId}
          targetType={ReportTargetType.PROJECT}
        />
      )}
    </div>
  );
};

export default ProjectDetailedPage;
