import { MessageCircle, Share2, MoreVertical } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Badge } from "../ui/badge"
import { AnimatePresence, motion } from "framer-motion"
import type { ProfileCardProps } from "../../types/ProfileCardPropsType"
import { useState } from "react"
import { useSelector } from "react-redux"
import type { Rootstate } from "../../store/store"
import EditInvestorProfileModal from "../modals/InvestorEditProfileModal"
import UserEditProfileModal from "../modals/UserEditProfileModal"
import KYCVerificationModal from "../modals/KYCVerificationModal"



export function ProfileCard(props: ProfileCardProps) {
    console.log(props);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
    const role = useSelector((state: Rootstate) => state.authData.role)
    const userId = useSelector((state: Rootstate) => state.authData.id)
    const { userData, isFollowing, onFollow } = props;
    const handleEditProfile = () => {
        setIsEditModalOpen(true);
    }

    const handleKYCVerification = () => {
        setIsKYCModalOpen(true)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl mx-auto bg-card rounded-2xl border border-border p-6 md:p-8"
        >
            {/* Header with menu */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                    {/* Avatar and Name */}
                    <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-16 w-16 md:h-20 md:w-20">
                            <AvatarImage src={userData.profileImg || "/placeholder.svg"} alt={userData.userName} />
                            <AvatarFallback>{userData.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-xl md:text-2xl font-bold">{userData.userName}</h2>
                                {userData.adminVerified ? (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 flex items-center gap-1">
                                        <span>✓</span> Verified
                                    </Badge>
                                ) : (
                                    <button
                                        onClick={handleKYCVerification}
                                        className="text-sm text-blue-600 hover:underline focus:outline-none"
                                    >
                                        Verify your account?
                                    </button>
                                )}

                            </div>
                        </div>

                    </div>

                    {/* Bio */}
                    <div className="max-w-full md:max-w-[600px] overflow-hidden">
                        <p className="text-sm md:text-base text-foreground mb-4 break-words whitespace-pre-line">
                            {userData.bio}
                        </p>
                    </div>


                    {/* Stats */}
                    <div className="flex gap-6 md:gap-8">
                        <div className="text-center">
                            <p className="font-bold text-lg md:text-xl">{0}</p>
                            <p className="text-xs md:text-sm text-muted-foreground">Posts</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-lg md:text-xl">{0}</p>
                            <p className="text-xs md:text-sm text-muted-foreground">Followers</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-lg md:text-xl">{0}</p>
                            <p className="text-xs md:text-sm text-muted-foreground">Following</p>
                        </div>
                    </div>
                </div>

                {/* Menu button */}
                <div className="relative">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <MoreVertical className="h-4 w-4" />
                    </Button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                    className="absolute right-0 top-10 z-50 w-48 rounded-xl bg-white/50 shadow-lg border border-gray-200 p-2"
                                >
                                    <button
                                        onClick={handleEditProfile}
                                        className="w-full text-center text-sm font-medium text-gray-900 border border-blue-400 rounded-lg py-2.5 hover:bg-blue-50 transition-colors mb-2"
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        // onClick={() => handleMenuClick("Add Project")}
                                        className="w-full text-center text-sm font-medium text-gray-900 border border-blue-400 rounded-lg py-2.5 hover:bg-blue-50 transition-colors mb-2"
                                    >
                                        Add Project
                                    </button>
                                    <button
                                        // onClick={() => handleMenuClick("Create New Post")}
                                        className="w-full text-center text-sm font-medium text-gray-900 border border-blue-400 rounded-lg py-2.5 hover:bg-blue-50 transition-colors"
                                    >
                                        Create a New Post
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
                {/* <Button onClick={onFollow} variant={isFollowing ? "outline" : "default"} className="flex-1">
                    {isFollowing ? "Following" : "Follow"}
                </Button> */}
                <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent">
                    <MessageCircle className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent">
                    <Share2 className="h-4 w-4" />
                </Button>
            </div>
            {role === "INVESTOR" ? (
                <EditInvestorProfileModal
                    data={userData}
                    investorId={userId}
                    open={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                />
            ) : role === "USER" ? (
                <UserEditProfileModal
                    data={userData}
                    userId={userId}
                    open={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                />
            ) : null}

            <KYCVerificationModal id={userId} open={isKYCModalOpen} onOpenChange={setIsKYCModalOpen} />
        </motion.div >
    )
}
