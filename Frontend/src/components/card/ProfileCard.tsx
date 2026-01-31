import { MoreVertical } from "lucide-react";
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
import { InfoItem } from "../modals/ProfileVerificationModal";
import CreatePostModal from "../modals/CreatePostModal";
import toast from "react-hot-toast";
import { queryClient } from "../../main";
import ProjectFormModal from "../modals/AddProjectModal";
import { useCreateProject } from "../../hooks/Project/projectHooks";
import type { PersonalProjectApiResponse } from "../../types/PersonalProjectApiResponse";
import { PeopleListModal, type PersonItem } from "../modals/PeopleListModal";
import { useConnectionsPeopleList } from "../../hooks/Relationship/relationshipHooks";

export function ProfileCard(props: ProfileCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isCreatePostModal, setIsCreatePostModal] = useState(false);
  const [connectionSearch, setConnectionSearch] = useState("");
  const role = useSelector((state: Rootstate) => state.authData.role);
  const userId = useSelector((state: Rootstate) => state.authData.id);
  const userData = useSelector((state: Rootstate) => state.authData);
  const handleEditProfile = () => setIsEditModalOpen(true);
  const handleKYCVerification = () => setIsKYCModalOpen(true);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const { mutate: addProject } = useCreateProject();
  const isInvestor = userData.role === "INVESTOR";
  const profileData = props.userData;

  const {
    data: connectionsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useConnectionsPeopleList(connectionSearch, 5);

  const people: PersonItem[] =
    connectionsData?.pages.flatMap((page) =>
      page.users.map((user) => ({
        id: user.id,
        name: user.userName,
        subtitle: user.bio || "",
        avatar: user.profileImg,
        actionLabel: "Remove",
      })),
    ) ?? [];

  const handleAddProject = () => setIsAddProjectOpen(true);
  const handleCreatePost = () => {
    setIsCreatePostModal(true);
    setIsDropdownOpen(false);
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

  const handleOpenConnections = () => {
    setOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto bg-card rounded-2xl border border-border p-6 md:p-8"
    >
      {/* Header with menu */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16 md:h-20 md:w-20">
              <AvatarImage
                src={profileData.profileImg || "/placeholder.svg"}
                alt={profileData.userName}
              />
              <AvatarFallback>{profileData.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl md:text-2xl font-bold">
                {profileData.userName}
              </h2>

              {/* APPROVED */}
              {profileData.kycStatus === "APPROVED" && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 flex items-center gap-1"
                >
                  <span>✓</span> Verified
                </Badge>
              )}

              {/* PENDING / SUBMITTED */}
              {profileData.kycStatus === "SUBMITTED" && (
                <span className="text-sm text-yellow-600 font-medium">
                  KYC under processing
                </span>
              )}

              {/* NOT SUBMITTED */}
              {profileData.kycStatus === "PENDING" ? (
                <button
                  onClick={handleKYCVerification}
                  className="text-sm text-blue-600 hover:underline focus:outline-none"
                >
                  Verify your account?
                </button>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="max-w-full md:max-w-[600px] overflow-hidden">
            <p className="text-sm md:text-base text-foreground mb-4 break-words whitespace-pre-line">
              {profileData.bio}
            </p>
            {profileData.linkedInUrl && (
              <a
                href={profileData.linkedInUrl ? profileData.linkedInUrl : ""}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-2 pt-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                View Profile
              </a>
            )}
            {profileData.website && (
              <InfoItem
                label="Website"
                value={
                  <a
                    href={profileData.website ? profileData.website : ""}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate block"
                  >
                    {profileData.website}
                  </a>
                }
              />
            )}
          </div>

          {profileData.kycStatus === "REJECTED" && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">
                KYC Verification Failed
              </p>

              <p className="text-sm text-red-600 mt-1">
                {profileData.kycRejectReason ??
                  "Your documents did not meet verification requirements."}
              </p>

              <Button
                size="sm"
                className="mt-3 bg-red-600 hover:bg-red-700"
                onClick={handleKYCVerification}
              >
                Re-submit KYC
              </Button>
            </div>
          )}

          {/* Stats */}
          <div className="flex gap-6 md:gap-8 justify-evenly">
            <div className="text-center">
              <p className="font-bold text-lg md:text-xl">
                {userData.postsCount ?? 0}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg md:text-xl">
                {isInvestor
                  ? (userData.investmentCount ?? 0)
                  : (userData.projectsCount ?? 0)}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                {isInvestor ? "Investments" : "Projects"}
              </p>
            </div>
            <div
              className="text-center cursor-pointer hover:opacity-80 transition"
              onClick={handleOpenConnections}
            >
              <p className="font-bold text-lg md:text-xl">
                {profileData.connectionsCount ?? 0}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                Connections
              </p>
            </div>
          </div>
        </div>

        {/* Menu button */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>

          <AnimatePresence>
            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-10 z-50 w-48 rounded-xl bg-white shadow-lg border border-gray-200 p-2"
                >
                  <button
                    onClick={handleEditProfile}
                    className="w-full text-center text-sm font-medium text-gray-900 border border-blue-400 rounded-lg py-2.5 hover:bg-blue-50 transition-colors mb-2"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleCreatePost}
                    className="w-full text-center text-sm font-medium text-gray-900 border border-blue-400 rounded-lg py-2.5 hover:bg-blue-50 transition-colors"
                  >
                    Create a New Post
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-4 border-t border-border">
        {/* <Button onClick={onFollow} variant={isFollowing ? "outline" : "default"} className="flex-1">
                    {isFollowing ? "Following" : "Follow"}
                </Button> */}
        {role === "USER" ? (
          <Button
            onClick={handleAddProject}
            className="flex-1 bg-blue-500 hover:bg-blue-600"
          >
            Add a project
          </Button>
        ) : (
          ""
        )}
        {/* <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent">
                    <MessageCircle className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent">
                    <Share2 className="h-4 w-4" />
                </Button> */}
      </div>
      {role === "INVESTOR" ? (
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
        onActionClick={(id) => console.log("Remove connection:", id)}
        onSearch={setConnectionSearch}
      />
    </motion.div>
  );
}
