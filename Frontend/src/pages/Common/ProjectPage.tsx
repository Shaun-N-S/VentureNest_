"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useFetchAllProjects } from "../../hooks/Project/projectHooks"
import { ProjectPageCard } from "../../components/card/ProjectPageCard"
import type { ProjectType } from "../../types/projectType"
import { useNavigate } from "react-router-dom"

const ProjectPage = () => {
    const { data, isLoading } = useFetchAllProjects(1, 10)
    const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set())

    const navigate = useNavigate()

    const openProject = (id: string) => {
        navigate(`/project/${id}`)
    }


    const toggleLike = (projectId: string) => {
        // setLikedProjects((prev) => {
        //     // const updated = new Set(prev)
        //     // updated.has(projectId) ? updated.delete(projectId) : updated.add(projectId)
        //     // return updated
        // })
    }

    if (isLoading) {
        return (
            <div className="text-center py-10 text-gray-600">
                Loading projects...
            </div>
        )
    }

    const projects = data?.data?.projects || []
    console.log("projects    :  :   :", data?.data)

    return (
        <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">
                Discover Innovative Startup Ideas & Projects
            </h1>

            {projects.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No projects found
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                >
                    {projects.map((project: ProjectType) => (
                        <ProjectPageCard
                            key={project._id}
                            id={project._id}
                            name={project.startupName}
                            description={project.shortDescription}
                            stage={project.stage}
                            minFunding={project.donationReceived || 0}
                            maxFunding={project.donationTarget || 0}
                            image={project.coverImageUrl || "/placeholder.svg"}
                            likes={project.likeCount || 0}
                            isLiked={likedProjects.has(project._id)}
                            onLike={() => toggleLike(project._id)}
                            onOpen={openProject}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    )
}

export default ProjectPage
