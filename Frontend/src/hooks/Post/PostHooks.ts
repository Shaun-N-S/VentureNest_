import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  addPost,
  fetchAllPosts,
  fetchPersonalPosts,
  likePost,
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

// interface FetchPostsResponse {
//   posts: AllPost[];
//   totalPosts: number;
//   hasNextPage: boolean;
// }

// export const useInfinitePosts = (limit = 3) => {
//   return useInfiniteQuery<FetchPostsResponse, Error>({
//     queryKey: ["posts-infinite", limit],
//     queryFn: ({ pageParam }) => fetchAllPosts(pageParam as number, limit),
//     getNextPageParam: (lastPage, allPages) => {
//       const hasNext = lastPage?.data?.hasNextPage;

//       if (!hasNext) return undefined;

//       return allPages.length + 1; // Next page number
//     },

//     initialPageParam: 1,
//     staleTime: 1000 * 60 * 5,
//     gcTime: 1000 * 60 * 10,
//     refetchOnWindowFocus: false,
//   });
// };

export const useRemovePost = () => {
  return useMutation({
    mutationFn: (postId: string) => removePost(postId),
  });
};

export const useLikePost = () => {
  return useMutation({
    mutationFn: (postId: string) => likePost(postId),
  });
};
