import {
  MoreHorizontal,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Share2,
  Globe,
  MessageCircle,
  UserPlus,
  Clock,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import type { ProfileCardProps } from "../../types/ProfileCardPropsType";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../store/store";
import EditInvestorProfileModal from "../modals/InvestorEditProfileModal";
import UserEditProfileModal from "../modals/UserEditProfileModal";
import KYCVerificationModal from "../modals/KYCVerificationModal";
import CreatePostModal from "../modals/CreatePostModal";
import toast from "react-hot-toast";
import { queryClient } from "../../main";
import ProjectFormModal from "../modals/AddProjectModal";
import { useCreateProject } from "../../hooks/Project/projectHooks";
import { PeopleListModal, type PersonItem } from "../modals/PeopleListModal";
import {
  useConnectionsPeopleList,
  useRelationshipStatus,
  useRemoveConnection,
  useSendConnectionReq,
  useUserConnectionsPeopleList,
} from "../../hooks/Relationship/relationshipHooks";
import { updateUserData } from "../../store/Slice/authDataSlice";
import { useDispatch } from "react-redux";
import { PitchModal } from "../modals/PitchModal";
import type { PersonalProjectApiResponse } from "../../types/projectType";
import type { NetworkUser } from "../../types/networkType";
import type { ConnectionStatus } from "../../types/connectionStatus";
import {
  useRequestChangePasswordOtp,
  useVerifyChangePasswordOtp,
} from "../../hooks/Auth/AuthHooks";
import OtpModal from "../modals/OtpModal";
import { ChangePasswordModal } from "../modals/ChangePasswordModal";

export function ProfileCard(props: ProfileCardProps) {
  // State management - unchanged
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isCreatePostModal, setIsCreatePostModal] = useState(false);
  const [connectionSearch, setConnectionSearch] = useState("");
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const role = useSelector((state: Rootstate) => state.authData.role);
  const userId = useSelector((state: Rootstate) => state.authData.id);
  const userData = useSelector((state: Rootstate) => state.authData);
  const dispatch = useDispatch();

  const isInvestor = userData.role === "INVESTOR";
  const profileData = props.userData;
  const profileUserId = profileData.id;

  // Hooks - unchanged
  const { mutate: addProject } = useCreateProject();
  const { mutate: removeConnection } = useRemoveConnection();
  const { mutate: sendConnection } = useSendConnectionReq();
  const { data: relationshipStatus } = useRelationshipStatus(
    !props.isOwnProfile ? profileUserId : undefined,
  );

  const ownConnections = useConnectionsPeopleList(connectionSearch, 5);
  const otherUserConnections = useUserConnectionsPeopleList(
    profileUserId,
    connectionSearch,
    5,
  );

  const connectionsSource = props.isOwnProfile
    ? ownConnections
    : otherUserConnections;

  const {
    data: connectionsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = connectionsSource;

  const isConnectedToProfile =
    !props.isOwnProfile && relationshipStatus?.status === "accepted";

  const { mutate: requestOtp } = useRequestChangePasswordOtp();
  const { mutate: verifyOtp } = useVerifyChangePasswordOtp();

  // Handlers - unchanged
  const handleEditProfile = () => setIsEditModalOpen(true);
  const handleKYCVerification = () => setIsKYCModalOpen(true);
  const handleAddProject = () => setIsAddProjectOpen(true);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

  const handleCreatePost = () => {
    setIsCreatePostModal(true);
    setIsDropdownOpen(false);
  };

  const handleOpenConnections = () => {
    if (props.isOwnProfile || isConnectedToProfile) {
      setOpen(true);
      return;
    }
    toast.error("You are not connected to this user");
  };

  const people: PersonItem[] =
    connectionsData?.pages.flatMap((page) =>
      page.users.map((user: NetworkUser) => ({
        id: user.id,
        name: user.userName,
        subtitle: user.bio || "",
        avatar: user.profileImg,
        actionLabel: props.isOwnProfile ? "Remove" : undefined,
      })),
    ) ?? [];

  const requireKYC = (action: () => void) => {
    if (profileData.kycStatus !== "APPROVED") {
      toast.error("Please verify your account to continue");
      return;
    }
    action();
  };

  const handleSubmitProject = async (formData: FormData) => {
    addProject(formData, {
      onSuccess: (res) => {
        const newProjectId = res?.data?.projectId;
        const signedLogoUrl = res?.data?.logoUrl;
        queryClient.setQueryData(
          ["personal-project", 1, 10],
          (oldData: PersonalProjectApiResponse) => {
            if (!oldData?.data?.data?.projects) return oldData;

            const formFields = Object.fromEntries(formData.entries());

            const newProject = {
              _id: newProjectId,
              ...formFields,
              logoUrl: signedLogoUrl ?? null,
            };

            return {
              ...oldData,
              data: {
                ...oldData.data,
                data: {
                  ...oldData.data.data,
                  projects: [newProject, ...oldData.data.data.projects],
                },
              },
            };
          },
        );

        setIsAddProjectOpen(false);
      },
      onError: () => toast.error("Creating project failed"),
    });
  };

  const handleRemoveConnection = (id: string) => {
    removeConnection(id, {
      onSuccess: () => {
        toast.success("Connection removed");
        queryClient.invalidateQueries({
          queryKey: ["connections-people-list"],
        });
        dispatch(
          updateUserData({
            connectionsCount: Math.max((userData.connectionsCount ?? 1) - 1, 0),
          }),
        );
      },
      onError: () => toast.error("Failed to remove connection"),
    });
  };

  const handleSendConnection = (id: string) => {
    sendConnection(id, {
      onSuccess: () => {
        toast.success("Connection request sent");
        queryClient.invalidateQueries({
          queryKey: ["relationship-status", id],
        });
      },
      onError: () => toast.error("Failed to send request"),
    });
  };

  const handleChangePassword = () => {
    requestOtp(undefined, {
      onSuccess: () => {
        toast.success("OTP sent to your email");
        setIsOtpModalOpen(true);
      },
      onError: () => toast.error("Failed to send OTP"),
    });
  };

  const renderRelationshipButton = () => {
    if (!relationshipStatus || !relationshipStatus.status) return null;

    const buttonConfig: Record<
      ConnectionStatus,
      {
        icon: LucideIcon;
        label: string;
        className: string;
        onClick?: () => void;
        disabled: boolean;
      }
    > = {
      none: {
        icon: UserPlus,
        label: "Connect",
        className: "bg-slate-900 hover:bg-slate-800 text-white",
        onClick: () => handleSendConnection(profileUserId),
        disabled: false,
      },
      pending: {
        icon: Clock,
        label: "Pending",
        className:
          "bg-slate-100 text-slate-500 cursor-not-allowed border border-slate-200",
        disabled: true,
      },
      rejected: {
        icon: UserPlus,
        label: "Connect",
        className:
          "bg-white hover:bg-slate-50 text-slate-900 border border-slate-300",
        onClick: () => handleSendConnection(profileUserId),
        disabled: false,
      },
      cancelled: {
        icon: UserPlus,
        label: "Connect",
        className:
          "bg-white hover:bg-slate-50 text-slate-900 border border-slate-300",
        onClick: () => handleSendConnection(profileUserId),
        disabled: false,
      },
      accepted: {
        icon: MessageCircle,
        label: "Message",
        className:
          "bg-white hover:bg-slate-50 text-slate-900 border border-slate-300",
        disabled: false,
      },
    };

    const config = buttonConfig[relationshipStatus.status];
    const Icon = config.icon;

    return (
      <Button
        className={`flex-1 sm:flex-none sm:px-5 rounded-lg font-medium h-10 text-sm ${config.className}`}
        onClick={config.onClick}
        disabled={config.disabled}
      >
        <Icon className="w-4 h-4 mr-2" />
        {config.label}
      </Button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Main Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
        {/* Header Section */}
        <div className="px-5 sm:px-8 pt-6 sm:pt-8">
          <div className="flex items-start justify-between mb-6">
            {/* Avatar */}
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border border-slate-200 shadow-sm rounded-2xl bg-white">
              <AvatarImage
                src={profileData.profileImg || "/placeholder.svg"}
                alt={profileData.userName}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl font-semibold bg-slate-100 text-slate-600">
                {profileData.userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Actions Menu (Own Profile) */}
            {props.isOwnProfile && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 z-50 w-52 rounded-xl bg-white shadow-lg border border-slate-200 py-1 overflow-hidden"
                      >
                        <button
                          onClick={handleEditProfile}
                          className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3"
                        >
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          Edit Profile
                        </button>
                        <button
                          onClick={handleCreatePost}
                          className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3"
                        >
                          <Share2 className="w-4 h-4 text-slate-400" />
                          Create Post
                        </button>

                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            handleChangePassword();
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                        >
                          <AlertCircle className="w-4 h-4 text-slate-400" />
                          Change Password
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="px-5 sm:px-8 pb-6 sm:pb-8">
          {/* Name & Verification */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                {profileData.userName}
              </h1>

              {profileData.kycStatus === "APPROVED" && (
                <div
                  title="Verified Account"
                  className="inline-flex items-center justify-center"
                >
                  <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-50" />
                </div>
              )}

              {props.isOwnProfile && profileData.kycStatus === "SUBMITTED" && (
                <Badge
                  variant="outline"
                  className="border-amber-200 text-amber-700 bg-amber-50/50 rounded-full px-2 py-0.5 text-xs font-medium"
                >
                  Pending
                </Badge>
              )}
            </div>

            <p className="text-sm font-medium text-slate-500">
              {userData.role === "INVESTOR"
                ? "Angel Investor"
                : "Founder & Entrepreneur"}
            </p>
          </div>

          {/* Bio */}
          {profileData.bio && (
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {profileData.bio}
            </p>
          )}

          {/* Links Row */}
          <div className="flex flex-wrap gap-4 mb-5">
            {profileData.linkedInUrl && (
              <a
                href={profileData.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                <Briefcase className="w-4 h-4" />
                LinkedIn
              </a>
            )}

            {profileData.website && (
              <a
                href={profileData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                <Globe className="w-4 h-4" />
                Website
              </a>
            )}

            {props.isOwnProfile && profileData.kycStatus === "PENDING" && (
              <button
                onClick={handleKYCVerification}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-slate-700 transition-colors"
              >
                <AlertCircle className="w-4 h-4" />
                Verify Account
              </button>
            )}
          </div>

          {/* KYC Rejection Alert */}
          {props.isOwnProfile && profileData.kycStatus === "REJECTED" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4"
            >
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    Verification Failed
                  </p>
                  <p className="text-sm text-red-700">
                    {profileData.kycRejectReason ??
                      "Please check your documents and try again."}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={handleKYCVerification}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-xs flex-shrink-0"
                >
                  Resubmit
                </Button>
              </div>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6 sm:gap-8 py-5 border-y border-slate-100 mb-6">
            <button className="text-center group transition-all">
              <div className="text-xl font-semibold text-slate-900 mb-0.5">
                {profileData.postCount ?? 0}
              </div>
              <div className="text-xs font-medium text-slate-500">Posts</div>
            </button>

            <button className="text-center group transition-all border-x border-slate-100">
              <div className="text-xl font-semibold text-slate-900 mb-0.5">
                {isInvestor
                  ? (profileData.investmentCount ?? 0)
                  : (profileData.projectCount ?? 0)}
              </div>
              <div className="text-xs font-medium text-slate-500">
                {isInvestor ? "Investments" : "Projects"}
              </div>
            </button>

            <button
              onClick={handleOpenConnections}
              className="text-center group transition-all"
            >
              <div className="text-xl font-semibold text-slate-900 group-hover:text-slate-600 transition-colors mb-0.5">
                {profileData.connectionsCount ?? 0}
              </div>
              <div className="text-xs font-medium text-slate-500 group-hover:text-slate-600 transition-colors">
                Connections
              </div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Own Profile Actions */}
            {props.isOwnProfile && role === "USER" && (
              <Button
                onClick={() => requireKYC(handleAddProject)}
                className="w-full sm:flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg h-10 text-sm font-medium transition-all"
              >
                Add New Project
              </Button>
            )}

            {/* Visitor Actions */}
            {!props.isOwnProfile && role === "USER" && (
              <>
                {renderRelationshipButton()}

                {props.isInvestorProfile && (
                  <Button
                    onClick={() => setIsPitchModalOpen(true)}
                    className="flex-1 sm:flex-none sm:px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg h-10 text-sm font-medium transition-all"
                  >
                    Send Pitch
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {props.isOwnProfile && role === "INVESTOR" ? (
        <EditInvestorProfileModal
          data={profileData}
          investorId={userId}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
        />
      ) : role === "USER" ? (
        <UserEditProfileModal
          data={profileData}
          userId={userId}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
        />
      ) : null}

      <KYCVerificationModal
        id={userId}
        open={isKYCModalOpen}
        onOpenChange={setIsKYCModalOpen}
      />

      <CreatePostModal
        isOpen={isCreatePostModal}
        onClose={() => setIsCreatePostModal(false)}
        authorId={userId}
        authorRole={role || "USER"}
      />

      <ProjectFormModal
        open={isAddProjectOpen}
        onOpenChange={setIsAddProjectOpen}
        onSubmit={handleSubmitProject}
        isEditing={false}
      />

      <PeopleListModal
        open={open}
        onOpenChange={setOpen}
        title="Connections"
        people={people}
        loading={isLoading || isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        onActionClick={handleRemoveConnection}
        onSearch={setConnectionSearch}
      />

      <PitchModal
        open={isPitchModalOpen}
        onOpenChange={setIsPitchModalOpen}
        investorId={profileData.id}
      />

      <OtpModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onVerify={(otp) => {
          verifyOtp(otp, {
            onSuccess: (res) => {
              setResetToken(res.data.token);
              setIsOtpModalOpen(false);
              setIsPasswordModalOpen(true);
            },
            onError: () => toast.error("Invalid OTP"),
          });
        }}
        onResend={() => {
          requestOtp(undefined, {
            onSuccess: () => toast.success("OTP resent"),
          });
        }}
      />

      {resetToken && (
        <ChangePasswordModal
          open={isPasswordModalOpen}
          token={resetToken}
          onClose={() => {
            setIsPasswordModalOpen(false);
            setResetToken(null);
          }}
        />
      )}
    </motion.div>
  );
}
