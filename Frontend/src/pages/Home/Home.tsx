import { useSelector, useDispatch } from 'react-redux';
import type { Rootstate } from '../../store/store';
import { useIntrestedTopics } from '../../hooks/Auth/AuthHooks';
import toast from 'react-hot-toast';
import TopicSelectionModal from '../../components/modals/InterestedTopics';
import { useEffect, useState } from 'react';
import { updateUserData } from '../../store/Slice/authDataSlice';
import { useFetchAllPosts, useLikePost } from '../../hooks/Post/PostHooks';
import { PostCard } from '../../components/card/PostCard';
import { FileText, ImageIcon, Loader2, Plus, Smile, VideoIcon } from 'lucide-react';
import { queryClient } from '../../main';
import { getSocket } from '../../lib/socket';
import type { FetchPostsResponse } from '../../types/postFeed';
import CreatePostModal from '../../components/modals/CreatePostModal';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

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
  const { mutate: likePost } = useLikePost()
  const dispatch = useDispatch();
  console.log("data : : ", postData?.data?.posts)
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

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const socket = getSocket(token);

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED → ", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("SOCKET ERROR:", err.message);
    });

    socket.on("post:likeToggled", (event) => {
      console.log("REALTIME EVENT RECEIVED:", event);

      const { postId, likeCount } = event;

      queryClient.setQueryData(["posts-feed", page, limit], (old?: FetchPostsResponse) => {
        if (!old?.posts) return old;

        return {
          ...old,
          posts: old.posts.map(post =>
            post._id === postId ? { ...post, likeCount } : post
          ),
        };
      });
    });

    return () => {
      socket.off("post:likeToggled");
    };
  }, []);


  const handleSave = (selected: string[]) => {
    setTopics(selected);
    setInterestedTopics({ id: userData.id, interestedTopics: selected }, {
      onSuccess: () => {
        dispatch(updateUserData({ isFirstLogin: false }));
        toast.success('Topics saved successfully!');
      },
      onError: (err) => {
        console.error(err);
        toast.error('Failed to save topics');
      },
    });
  };

  const handleReport = (postId: string) => {
    console.log("post id for reporting ", postId)
  }

  const handleLike = (postId: string, updateUI: (liked: boolean, count: number) => void) => {
    likePost(postId, {
      onSuccess: (res) => {
        updateUI(res.data.liked, res.data.likeCount);
      },
      onError: () => {
        toast.error("Failed to like post");
      }
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
        <div className="flex justify-center items-center py-20 text-gray-500 gap-2">
          <Loader2 className="animate-spin h-5 w-5" />
          Loading posts...
        </div>

      ) : (postData?.data?.posts ?? []).length > 0 ? (

        <div className="max-w-2xl mx-auto space-y-6">

          {/* Start a Post (LinkedIn-style) */}
          <div className="bg-white rounded-xl border shadow-sm p-4 mt-4">

            {/* Top Bar */}
            <div
              onClick={() => setIsCreatePostModal(true)}
              className="flex items-center gap-4 border rounded-full px-4 py-3 cursor-pointer 
               hover:bg-gray-50 transition"
            >
              <Avatar className="h-11 w-11">
                <AvatarImage className='rounded-full' src={userData.profileImg} />
                <AvatarFallback>{userData.userName?.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 text-gray-600">
                Start a post...
              </div>
            </div>

            {/* Bottom Quick Actions */}
            {/* <div className="flex justify-between mt-4 px-2">

              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
                <ImageIcon className="h-5 w-5 text-blue-500" />
                Photo
              </button>

              <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition">
                <VideoIcon className="h-5 w-5 text-green-500" />
                Video
              </button>

              <button className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition">
                <FileText className="h-5 w-5 text-yellow-500" />
                Write Article
              </button>

              <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition">
                <Plus className="h-5 w-5 text-purple-500" />
                More
              </button>

            </div> */}
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
              onLike={(updateUI) => handleLike(post._id, updateUI)}
              onReport={handleReport}
              context='home'
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
