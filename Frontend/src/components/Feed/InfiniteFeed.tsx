import { useRef, useEffect } from "react";
import { PostCard } from "../card/PostCard";
import { useInfinitePosts } from "../../hooks/Post/PostHooks";
import type { AllPost } from "../../pages/Home/Home";
import { Loader2, Smile } from "lucide-react";

export default function InfiniteFeed() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfinitePosts(3);

    const loaderRef = useRef<HTMLDivElement | null>(null);

    const posts: AllPost[] = data?.pages.flatMap(page => page.posts) || [];

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });

        if (loaderRef.current) observer.observe(loaderRef.current);

        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage]);

    if (isLoading) {
        return (
            <div className="text-center py-12 text-gray-500 flex justify-center items-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" />
                Loading posts...
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 flex flex-col items-center gap-2">
                <Smile className="h-8 w-8 text-gray-400" />
                No posts yet
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-4 space-y-6">
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
                    liked={post.liked || false}
                    onLike={() => console.log("Like Post:", post._id)}
                />
            ))}

            {isFetchingNextPage && (
                <p className="text-center text-gray-500 py-4">Loading more posts…</p>
            )}

            <div ref={loaderRef} className="h-6"></div>
        </div>
    );
}
