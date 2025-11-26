import { useState } from "react"
import { ProfileCard } from "../../../components/card/ProfileCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { motion } from "framer-motion"
import { PostCard } from "../../../components/card/PostCard"
import { ProjectCard } from "../../../components/card/ProjectCard"
import { useSelector } from "react-redux"
import type { Rootstate } from "../../../store/store"
import { useFetchUserProfile } from "../../../hooks/User/Profile/UserProfileHooks"
import { useFetchPersonalPost, useRemovePost } from "../../../hooks/Post/PostHooks"
import type { PersonalPost } from "../../Investor/Profile/InvestorProfile/ProfilePage"
import toast from "react-hot-toast"
import { queryClient } from "../../../main"
import { useFetchPersonalProjects } from "../../../hooks/Project/projectHooks"
import type { ProjectType } from "../../../types/projectType"

export default function ProfilePage() {
    const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set())
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
    const [isFollowing, setIsFollowing] = useState(false)
    const userData = useSelector((state: Rootstate) => state.authData)
    const userId = userData.id;
    const { data: profileData, isLoading, error } = useFetchUserProfile(userId)
    const { data: postData, isLoading: postIsLoading } = useFetchPersonalPost(1, 10);
    const { data: projectData, isLoading: projectIsLoading } = useFetchPersonalProjects(1, 10)
    const { mutate: removePost } = useRemovePost()
    console.log("Post data fetched    : ", postData, postIsLoading)
    console.log("Project data fetched    : ", projectData, projectIsLoading)

    const toggleProjectLike = (projectId: string) => {
        setLikedProjects((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(projectId)) {
                newSet.delete(projectId)
            } else {
                newSet.add(projectId)
            }
            return newSet
        })
    }

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
                                            liked={likedPosts.has(post._id)}
                                            onLike={() => togglePostLike(post._id)}
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
                                    projectData.data.data.projects.map((project: any) => (
                                        <ProjectCard
                                            key={project._id}
                                            id={project._id}
                                            title={project.startupName}
                                            description={project.shortDescription}
                                            stage={project.stage}
                                            logo={project.logoUrl}
                                            likes={project.likeCount}
                                            liked={likedProjects.has(project._id)}
                                            onLike={() => toggleProjectLike(project._id)}
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
        </div>
    )
}