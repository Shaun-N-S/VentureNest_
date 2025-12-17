import { useState } from "react"
import { ProfileCard } from "../../../components/card/ProfileCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { motion } from "framer-motion"
import { PostCard } from "../../../components/card/PostCard"
import { ProjectCard } from "../../../components/card/ProjectCard"
import { useSelector } from "react-redux"
import type { Rootstate } from "../../../store/store"
import { useFetchUserProfile } from "../../../hooks/User/Profile/UserProfileHooks"
import { useFetchPersonalPost, useLikePost, useRemovePost } from "../../../hooks/Post/PostHooks"
import type { PersonalPost } from "../../Investor/Profile/InvestorProfile/ProfilePage"
import toast from "react-hot-toast"
import { queryClient } from "../../../main"
import { useFetchPersonalProjects, useLikeProject, useRemoveProject, useUpdateProject } from "../../../hooks/Project/projectHooks"
import type { PersonalProjectApiResponse, ProjectType } from "../../../types/projectType"
import AddProjectModal from "../../../components/modals/AddProjectModal"
import { MonthlyReportModal } from "../../../components/modals/AddProjectMonthlyReportModal"
import { VerifyStartupModal } from "../../../components/modals/ProjectRegistrationModal"
import type { PersonalProjectsResponse, RemoveProjectResponse } from "../../../types/personalPostCache"

export default function ProfilePage() {
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
    const [isFollowing, setIsFollowing] = useState(false)
    const userData = useSelector((state: Rootstate) => state.authData)
    const userId = userData.id;
    const isAdminVerified = userData.adminVerified;
    const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
    const [isMonthlyReportOpen, setIsMonthlyReportOpen] = useState(false);
    const [reportProjectId, setReportProjectId] = useState<string | null>(null);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
    const [verifyProjectId, setVerifyProjectId] = useState<string | null>(null)
    const { data: profileData, isLoading } = useFetchUserProfile(userId)
    const { data: postData, isLoading: postIsLoading } = useFetchPersonalPost(1, 10);
    const { data: projectData, isLoading: projectIsLoading } = useFetchPersonalProjects(1, 10)
    const { mutate: removePost } = useRemovePost();
    const { mutate: removeProject } = useRemoveProject()
    const { mutate: updateProject } = useUpdateProject();
    const { mutate: likePost } = useLikePost()
    const { mutate: likeProject } = useLikeProject()
    console.log("Post data fetched    : ", postData, postIsLoading)
    console.log("Project data fetched    : ", projectData, projectIsLoading)

    const togglePostLike = (postId: string) => {
        setLikedPosts((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(postId)) {
                newSet.delete(postId)
            } else {
                newSet.add(postId)
            }
            return newSet
        })
    }

    const handleRemove = (postId: string) => {
        console.log('PostId to remove this post : ', postId)

        removePost(
            postId, {
            onSuccess: (res) => {
                toast.success("Post removed successfully ", res.message)
                queryClient.invalidateQueries({ queryKey: ["personal-post"] })
            },
            onError: (err) => {
                toast.error(err.message)
            }
        }
        )
    }

    const handleRemoveProject = (projectId: string) => {
        removeProject(projectId, {
            onSuccess: (res: RemoveProjectResponse) => {
                const removedId = res.data.projectId

                toast.success(res.message)

                queryClient.setQueryData<PersonalProjectsResponse>(
                    ["personal-project", 1, 10],
                    (oldData) => {
                        if (!oldData) return oldData

                        const copy = structuredClone(oldData)

                        copy.data.data.projects = copy.data.data.projects.filter(
                            (project) => project._id !== removedId
                        )
                        return copy
                    }
                )
            },
            onError: (err: Error) => {
                toast.error(err.message || "Failed to remove project")
            }
        })
    }

    const handleAddMonthlyReport = (projectId: string) => {
        setReportProjectId(projectId);
        setIsMonthlyReportOpen(true);
    };


    const handleEditProject = (project: ProjectType) => {
        setSelectedProject(project);
        setIsEditProjectOpen(true);
    };

    const extractUpdatedFields = (formData: FormData): Partial<ProjectType> => {
        const obj: Partial<ProjectType> = {};

        formData.forEach((value, key) => {
            if (typeof value === "string") {
                (obj as Record<string, string>)[key] = value;
            }
        });

        return obj;
    };

    const handleUpdateProject = async (formData: FormData): Promise<void> => {
        updateProject(formData, {
            onSuccess: (res) => {
                const updatedProjectId = res?.data?.projectId;
                const updatedLogoUrl = res?.data?.logoUrl;

                const updatedFields = extractUpdatedFields(formData);

                queryClient.setQueryData<PersonalProjectApiResponse>(
                    ["personal-project", 1, 10],
                    (oldData) => {
                        if (!oldData?.data?.data?.projects) return oldData;

                        return {
                            ...oldData,
                            data: {
                                ...oldData.data,
                                data: {
                                    ...oldData.data.data,
                                    projects: oldData.data.data.projects.map((project: ProjectType) =>
                                        project._id === updatedProjectId
                                            ? {
                                                ...project,
                                                ...updatedFields,
                                                logoUrl: updatedLogoUrl ?? project.logoUrl,
                                            }
                                            : project
                                    ),
                                },
                            },
                        };
                    }
                );

                setIsEditProjectOpen(false);
            },
            onError: (err) => {
                toast.error(err.message);
            },
        });
    };

    const handleVerifyProject = (projectId: string) => {
        if (!profileData.data.profileData.adminVerified) {
            toast.error("Your profile must be verified by admin before verifying a startup.");
            return;
        }

        setVerifyProjectId(projectId);
        setIsVerifyModalOpen(true);
    }

    const handleProfileLike = (
        postId: string,
        updateUI: (liked: boolean, count: number) => void
    ) => {
        togglePostLike(postId);
        likePost(postId, {
            onSuccess: (res) => updateUI(res.data.liked, res.data.likeCount),
            onError: () => toast.error("Failed to like post"),
        });
    };


    const handleProjectLike = (
        projectId: string,
        updateUI: (liked: boolean) => void
    ) => {
        likeProject(projectId, {
            onSuccess: (res) => {
                updateUI(res.data.liked);

                queryClient.setQueryData<PersonalProjectApiResponse>(
                    ["personal-project", 1, 10],
                    (old) => {
                        if (!old) return old;

                        return {
                            ...old,
                            data: {
                                ...old.data,
                                data: {
                                    ...old.data.data,
                                    projects: old.data.data.projects.map((p) =>
                                        p._id === projectId
                                            ? {
                                                ...p,
                                                liked: res.data.liked,
                                                likeCount: res.data.likeCount,
                                            }
                                            : p
                                    ),
                                },
                            },
                        };
                    }
                );
            },
            onError: () => {
                updateUI(false);
                toast.error("Failed to like project");
            },
        });
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                {/* Profile Card */}
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8 md:mb-12">
                        {profileData?.data?.profileData && <ProfileCard userData={profileData.data.profileData} isFollowing={isFollowing} onFollow={() => setIsFollowing(!isFollowing)} />}
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="posts" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="posts">Posts</TabsTrigger>
                            <TabsTrigger value="projects">Projects</TabsTrigger>
                        </TabsList>

                        <TabsContent value="posts" className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="grid gap-6"
                            >
                                {postData?.data?.data?.posts && postData.data.data.posts.length > 0 ? (
                                    postData.data.data.posts.map((post: PersonalPost) => (
                                        <PostCard
                                            key={post._id}
                                            id={post._id}
                                            author={{
                                                name: userData.userName,
                                                avatar: userData.profileImg,
                                                followers: 0,
                                            }}
                                            timestamp={new Date(post.createdAt).toLocaleString()}
                                            content={post.content}
                                            mediaUrls={post.mediaUrls || []}
                                            likes={post.likeCount}
                                            comments={post.commentsCount}
                                            liked={post.liked}
                                            onLike={(updateUI) => handleProfileLike(post._id, updateUI)}
                                            context="profile"
                                            onRemove={handleRemove}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        No posts yet
                                    </div>
                                )}
                            </motion.div>
                        </TabsContent>


                        <TabsContent value="projects" className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="grid gap-4"
                            >
                                {projectData?.data?.data?.projects &&
                                    projectData.data.data.projects.length > 0 ? (
                                    projectData.data.data.projects.map((project: ProjectType) => (
                                        <ProjectCard
                                            key={project._id}
                                            id={project._id}
                                            title={project.startupName}
                                            description={project.shortDescription}
                                            stage={project.stage!}
                                            logoUrl={project.logoUrl}
                                            likes={project.likeCount}
                                            liked={project.liked}
                                            onLike={(updateUI) => handleProjectLike(project._id, updateUI)}
                                            onEdit={() => handleEditProject(project)}
                                            onAddReport={handleAddMonthlyReport}
                                            onVerify={handleVerifyProject}
                                            onRemove={handleRemoveProject}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        No projects yet
                                    </div>
                                )}
                            </motion.div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <AddProjectModal
                open={isEditProjectOpen}
                onOpenChange={setIsEditProjectOpen}
                onSubmit={handleUpdateProject}
                isEditing={true}
                initialData={selectedProject}
            />
            <MonthlyReportModal
                open={isMonthlyReportOpen}
                onOpenChange={setIsMonthlyReportOpen}
                projectId={reportProjectId}
            />
            <VerifyStartupModal
                open={isVerifyModalOpen}
                onOpenChange={setIsVerifyModalOpen}
                projectId={verifyProjectId}
                founderId={userId}
            />
        </div>
    )
}