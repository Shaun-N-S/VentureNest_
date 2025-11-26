import { useParams } from "react-router-dom"
import { useFetchProjectById } from "../../hooks/Project/projectHooks"
import { ProjectDetailCard } from "../../components/card/ProjectDetailCard"

const ProjectDetailedPage = () => {
    const { id } = useParams()
    console.log(id)
    const { data, isLoading } = useFetchProjectById(id!)
    console.log("data in project detailed page : : : : ,", data, isLoading)
    if (isLoading) return <div className="text-center py-10">Loading...</div>

    const project = data?.data?.project

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <ProjectDetailCard
                id={project._id}
                name={project.startupName}
                description={project.shortDescription}
                stage={project.stage}
                image={project.coverImageUrl}
                likes={project.likeCount}
                isLiked={project.isLiked}
                logo={project.logoUrl}
                founders={[
                    {
                        id: project.userId,
                        name: project.founderName || "Founder",
                        image: project.logoUrl,
                        initials: project.startupName.charAt(0)
                    },
                ]}
                aim={project.shortDescription}
                pitchDeckUrl={project.pitchDeckUrl}
                pitchDeckName="Pitch Deck"
                location={project.location}
            />
        </div>
    )
}

export default ProjectDetailedPage
