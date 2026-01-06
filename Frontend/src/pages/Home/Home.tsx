import { useSelector, useDispatch } from "react-redux";
import type { Rootstate } from "../../store/store";
import { useIntrestedTopics } from "../../hooks/Auth/AuthHooks";
import toast from "react-hot-toast";
import TopicSelectionModal from "../../components/modals/InterestedTopics";
import { useEffect, useState } from "react";
import { updateUserData } from "../../store/Slice/authDataSlice";
import { useInfinitePosts, useLikePost } from "../../hooks/Post/PostHooks";
import { PostCard } from "../../components/card/PostCard";
import { Loader2, Smile } from "lucide-react";
import CreatePostModal from "../../components/modals/CreatePostModal";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useInView } from "react-intersection-observer";
import PostSkeleton from "../../components/Skelton/PostSkelton";

export interface AllPost {
  _id: string;
  authorId: string;
  content: string;
  mediaUrls: string[];
  likeCount: number;
  commentsCount: number;
  authorName: string;
  authorProfileImg: string;
  createdAt: string;
  updatedAt: string;
  liked?: boolean;
}

const Home = () => {
  const userData = useSelector((state: Rootstate) => state.authData);
  const [open, setOpen] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const { mutate: setInterestedTopics } = useIntrestedTopics();
  const { mutate: likePost } = useLikePost();
  const dispatch = useDispatch();
  const {
    data: postData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts(2);

  const posts = postData?.pages.flatMap((page) => page.posts) ?? [];

  console.log("posts : ", postData);
  const [isCreatePostModal, setIsCreatePostModal] = useState(false);
  const userId = useSelector((state: Rootstate) => state.authData.id);
  const role = useSelector((state: Rootstate) => state.authData.role);
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  useEffect(() => {
    if (userData.isFirstLogin) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [userData]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handleSave = (selected: string[]) => {
    setTopics(selected);
    setInterestedTopics(
      { id: userData.id, interestedTopics: selected },
      {
        onSuccess: () => {
          dispatch(updateUserData({ isFirstLogin: false }));
          toast.success("Topics saved successfully!");
        },
        onError: (err) => {
          console.error(err);
          toast.error("Failed to save topics");
        },
      }
    );
  };

  const handleReport = (postId: string) => {
    console.log("post id for reporting ", postId);
  };

  const handleLike = (postId: string) => {
    likePost(postId, {
      onError: () => {
        toast.error("Failed to like post");
      },
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 md:px-12 lg:px-32 xl:px-56 py-6">
      {/* First login topic modal */}
      <TopicSelectionModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSave}
        initialTopics={topics}
      />

      {/* Loading */}
      {isLoading ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {[...Array(3)].map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : (posts ?? []).length > 0 ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Start a Post */}
          <div className="bg-white rounded-xl border shadow-sm p-4 mt-4">
            {/* Top Bar */}
            <div
              onClick={() => setIsCreatePostModal(true)}
              className="flex items-center gap-4 border rounded-full px-4 py-3 cursor-pointer 
               hover:bg-gray-50 transition"
            >
              <Avatar className="h-11 w-11">
                <AvatarImage
                  className="rounded-full"
                  src={userData.profileImg}
                />
                <AvatarFallback>{userData.userName?.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 text-gray-600">Start a post...</div>
            </div>
          </div>

          {posts.map((post: AllPost) => (
            <PostCard
              key={post._id}
              id={post._id}
              author={{
                name: post.authorName,
                avatar: post.authorProfileImg,
                followers: 0,
              }}
              timestamp={new Date(post.createdAt).toLocaleString()}
              content={post.content}
              mediaUrls={post.mediaUrls || []}
              likes={post.likeCount}
              comments={post.commentsCount}
              liked={post.liked}
              onLike={() => handleLike(post._id)}
              onReport={handleReport}
              context="home"
            />
          ))}

          <div ref={ref} className="flex flex-col items-center py-6 gap-4">
            {isFetchingNextPage && (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="animate-spin h-5 w-5" />
                <span className="text-sm">Loading more posts…</span>
              </div>
            )}

            {!hasNextPage && posts.length > 0 && (
              <div className="text-sm text-gray-400">
                You’re all caught up 🎉
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty State UI */
        <div className="flex flex-col justify-center items-center text-gray-500 py-20 gap-2">
          <Smile className="h-10 w-10 text-gray-400" />
          <p>No posts yet</p>
        </div>
      )}

      <CreatePostModal
        isOpen={isCreatePostModal}
        onClose={() => setIsCreatePostModal(false)}
        authorId={userId}
        authorRole={role || "USER"}
      />
    </div>
  );
};

export default Home;
