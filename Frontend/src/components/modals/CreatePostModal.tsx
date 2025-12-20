import { AlertCircle, Image, Loader2, Video, X } from "lucide-react";
import ImageCropper from "../cropper/ImageCropper";
import { AxiosError } from "axios";
import { type ChangeEvent, useRef, useState } from "react";
import { useCreatePost } from "../../hooks/Post/PostHooks";
import toast from "react-hot-toast";
import { queryClient } from "../../main";
import type { PersonalPost } from "../../pages/Investor/Profile/InvestorProfile/ProfilePage";
import type { PersonalPostCache } from "../../types/personalPostCache";

interface MediaPreview {
    url: string;
    type: "image" | "video";
    name: string;
}

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    authorId: string;
    authorRole: string;
}

const MAX_MEDIA = 3;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_DURATION = 45; // seconds

export default function CreatePostModal({
    isOpen,
    onClose,
    // onSubmit,
    authorId,
    authorRole,
}: CreatePostModalProps) {
    const [content, setContent] = useState("");
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<MediaPreview[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [cropperState, setCropperState] = useState<{
        imageSrc: string;
        originalFile: File;
    } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: createPost } = useCreatePost()

    const validateVideo = (file: File): Promise<void> => {
        return new Promise((resolve, reject) => {
            const video = document.createElement("video");
            video.preload = "metadata";

            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                if (video.duration > MAX_VIDEO_DURATION) {
                    reject(`Video must be under ${MAX_VIDEO_DURATION} seconds`);
                } else {
                    resolve();
                }
            };

            video.onerror = () => reject("Invalid video file");
            video.src = URL.createObjectURL(file);
        });
    };

    /** --------------------------------------------------------------
     *  File selection handler
     *  -------------------------------------------------------------- */
    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);

        if (mediaFiles.length + files.length > MAX_MEDIA) {
            setError(`You can only upload up to ${MAX_MEDIA} files`);
            return;
        }

        for (const file of files) {
            const isImage = file.type.startsWith("image/");
            const isVideo = file.type.startsWith("video/");

            if (!isImage && !isVideo) {
                setError("Only images and videos are allowed");
                continue;
            }

            // ---- size checks ----
            if (isImage && file.size > MAX_IMAGE_SIZE) {
                setError(`Image ${file.name} is too large. Max size is 5 MB`);
                continue;
            }
            if (isVideo && file.size > MAX_VIDEO_SIZE) {
                setError(`Video ${file.name} is too large. Max size is 10 MB (≈30-45 sec)`);
                continue;
            }

            // ---- video duration ----
            if (isVideo) {
                try {
                    await validateVideo(file);
                } catch (err) {
                    setError(err as string);
                    continue;
                }
            }

            // ---- images → open cropper ----
            if (isImage) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setCropperState({
                        imageSrc: reader.result as string,
                        originalFile: file,
                    });
                };
                reader.readAsDataURL(file);
                // stop processing this file – cropper will add it later
                continue;
            }

            // ---- videos → add directly ----
            setMediaFiles((prev) => [...prev, file]);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews((prev) => [
                    ...prev,
                    { url: reader.result as string, type: "video", name: file.name },
                ]);
            };
            reader.readAsDataURL(file);
        }

        setError("");
        e.target.value = ""; // reset input
    };

    /** --------------------------------------------------------------
     *  Cropper callback
     *  -------------------------------------------------------------- */
    const handleCroppedImage = (croppedFile: File, previewUrl: string) => {
        setMediaFiles((prev) => [...prev, croppedFile]);
        setPreviews((prev) => [
            ...prev,
            { url: previewUrl, type: "image", name: croppedFile.name },
        ]);
        setCropperState(null);
        setError("");
    };

    /** --------------------------------------------------------------
     *  Remove a media item
     *  -------------------------------------------------------------- */
    const removeMedia = (index: number) => {
        setMediaFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => {
            const newPreviews = prev.filter((_, i) => i !== index);
            URL.revokeObjectURL(prev[index].url);
            return newPreviews;
        });
    };

    /** --------------------------------------------------------------
     *  Submit handler
     *  -------------------------------------------------------------- */
    const handleSubmit = async () => {
        if (!content.trim() && mediaFiles.length === 0) {
            setError("Please add some content or media");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("authorId", authorId);
            formData.append("authorRole", authorRole);
            if (content.trim()) formData.append("content", content.trim());

            mediaFiles.forEach((file) => formData.append("mediaUrls", file));

            createPost(formData, {
                onSuccess: (res) => {
                    const { postId, mediaUrls } = res.data;

                    const newPost: PersonalPost = {
                        _id: postId,
                        authorId,
                        content,
                        mediaUrls,
                        likeCount: 0,
                        liked: false,
                        commentsCount: 0,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };

                    queryClient.setQueryData<PersonalPostCache | undefined>(
                        ["personal-post", 1, 10],
                        (oldData) => {
                            if (!oldData) return oldData;

                            return {
                                ...oldData,
                                data: {
                                    ...oldData.data,
                                    data: {
                                        ...oldData.data.data,
                                        posts: [newPost, ...oldData.data.data.posts],
                                        totalPosts: oldData.data.data.totalPosts + 1,
                                    },
                                },
                            };
                        }
                    );

                    toast.success("Post created!");
                    handleClose();
                },

                onError: (err) => toast.error(err.message),
            });
        } catch (err) {
            const msg =
                err instanceof AxiosError ? err.message : "Failed to create post";
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };


    /** --------------------------------------------------------------
     *  Close / reset
     *  -------------------------------------------------------------- */
    const handleClose = () => {
        previews.forEach((p) => URL.revokeObjectURL(p.url));
        setContent("");
        setMediaFiles([]);
        setPreviews([]);
        setError("");
        setCropperState(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* ---------- Image Cropper (overlay) ---------- */}
            {cropperState && (
                <ImageCropper
                    imageSrc={cropperState.imageSrc}
                    aspect={16/9}
                    onSave={handleCroppedImage}
                    onCancel={() => setCropperState(null)}
                />
            )}

            {/* ---------- Modal ---------- */}
            <div
                className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
                onClick={handleClose}
            >
                <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Create Post
                        </h2>
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Textarea */}
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full min-h-32 p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isSubmitting}
                        />

                        {/* Media previews */}
                        {previews.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {previews.map((preview, idx) => (
                                    <div
                                        key={idx}
                                        className="relative group w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200"
                                    >
                                        {preview.type === "image" ? (
                                            <img
                                                src={preview.url}
                                                alt={`Preview ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="relative w-full h-full">
                                                <video
                                                    src={preview.url}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                                    <Video className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => removeMedia(idx)}
                                            disabled={isSubmitting}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        {/* File size info */}
                        <div className="text-xs text-gray-500 space-y-1">
                            <p>• Images: Max 5 MB each (will be cropped)</p>
                            <p>• Videos: Max 10 MB, 45 seconds (for short clips)</p>
                            <p>• Maximum 3 media files total</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 space-y-3">
                        {/* Add media button */}
                        {mediaFiles.length < MAX_MEDIA && (
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    disabled={isSubmitting}
                                    multiple
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Image className="w-5 h-5 text-gray-600" />
                                    <Video className="w-5 h-5 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">
                                        Add Photos/Videos ({mediaFiles.length}/{MAX_MEDIA})
                                    </span>
                                </button>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={
                                isSubmitting || (!content.trim() && mediaFiles.length === 0)
                            }
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Posting...</span>
                                </>
                            ) : (
                                <span>Post</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}