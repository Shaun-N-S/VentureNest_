import { useState } from "react"
import { ChevronLeft, ChevronRight, Dot } from "lucide-react"

export function MediaCarousel({ mediaUrls }: { mediaUrls: string[] }) {
    const [current, setCurrent] = useState(0)

    const isVideo = (url: string) =>
        url.endsWith(".mp4") || url.endsWith(".mov") || url.includes("video")

    const next = () => setCurrent((prev) => (prev + 1) % mediaUrls.length)
    const prev = () =>
        setCurrent((prev) => (prev - 1 + mediaUrls.length) % mediaUrls.length)

    return (
        <div className="relative w-full bg-black rounded-md overflow-hidden">
            {/* Media Wrapper */}
            <div className="relative aspect-video w-full overflow-hidden">
                {mediaUrls.map((url, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-300 ${index === current ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        {isVideo(url) ? (
                            <video
                                src={url}
                                controls
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src={url}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                alt="Post media"
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Left Arrow */}
            {mediaUrls.length > 1 && (
                <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            )}

            {/* Right Arrow */}
            {mediaUrls.length > 1 && (
                <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            )}

            {/* Dots Indicator */}
            <div className="absolute bottom-3 w-full flex justify-center gap-1">
                {mediaUrls.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`transition-all ${index === current
                            ? "w-3 h-3 bg-white rounded-full"
                            : "w-2 h-2 bg-white/50 rounded-full"
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}
