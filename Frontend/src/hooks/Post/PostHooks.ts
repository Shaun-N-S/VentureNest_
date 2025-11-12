import { useMutation } from "@tanstack/react-query";
import { addPost } from "../../services/Post/PostService";

export const useCreatePost = () => {
  return useMutation({
    mutationFn: (formData: FormData) => addPost(formData),
  });
};
