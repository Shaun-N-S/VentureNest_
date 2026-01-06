// import { useRef } from "react";
// import { Cropper, RectangleStencil } from "react-advanced-cropper";
// import type { CropperRef } from "react-advanced-cropper";
// import "react-advanced-cropper/dist/style.css";
// import { Button } from "../ui/button";

// type ImageCropperProps = {
//     imageSrc: string;
//     aspect?: number | null;
//     onSave: (file: File, previewUrl: string) => void;
//     onCancel: () => void;
// };

// export default function ImageCropper({
//     imageSrc,
//     aspect = null,
//     onSave,
//     onCancel,
// }: ImageCropperProps) {
//     const cropperRef = useRef<CropperRef>(null);

//     const handleSave = () => {
//         const cropper = cropperRef.current;
//         if (!cropper) return;

//         const canvas = cropper.getCanvas();
//         if (!canvas) return;

//         canvas.toBlob((blob) => {
//             if (!blob) return;

//             const file = new File([blob], `crop-${Date.now()}.jpg`, { type: "image/jpeg" });
//             const previewUrl = URL.createObjectURL(file);

//             onSave(file, previewUrl);
//         }, "image/jpeg");
//     };

//     return (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[56] p-4">
//             <div className="bg-white rounded-xl shadow-xl p-4 max-w-3xl w-full space-y-4">

//                 {/* Cropper */}
//                 <div className="h-[450px] rounded-xl overflow-hidden border bg-gray-100">
//                     <Cropper
//                         ref={cropperRef}
//                         src={imageSrc}
//                         stencilComponent={RectangleStencil}
//                         stencilProps={{
//                             aspectRatio: aspect || undefined, // null → free crop
//                             movable: true,
//                             resizable: true,
//                             lines: true,
//                             handlers: true,
//                         }}
//                         className="cropper max-h-[450px] w-full"
//                     />
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex justify-end gap-3">
//                     <Button variant="outline" onClick={onCancel}>Cancel</Button>
//                     <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
//                         Save Crop
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// }

import { useRef, useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
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
    const [crop, setCrop] = useState<Crop>({
        height: 0,
        unit: "px",
        width: 0,
        x: 0,
        y: 0,
    });

    const imgRef = useRef<HTMLImageElement | null>(null);

    const handleCropComplete = async () => {
        if (!imgRef.current || !crop.width || !crop.height) {
            onCancel();
            return;
        }

        const imageEl = imgRef.current;
        const scaleX = imageEl.naturalWidth / imageEl.width;
        const scaleY = imageEl.naturalHeight / imageEl.height;

        const canvas = document.createElement("canvas");
        canvas.width = crop.width;
        canvas.height = crop.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(
            imageEl,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        canvas.toBlob((blob) => {
            if (!blob) return;

            const file = new File([blob], `crop-${Date.now()}.jpg`, { type: "image/jpeg" });
            const previewUrl = URL.createObjectURL(file);

            onSave(file, previewUrl);
        }, "image/jpeg");
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
                <div className="flex-1 overflow-auto bg-gray-50 rounded-lg border border-gray-300">
                    <div className="p-4 flex items-center justify-center min-h-full">
                        <style>{`
                            .react-crop-wrapper {
                                width: 100%;
                                height: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }

                            .ReactCrop {
                                max-width: 100%;
                                height: auto;
                            }

                            .ReactCrop img {
                                max-width: 100%;
                                height: auto;
                                display: block;
                            }
                        `}</style>

                        <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            aspect={aspect || undefined}
                            ruleOfThirds
                            className="react-crop-wrapper"
                        >
                            <img
                                ref={imgRef}
                                src={imageSrc}
                                alt="Crop target"
                                className="max-w-full h-auto"
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