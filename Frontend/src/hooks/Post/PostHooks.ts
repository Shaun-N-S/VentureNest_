import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  addPost,
  fetchAllPosts,
  fetchPersonalPosts,
  fetchPostLikes,
  likePost,
  removePost,
} from "../../services/Post/PostService";
import type { PostsPage } from "../../types/postFeed";
import { queryClient } from "../../main";

export const useCreatePost = () => {
  return useMutation({
    mutationFn: (formData: FormData) => addPost(formData),
  });
};

export const useInfinitePersonalPosts = (limit = 5) => {
  return useInfiniteQuery({
    queryKey: ["personal-post"],
    initialPageParam: 1,

    queryFn: ({ pageParam }) => fetchPersonalPosts(pageParam as number, limit),

    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.data.hasNextPage ? allPages.length + 1 : undefined,

    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

export const useFetchAllPosts = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["posts-feed", page, limit],
    queryFn: () => fetchAllPosts(page, limit),
  });
};

export const useInfinitePosts = (limit = 2) => {
  return useInfiniteQuery<PostsPage>({
    queryKey: ["posts-feed"],
    initialPageParam: 1,

    queryFn: ({ pageParam }) => fetchAllPosts(pageParam as number, limit),

    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasNextPage ? allPages.length + 1 : undefined,

    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

export const useRemovePost = () => {
  return useMutation({
    mutationFn: (postId: string) => removePost(postId),
  });
};

export const useLikePost = () => {
  return useMutation({
    mutationFn: (postId: string) => likePost(postId),

    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ["posts-feed"] });

      const previous = queryClient.getQueryData<InfiniteData<PostsPage>>([
        "posts-feed",
      ]);

      queryClient.setQueryData<InfiniteData<PostsPage>>(
        ["posts-feed"],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) =>
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
            })),
          };
        },
      );

      return { previous };
    },

    onError: (_err, _postId, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["posts-feed"], ctx.previous);
      }
    },
  });
};

export const usePostLikes = (
  postId: string,
  enabled: boolean,
  search?: string,
) => {
  return useInfiniteQuery({
    queryKey: ["post-likes", postId, search],
    enabled,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchPostLikes(postId, pageParam, 5, search),
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNextPage ? pages.length + 1 : undefined,
  });
};
