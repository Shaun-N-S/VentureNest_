import { useSelector, useDispatch } from 'react-redux';
import type { Rootstate } from '../../store/store';
import { useIntrestedTopics } from '../../hooks/Auth/AuthHooks';
import toast from 'react-hot-toast';
import TopicSelectionModal from '../../components/modals/InterestedTopics';
import { useEffect, useState } from 'react';
import { updateUserData } from '../../store/Slice/authDataSlice';
import { useFetchAllPosts } from '../../hooks/Post/PostHooks';
import { PostCard } from '../../components/card/PostCard';
import { Loader2, Smile } from 'lucide-react';

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
  const { data: postData, isLoading, refetch } = useFetchAllPosts(1, 10);
  const dispatch = useDispatch();
  console.log("data : : ", postData?.data)

  useEffect(() => {
    if (userData.isFirstLogin) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [userData]);

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

  // Optional: handle likes
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const togglePostLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
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

        /* Center content area like Instagram / LinkedIn */
        <div className="max-w-2xl mx-auto space-y-6">
          {postData.data.posts.map((post: AllPost) => (
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
              liked={likedPosts.has(post._id)}
              onLike={() => togglePostLike(post._id)}
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
    </div>
  );
};

export default Home;
