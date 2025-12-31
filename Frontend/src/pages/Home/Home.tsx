import { useSelector, useDispatch } from "react-redux";
import type { Rootstate } from "../../store/store";
import { useIntrestedTopics } from "../../hooks/Auth/AuthHooks";
import toast from "react-hot-toast";
import TopicSelectionModal from "../../components/modals/InterestedTopics";
import { useEffect, useState } from "react";
import { updateUserData } from "../../store/Slice/authDataSlice";
import { useFetchAllPosts, useLikePost } from "../../hooks/Post/PostHooks";
import { PostCard } from "../../components/card/PostCard";
import {
  FileText,
  ImageIcon,
  Loader2,
  Plus,
  Smile,
  VideoIcon,
} from "lucide-react";
import CreatePostModal from "../../components/modals/CreatePostModal";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { queryClient } from "../../main";
import type { FetchPostsResponse } from "../../types/postFeed";
import { getSocket } from "../../lib/socket";

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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { mutate: setInterestedTopics } = useIntrestedTopics();
  const { data: postData, isLoading, refetch } = useFetchAllPosts(page, limit);
  const { mutate: likePost } = useLikePost();
  const dispatch = useDispatch();
  console.log("data : : ", postData?.data?.posts);
  const [isCreatePostModal, setIsCreatePostModal] = useState(false);
  const userId = useSelector((state: Rootstate) => state.authData.id);
  const role = useSelector((state: Rootstate) => state.authData.role);

  useEffect(() => {
    if (userData.isFirstLogin) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [userData]);

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
    const previousData = queryClient.getQueryData<FetchPostsResponse>([
      "posts-feed",
      page,
      limit,
    ]);

    queryClient.setQueryData(
      ["posts-feed", page, limit],
      (old: FetchPostsResponse) => {
        if (!old?.data?.posts) return old;

        return {
          ...old,
          data: {
            ...old.data,
            posts: old.data.posts.map((post: AllPost) => {
              if (post._id !== postId) return post;

              const liked = !post.liked;
              return {
                ...post,
                liked,
                likeCount: liked ? post.likeCount + 1 : post.likeCount - 1,
              };
            }),
          },
        };
      }
    );

    likePost(postId, {
      onError: () => {
        if (previousData) {
          queryClient.setQueryData(["posts-feed", page, limit], previousData);
        }
        toast.error("Failed to like post");
      },
    });
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !userId) {
      console.log("⏭️ Socket not ready in Home");
      return;
    }

    console.log("👂 Home listening for post:likeToggled");

    const onLikeToggled = ({
      postId,
      likeCount,
      likerId,
    }: {
      postId: string;
      likeCount: number;
      likerId: string;
    }) => {
      console.log("📨 Home received socket event:", {
        postId,
        likeCount,
        likerId,
      });

      // 🔁 Update React Query cache
      queryClient.setQueriesData(
        {
          predicate: (query) =>
            Array.isArray(query.queryKey) && query.queryKey[0] === "posts-feed",
        },
        (old: FetchPostsResponse | undefined) => {
          if (!old?.data?.posts) return old;

          return {
            ...old,
            data: {
              ...old.data,
              posts: old.data.posts.map((post) =>
                post._id === postId ? { ...post, likeCount } : post
              ),
            },
          };
        }
      );
    };

    socket.on("post:likeToggled", onLikeToggled);

    return () => {
      socket.off("post:likeToggled", onLikeToggled);
    };
  }, [userId]);

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
        <div className="flex justify-center items-center py-20 text-gray-500 gap-2">
          <Loader2 className="animate-spin h-5 w-5" />
          Loading posts...
        </div>
      ) : (postData?.data?.posts ?? []).length > 0 ? (
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

          {postData?.data?.posts.map((post: AllPost) => (
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
