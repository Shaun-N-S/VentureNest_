import { useEffect, useState } from "react";
import { ProfileCard } from "../../../../components/card/ProfileCard";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import { motion } from "framer-motion";
import { PostCard } from "../../../../components/card/PostCard";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../../../store/store";
import { useFetchInvestorProfile } from "../../../../hooks/Investor/Profile/InvestorProfileHooks";
import {
  useInfinitePersonalPosts,
  useLikePost,
  useRemovePost,
} from "../../../../hooks/Post/PostHooks";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateUserData } from "../../../../store/Slice/authDataSlice";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { queryClient } from "../../../../main";
import type { InfiniteData } from "@tanstack/react-query";
import type { PersonalPostPage } from "../../../../types/postFeed";
import type { UserRole } from "../../../../types/UserRole";

export interface PersonalPost {
  _id: string;
  name: string;
  authorAvatar: string;
  authorId: string;
  authorRole: UserRole;
  content: string;
  mediaUrls: string[];
  likeCount: number;
  liked: boolean;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false);
  const userData = useSelector((state: Rootstate) => state.authData);
  const userId = userData.id;
  const { data: profileData } = useFetchInvestorProfile(userId);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfinitePersonalPosts(5);

  const isOwnProfile = profileData?.data?.profileData?._id === userData.id;

  const posts = data?.pages.flatMap((page) => page.data.data.posts) ?? [];

  const { mutate: likePost } = useLikePost();
  const { mutate: removePost } = useRemovePost();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!profileData?.data?.profileData) return;

    const p = profileData.data.profileData;

    dispatch(
      updateUserData({
        postsCount: p.postCount,
        investmentCount: p.investmentCount,
        connectionsCount: p.connectionsCount,
      }),
    );
  }, [profileData, dispatch]);

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
    queryClient.setQueryData<InfiniteData<PersonalPostPage>>(
      ["personal-post"],
      (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              data: {
                ...page.data.data,
                posts: page.data.data.posts.map((post) =>
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
          })),
        };
      },
    );

    likePost(postId, {
      onError: () => {
        queryClient.invalidateQueries({ queryKey: ["personal-post"] });
        toast.error("Failed to like post");
      },
    });
  };

  const handleRemove = (postId: string) => {
    removePost(postId, {
      onSuccess: (res) => {
        toast.success(res.message);
      },
      onError: () => {
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
            {profileData?.data?.profileData && (
              <ProfileCard
                userData={profileData.data.profileData}
                isOwnProfile={isOwnProfile}
                isFollowing={isFollowing}
                onFollow={() => setIsFollowing(!isFollowing)}
              />
            )}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-1 mb-8">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              {/* <TabsTrigger value="projects">Investments</TabsTrigger> */}
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
                        id: userData.id,
                        role: userData.role as UserRole,
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
                      onLike={() => handleProfileLike(post._id)}
                      context="profile"
                      onRemove={handleRemove}
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
          </Tabs>
        </div>
      </div>
    </div>
  );
}
