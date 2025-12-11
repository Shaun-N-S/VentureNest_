import { Link, useParams } from "react-router-dom"
import { useFetchProjectById } from "../../hooks/Project/projectHooks"
import { ProjectDetailCard } from "../../components/card/ProjectDetailCard"
import { Button } from "../../components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

const ProjectDetailedPage = () => {
    const { id } = useParams()
    const { data, isLoading } = useFetchProjectById(id!)

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-muted-foreground font-medium">Loading project...</p>
                </motion.div>
            </div>
        )
    }

    const project = data?.data?.project

    if (!project) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-display font-bold text-foreground">Project not found</h2>
                    <p className="text-muted-foreground">The project you're looking for doesn't exist.</p>
                    <Button asChild>
                        <Link to="/">Go back home</Link>
                    </Button>
                </div>
            </div>
        )
    }

    const founders = [
        {
            id: project.userId,
            name: project.user?.userName || "Unknown",
            image: project.user?.profileImg || "",
            initials: project.user?.userName?.[0] || "?",
        }
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Decorative Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 py-8 md:py-12">
                {/* Project Card */}
                <ProjectDetailCard
                    id={project._id}
                    name={project.startupName}
                    description={project.shortDescription}
                    stage={project.stage}
                    image={project.coverImageUrl}
                    likes={project.likeCount}
                    isLiked={project.isLiked}
                    logo={project.logoUrl}
                    founders={founders}
                    aim={project.shortDescription}
                    pitchDeckUrl={project.pitchDeckUrl}
                    pitchDeckName="Pitch Deck"
                    location={project.location}
                />
            </div>
        </div>
    )
}

export default ProjectDetailedPage
