import { useState } from "react"
import { ProfileCard } from "../../../../components/card/ProfileCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { motion } from "framer-motion"
import { PostCard } from "../../../../components/card/PostCard"
import { ProjectCard } from "../../../../components/card/ProjectCard"
import { useSelector } from "react-redux"
import type { Rootstate } from "../../../../store/store"
import { useFetchInvestorProfile } from "../../../../hooks/Investor/Profile/InvestorProfileHooks"
import { useFetchPersonalPost, useRemovePost } from "../../../../hooks/Post/PostHooks"
import toast from "react-hot-toast"
import { queryClient } from "../../../../main"

export interface PersonalPost {
    _id: string;
    authorId: string;
    content: string;
    mediaUrls: string[];
    likeCount: number;
    commentsCount: number;
    createdAt: string;
    updatedAt: string;
}



export default function ProfilePage() {
    const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set())
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
    const [isFollowing, setIsFollowing] = useState(false)
    const userData = useSelector((state: Rootstate) => state.authData)
    const userId = userData.id;
    const { data, isLoading, error } = useFetchInvestorProfile(userId)
    const { data: postData, isLoading: postIsLoading } = useFetchPersonalPost(1, 10);
    console.log("Post data fetched    : ", postData, postIsLoading)
    const { mutate: removePost } = useRemovePost()

    const projects = [
        {
            id: "1",
            title: "GreenCart",
            description: "A hyperlocal grocery delivery app focused on sustainable packaging and farm-to-home delivery.",
            stage: "Idea",
            logo: "/greencart-logo.jpg",
            likes: 234,
        },
        {
            id: "2",
            title: "TechFlow",
            description: "AI-powered workflow automation platform for enterprises.",
            stage: "Seed",
            logo: "/techflow-logo.jpg",
            likes: 567,
        },
    ]


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
        console.log("Deleting post:", postId);

        removePost(postId, {
            onSuccess: (res) => {
                console.log('heey reomved ')  // ← NOW WORKS
                toast.success(res.message);
            },
            onError: (err) => {
                toast.error("Failed to delete");
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                {/* Profile Card */}
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8 md:mb-12">
                        {data?.data?.profileData && <ProfileCard userData={data.data.profileData} isFollowing={isFollowing} onFollow={() => setIsFollowing(!isFollowing)} />}
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="posts" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="posts">Posts</TabsTrigger>
                            <TabsTrigger value="projects">Investments</TabsTrigger>
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

                        {/* <TabsContent value="projects" className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="grid gap-4"
                            >
                                {projects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        {...project}
                                        liked={likedProjects.has(project.id)}
                                        onLike={() => toggleProjectLike(project.id)}
                                    />
                                ))}
                            </motion.div>
                        </TabsContent> */}
                    </Tabs>
                </div>
            </div>
        </div>
    )
}