"use client"

import { useState } from "react"
import { ProfileCard } from "../../../../components/card/ProfileCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { motion } from "framer-motion"
import { PostCard } from "../../../../components/card/PostCard"
import { ProjectCard } from "../../../../components/card/ProjectCard"

interface ProfilePageProps {
    investor: {
        name: string
        title: string
        bio: string
        avatar: string
        verified?: boolean
        stats: {
            posts: number
            followers: number
            following: number
        }
    }
    projects: Array<{
        id: string
        title: string
        description: string
        stage: string
        logo: string
        likes?: number
    }>
    posts: Array<{
        id: string
        author: {
            name: string
            avatar: string
            followers: number
        }
        timestamp: string
        content: string
        link?: string
        image?: string
        likes?: number
        comments?: number
    }>
}

export default function Page() {
    const investorData = {
        name: "Jackson",
        title: "Founder of StartupNest | Ex-Entrepreneur at XYZ | Angel Investor | Building something awesome",
        bio: "Verify your account?",
        avatar: "/investor-avatar.jpg",
        verified: true,
        stats: {
            posts: 23,
            followers: 43796,
            following: 1234,
        },
    }

    const projectsData = [
        {
            id: "1",
            title: "GreenCart",
            description: "A hyperlocal grocery delivery app focused on sustainable packaging and farm-to-home delivery.",
            stage: "Idea",
            logo: "/greencart-logo.jpg",
            image: "/greencart-project.jpg",
            likes: 234,
            comments: 45,
        },
        {
            id: "2",
            title: "TechFlow",
            description: "AI-powered workflow automation platform for enterprises.",
            stage: "Seed",
            logo: "/techflow-logo.jpg",
            image: "/techflow-project.jpg",
            likes: 567,
            comments: 89,
        },
    ]

    const postsData = [
        {
            id: "post-1",
            author: {
                name: "Jackson",
                avatar: "/investor-avatar.jpg",
                followers: 43796,
            },
            timestamp: "15min ago",
            content:
                "We just hit 1,000 active users within 2 months! 🚀 Huge thanks to everyone supporting us on this journey",
            link: "https://buff.ly/3e3QaL7",
            image: "/greencart-project.jpg",
            likes: 234,
            comments: 45,
        },
        {
            id: "post-2",
            author: {
                name: "Jackson",
                avatar: "/investor-avatar.jpg",
                followers: 43796,
            },
            timestamp: "2 hours ago",
            content:
                "Big milestone unlocked! 🎉 We've officially closed our Pre-Seed round at $150K, backed by amazing angel investors who align with our vision.",
            link: "https://buff.ly/startup-funding",
            image: "/techflow-project.jpg",
            likes: 567,
            comments: 89,
        },
        {
            id: "post-3",
            author: {
                name: "Jackson",
                avatar: "/investor-avatar.jpg",
                followers: 43796,
            },
            timestamp: "1 day ago",
            content:
                "Excited to announce our partnership with leading sustainability organizations! Together, we're building a greener future for e-commerce. 🌱",
            link: "https://buff.ly/sustainability-partnership",
            image: "/greencart-project.jpg",
            likes: 189,
            comments: 32,
        },
        {
            id: "post-4",
            author: {
                name: "Jackson",
                avatar: "/investor-avatar.jpg",
                followers: 43796,
            },
            timestamp: "3 days ago",
            content:
                "Thrilled to share that we've been selected as one of the top 10 startups in the AgriTech category! 🏆 This recognition motivates us to keep innovating.",
            link: "https://buff.ly/agritech-awards",
            image: "/greencart-project.jpg",
            likes: 412,
            comments: 67,
        },
    ]

    return <ProfilePage investor={investorData} projects={projectsData} posts={postsData} />
}


export function ProfilePage({ investor, projects, posts }: ProfilePageProps) {
    const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set())
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
    const [isFollowing, setIsFollowing] = useState(false)

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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                {/* Profile Card */}
                <div className="mb-8 md:mb-12">
                    <ProfileCard {...investor} isFollowing={isFollowing} onFollow={() => setIsFollowing(!isFollowing)} />
                </div>

                {/* Tabs */}
                <Tabs defaultValue="projects" className="w-full">
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
                            {posts && posts.length > 0 ? (
                                posts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        {...post}
                                        liked={likedPosts.has(post.id)}
                                        onLike={() => togglePostLike(post.id)}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-500">No posts yet</div>
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
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    {...project}
                                    liked={likedProjects.has(project.id)}
                                    onLike={() => toggleProjectLike(project.id)}
                                />
                            ))}
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
