import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addPost,
  fetchAllPosts,
  fetchPersonalPosts,
  removePost,
} from "../../services/Post/PostService";
import type { AllPost } from "../../pages/Home/Home";

export const useCreatePost = () => {
  return useMutation({
    mutationFn: (formData: FormData) => addPost(formData),
  });
};

export const useFetchPersonalPost = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["personal-post", page, limit],
    queryFn: () => fetchPersonalPosts(page, limit),
  });
};

export const useFetchAllPosts = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["posts-feed", page, limit],
    queryFn: () => fetchAllPosts(page, limit),
  });
};

interface FetchPostsResponse {
  posts: AllPost[];
  totalPosts: number;
  hasNextPage: boolean;
}

export const useInfinitePosts = (limit = 3) => {
  return useInfiniteQuery<FetchPostsResponse, Error>({
    queryKey: ["posts-infinite", limit],
    queryFn: ({ pageParam }) => fetchAllPosts(pageParam as number, limit),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasNextPage) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes - cache persists for 10 minutes
    refetchOnWindowFocus: false, // Prevent refetch on window focus
  });
};

export const useRemovePost = () => {
  return useMutation({
    mutationFn: (postId: string) => removePost(postId),
  });
};
