import { useEffect, useState } from "react";
import { ProfileCard } from "../../components/card/ProfileCard";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { motion } from "framer-motion";
import { PostCard } from "../../components/card/PostCard";
import { ProjectCard } from "../../components/card/ProjectCard";
import { useFetchUserProfile } from "../../hooks/User/Profile/UserProfileHooks";
import {
  useInfinitePersonalPosts,
  useInfinitePersonalPostsById,
  useLikePost,
} from "../../hooks/Post/PostHooks";
import type { PersonalPost } from "../Investor/Profile/InvestorProfile/ProfilePage";
import toast from "react-hot-toast";
import { queryClient } from "../../main";
import {
  useFetchPersonalProjects,
  useFetchPersonalProjectsById,
  useLikeProject,
} from "../../hooks/Project/projectHooks";
import type {
  PersonalProjectApiResponse,
  ProjectType,
} from "../../types/projectType";
import type { PersonalPostCache } from "../../types/personalPostCache";
import { useDispatch } from "react-redux";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import type { UserRole } from "../../types/UserRole";
import { useParams } from "react-router-dom";

export default function CommonProfilePage() {
  const { id } = useParams<{ id?: string }>();
  const [isFollowing, setIsFollowing] = useState(false);
  const { data: profileData } = useFetchUserProfile(id!);
  console.log("profile data 998798987987  :", profileData);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfinitePersonalPostsById(id!, 5);
  const posts = data?.pages.flatMap((page) => page.data.data.posts) ?? [];

  const { data: projectData } = useFetchPersonalProjectsById(id!, 1, 10);
  const { mutate: likePost } = useLikePost();
  const { mutate: likeProject } = useLikeProject();
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handleProfileLike = (postId: string) => {
    const previousData = queryClient.getQueryData<PersonalPostCache>([
      "personal-post",
      1,
      10,
    ]);

    queryClient.setQueryData(
      ["personal-post", 1, 10],
      (old: PersonalPostCache) => {
        if (!old?.data?.data?.posts) return old;

        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              posts: old.data.data.posts.map((post) =>
                post._id === postId
                  ? {
                      ...post,
                      liked: !post.liked,
                      likeCount: post.liked
                        ? post.likeCount - 1
                        : post.likeCount + 1,
                    }
                  : post,
              ),
            },
          },
        };
      },
    );

    likePost(postId, {
      onError: () => {
        if (previousData) {
          queryClient.setQueryData(["personal-post", 1, 10], previousData);
        }
        toast.error("Failed to like post");
      },
    });
  };

  const handleProjectLike = (
    projectId: string,
    updateUI: (liked: boolean) => void,
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
                      : p,
                  ),
                },
              },
            };
          },
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
            {profileData?.data?.profileData && (
              <ProfileCard
                userData={profileData.data.profileData}
                isFollowing={isFollowing}
                onFollow={() => setIsFollowing(!isFollowing)}
              />
            )}
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
                {posts && posts.length > 0 ? (
                  posts.map((post: PersonalPost) => (
                    <PostCard
                      key={post._id}
                      id={post._id}
                      author={{
                        id: post.authorId,
                        role: post.authorRole as UserRole,
                        name:
                          profileData?.data?.profileData?.userName || "Unknown",
                        avatar:
                          profileData?.data?.profileData?.profileImg || "",
                        followers: 0,
                      }}
                      timestamp={new Date(post.createdAt).toLocaleString()}
                      content={post.content}
                      mediaUrls={post.mediaUrls || []}
                      likes={post.likeCount}
                      comments={post.commentsCount}
                      liked={post.liked}
                      onLike={() => handleProfileLike(post._id)}
                      context="profile"
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No posts yet
                  </div>
                )}
                <div ref={ref}>
                  {isFetchingNextPage && <Loader2 className="animate-spin" />}
                </div>
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
                      onLike={(updateUI) =>
                        handleProjectLike(project._id, updateUI)
                      }
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
  );
}
