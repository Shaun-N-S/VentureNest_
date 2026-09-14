import { X } from "lucide-react";

interface ImagePreviewModalProps {
    open: boolean;
    onClose: () => void;
    imageUrl: string;
    title?: string;
}

export default function ImagePreviewModal({
    open,
    onClose,
    imageUrl,
    title,
}: ImagePreviewModalProps) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    aria-label="Close preview"
                    className="absolute -top-10 right-0 text-white transition hover:text-gray-300 sm:-top-12"
                >
                    <X size={28} />
                </button>

                {title && (
                    <p className="mb-2 text-center text-sm font-medium text-white">
                        {title}
                    </p>
                )}

                <img
                    src={imageUrl}
                    alt={title || "Preview"}
                    className="mx-auto max-h-[80vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                />
            </div>
        </div>
    );
}
