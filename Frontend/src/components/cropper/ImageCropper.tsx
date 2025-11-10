import { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

type CropperProps = {
    imageSrc: string;
    aspect: number;
    onSave: (croppedFile: File, previewUrl: string) => void;
    onCancel: () => void;
};

export default function ImageCropper({
    imageSrc,
    aspect,
    onSave,
    onCancel,
}: CropperProps) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);


    const getCroppedImg = async (src: string, crop: Area): Promise<File> => {
        const img = document.createElement("img");
        img.src = src;
        await new Promise((res) => (img.onload = res));

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        canvas.width = crop.width;
        canvas.height = crop.height;
        ctx.drawImage(
            img,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise<File>((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    const fileName = `cropped-${Date.now()}.jpg`;
                    resolve(new File([blob], fileName, { type: "image/jpeg" }));
                }
            }, "image/jpeg");
        });
    };

    const handleSave = async () => {
        if (!croppedAreaPixels) return;
        const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
        const previewUrl = URL.createObjectURL(croppedFile);
        onSave(croppedFile, previewUrl);
    };


    const previewRef = useRef<string | null>(null);
    useEffect(() => {
        return () => {
            if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-4">
            <div className="w-full max-w-md space-y-4">
                {/* Cropper */}
                <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>

                {/* Zoom Slider */}
                {/* <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <Label className="text-white text-sm mb-2 block">Zoom</Label>
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full accent-blue-600"
                    />
                </div> */}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
                        Save Crop
                    </Button>
                </div>
            </div>
        </div>
    );
}