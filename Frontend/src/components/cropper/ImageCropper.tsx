import { useRef, useState } from "react";
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "../ui/button";
import { X } from "lucide-react";

type ImageCropperProps = {
    imageSrc: string;
    aspect?: number | null;
    onSave: (file: File, previewUrl: string) => void;
    onCancel: () => void;
};

export default function ImageCropper({
    imageSrc,
    aspect,
    onSave,
    onCancel,
}: ImageCropperProps) {
    // Both start undefined until the image finishes loading, at which point
    // onImageLoad below centers a crop box sized to the requested aspect
    // ratio in pixel units. Without this, ReactCrop renders no visible
    // selection box at all until the user manually drags one, which reads as
    // "the cropper is broken" — this was the root cause behind Bug 2's
    // "crop area appears broken or incorrectly sized".
    const [crop, setCrop] = useState<PixelCrop>();
    // Tracks the last crop the user actually finished dragging (fires on
    // mouseup, unlike `crop` which fires continuously). Falls back to the
    // centered default so "Save Crop" still works if the user never drags.
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

    const imgRef = useRef<HTMLImageElement | null>(null);

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;

        const initialCrop = centerCrop(
            makeAspectCrop(
                { unit: "px", width: width * 0.9 },
                aspect || width / height,
                width,
                height,
            ),
            width,
            height,
        ) as PixelCrop;

        setCrop(initialCrop);
        setCompletedCrop(initialCrop);
    };

    const handleCropComplete = async () => {
        const finalCrop = completedCrop ?? crop;

        if (!imgRef.current || !finalCrop?.width || !finalCrop?.height) {
            onCancel();
            return;
        }

        const imageEl = imgRef.current;
        const scaleX = imageEl.naturalWidth / imageEl.width;
        const scaleY = imageEl.naturalHeight / imageEl.height;

        const sourceWidth = finalCrop.width * scaleX;
        const sourceHeight = finalCrop.height * scaleY;

        const MAX_OUTPUT_DIMENSION = 2000;
        const outputScale = Math.min(
            1,
            MAX_OUTPUT_DIMENSION / Math.max(sourceWidth, sourceHeight)
        );
        const outputWidth = Math.round(sourceWidth * outputScale);
        const outputHeight = Math.round(sourceHeight * outputScale);

        const canvas = document.createElement("canvas");
        canvas.width = outputWidth;
        canvas.height = outputHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(
            imageEl,
            finalCrop.x * scaleX,
            finalCrop.y * scaleY,
            sourceWidth,
            sourceHeight,
            0,
            0,
            outputWidth,
            outputHeight
        );

        canvas.toBlob((blob) => {
            if (!blob) return;

            const file = new File([blob], `crop-${Date.now()}.jpg`, { type: "image/jpeg" });
            const previewUrl = URL.createObjectURL(file);

            onSave(file, previewUrl);
        }, "image/jpeg", 0.95);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[56] p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl max-h-[95vh] flex flex-col space-y-4 overflow-hidden">

                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Crop Image</h3>
                    <button
                        onClick={onCancel}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Cropper Container */}
                <div className="flex-1 min-h-0 overflow-hidden bg-gray-50 rounded-lg border border-gray-300">
                    <div className="p-4 flex items-center justify-center h-full">
                        <style>{`
                            .react-crop-wrapper {
                                max-width: 100%;
                                max-height: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }

                            .ReactCrop {
                                max-width: 100%;
                                max-height: 65vh;
                            }

                            .ReactCrop img {
                                max-width: 100%;
                                max-height: 65vh;
                                width: auto;
                                height: auto;
                                display: block;
                            }
                        `}</style>

                        <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspect || undefined}
                            ruleOfThirds
                            className="react-crop-wrapper"
                        >
                            <img
                                ref={imgRef}
                                src={imageSrc}
                                alt="Crop target"
                                onLoad={onImageLoad}
                                className="block max-w-full max-h-[65vh] w-auto h-auto"
                            />
                        </ReactCrop>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleCropComplete} className="bg-blue-600 hover:bg-blue-700">
                        Save Crop
                    </Button>
                </div>
            </div>
        </div>
    );
}
