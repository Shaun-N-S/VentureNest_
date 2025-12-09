import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Download, Flag, MapPin, FileText } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog"

import { Document, Page } from "react-pdf"

interface Founder {
    id: string
    name: string
    image: string
    initials: string
}

interface ProjectDetailCardProps {
    id: string
    name: string
    description: string
    stage: string
    image: string
    likes: number
    isLiked?: boolean
    logo: string
    logoAlt?: string
    founders: Founder[]
    aim: string
    pitchDeckUrl?: string
    pitchDeckName?: string
    location?: string
    onLike?: (id: string) => void
    onReport?: (id: string) => void
}

export function ProjectDetailCard({
    id,
    name,
    description,
    stage,
    image,
    likes,
    isLiked = false,
    logo,
    logoAlt,
    founders,
    aim,
    pitchDeckUrl,
    pitchDeckName,
    location,
    onLike,
    onReport,
}: ProjectDetailCardProps) {

    const [isPdfOpen, setIsPdfOpen] = useState(false)
    const [numPages, setNumPages] = useState<number | null>(null)

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    return (
        <>
            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-sky-100"
            >
                {/* Hero Section */}
                <div className="relative w-full h-60 md:h-80 overflow-hidden bg-gray-100">
                    <img
                        src={image || "/placeholder.svg"}
                        alt={name}
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute top-4 right-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onLike?.(id)}
                            className={`p-2 rounded-full ${isLiked ? "bg-red-100" : "bg-white bg-opacity-90"
                                } shadow-md`}
                        >
                            <Heart
                                className={`w-6 h-6 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-400"
                                    }`}
                            />
                        </motion.button>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {/* Logo + Title */}
                    <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
                        <div className="flex-shrink-0">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow-md">
                                <img
                                    src={logo || "/placeholder.svg"}
                                    alt={logoAlt || name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        {name}
                                    </h1>
                                    <Badge className="mt-2 bg-green-100 text-green-800 border-0">
                                        {stage}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-2 text-gray-600">
                                    <Heart className="w-5 h-5" />
                                    <span className="text-lg font-semibold">{likes}</span>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm md:text-base">{description}</p>
                        </div>
                    </div>

                    {/* Location */}
                    {location && (
                        <div className="flex items-center gap-2 mb-8 pb-8 border-b border-gray-100">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600">{location}</span>
                        </div>
                    )}

                    {/* Founders */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 underline">
                            Founders
                        </h2>

                        <div className="space-y-4">
                            {founders.map((founder) => (
                                <motion.div
                                    key={founder.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                                >
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage
                                            src={founder.image || "/placeholder.svg"}
                                            alt={founder.name}
                                        />
                                        <AvatarFallback>{founder.initials}</AvatarFallback>
                                    </Avatar>

                                    <div>
                                        <p className="font-semibold text-gray-900">{founder.name}</p>
                                        <p className="text-sm text-gray-500">Founder</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Aim */}
                    <div className="mb-8 pb-8 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 underline">Aim</h2>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
                            {aim}
                        </p>
                    </div>

                    {/* Pitch Deck Section */}
                    {pitchDeckUrl && (
                        <div className="mb-8 pb-8 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 underline">
                                Pitch Deck
                            </h2>

                            {/* OPEN PDF MODAL */}
                            <motion.button
                                onClick={() => setIsPdfOpen(true)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <FileText className="w-5 h-5 text-blue-500" />
                                <span className="text-gray-700 font-medium">
                                    View Pitch Deck
                                </span>
                            </motion.button>

                            {/* DOWNLOAD PITCH DECK */}
                            <motion.a
                                href={pitchDeckUrl}
                                download
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="mt-3 flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                            >
                                <Download className="w-5 h-5 text-green-600" />
                                <span className="text-gray-700 font-medium">
                                    {pitchDeckName || "Download PDF"}
                                </span>
                            </motion.a>
                        </div>
                    )}

                    {/* Report Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onReport?.(id)}
                        className="w-full bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <Flag className="w-5 h-5" />
                        Report
                    </motion.button>
                </div>
            </motion.div>

            {/* PDF VIEWER MODAL */}
            <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
                <DialogContent className="max-w-3xl h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Pitch Deck Preview</DialogTitle>
                    </DialogHeader>

                    <div className="flex justify-center bg-gray-100 rounded-lg p-4 overflow-x-auto">
                        {pitchDeckUrl ? (
                            <Document file={pitchDeckUrl} onLoadSuccess={onDocumentLoadSuccess}>

                                {Array.from(new Array(numPages || 0), (_, idx) => (
                                    <Page
                                        key={idx + 1}
                                        pageNumber={idx + 1}
                                        scale={1.2}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                    />
                                ))}
                            </Document>
                        ) : (
                            <p>No PDF available</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

        </>
    )
}
