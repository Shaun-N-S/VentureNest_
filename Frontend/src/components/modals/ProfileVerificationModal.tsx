import React, { useState } from "react";
import { X } from "lucide-react";
import type { KYCStatus } from "../../types/KycStatusType";
import { useUpdateInvestorKyc, useUpdateUsersKyc } from "../../hooks/Admin/KYCHooks";
import KYCStatusChangeModal from "./KYCStatusChangeModal";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface BaseVerificationData {
    _id: string;
    userName: string;
    email: string;
    role: string;
    profileImg?: string;
    website?: string;
    dateOfBirth?: string;
    linkedInUrl?: string;
    kycStatus: KYCStatus;
}

interface UserVerificationData extends BaseVerificationData {
    role: "USER";
    selfieImg?: string;
    aadharImg?: string;
    phoneNumber?: string;
    address?: string;
}

interface InvestorVerificationData extends BaseVerificationData {
    role: "INVESTOR";
    selfieImg?: string;
    aadharImg?: string;
    phoneNumber?: string;
    address?: string;
    investmentMin?: number;
    investmentMax?: number;
    companyName?: string;
    location?: string;
}

type VerificationData = UserVerificationData | InvestorVerificationData;

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: VerificationData | null;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
    isOpen,
    onClose,
    data,
}) => {
    const queryClient = useQueryClient();
    const { mutate: updateUserKyc, isPending: isUpdatingUser } = useUpdateUsersKyc();
    const { mutate: updateInvestorKyc, isPending: isUpdatingInvestor } = useUpdateInvestorKyc();
    const [isKycModalOpen, setIsKycModalOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState<"APPROVE" | "REJECT" | null>(null);

    const isUpdating = isUpdatingUser || isUpdatingInvestor;

    if (!isOpen || !data) return null;

    const isInvestor = data.role === "INVESTOR";
    const investorData = isInvestor ? (data as InvestorVerificationData) : null;
    const userData = !isInvestor ? (data as UserVerificationData) : null;

    const hasKycDocuments =
        (userData && (userData.selfieImg || userData.aadharImg)) ||
        (investorData && (investorData.selfieImg || investorData.aadharImg));

    const hasContactInfo = userData && (userData.phoneNumber || userData.address);

    const handleKycUpdate = (status: "APPROVED" | "REJECTED") => {
        if (!data) return;

        if (data.role === "INVESTOR") {
            updateInvestorKyc(
                { investorId: data._id, newStatus: status },
                {
                    onSuccess: () => {
                        toast.success(`Investor KYC ${status.toLowerCase()} successfully`);
                        queryClient.invalidateQueries({ queryKey: ["investors-kyc"] });
                        setIsKycModalOpen(false);
                        onClose();
                    },
                    onError: (error) => {
                        if (error instanceof AxiosError)
                            toast.error(
                                error?.response?.data?.message ||
                                `Failed to ${status.toLowerCase()} investor KYC`
                            );
                        setIsKycModalOpen(false);
                    },
                }
            );
        } else {
            updateUserKyc(
                { userId: data._id, newStatus: status },
                {
                    onSuccess: () => {
                        toast.success(`User KYC ${status.toLowerCase()} successfully`);
                        queryClient.invalidateQueries({ queryKey: ["users-kyc"] });
                        setIsKycModalOpen(false);
                        onClose();
                    },
                    onError: (error) => {
                        if (error instanceof AxiosError)
                            toast.error(
                                error?.response?.data?.message ||
                                `Failed to ${status.toLowerCase()} user KYC`
                            );
                        setIsKycModalOpen(false);
                    },
                }
            );
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const canApproveOrReject = data.kycStatus === "SUBMITTED" || data.kycStatus === "PENDING";

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl flex-shrink-0">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {isInvestor ? "Verify Investor" : "User Details"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition"
                            disabled={isUpdating}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
                        <style>{`
                            .scrollbar-hide::-webkit-scrollbar {
                                display: none;
                            }
                            .scrollbar-hide {
                                -ms-overflow-style: none;
                                scrollbar-width: none;
                            }
                        `}</style>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Profile Image */}
                            <div className="lg:col-span-1">
                                <div className="bg-gradient-to-br from-orange-200 to-orange-300 rounded-xl p-6 flex flex-col items-center">
                                    {data.profileImg ? (
                                        <img
                                            src={data.profileImg}
                                            alt={data.userName}
                                            className="w-40 h-40 rounded-xl object-cover shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-40 h-40 rounded-xl bg-gray-300 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                                            {data.userName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <h3 className="mt-4 text-xl font-bold text-gray-800">
                                        {data.userName}
                                    </h3>
                                </div>

                                {/* Status Badge */}
                                <div className="mt-4">
                                    <span
                                        className={`inline-block px-4 py-2 rounded-full text-sm font-semibold w-full text-center ${data.kycStatus === "APPROVED"
                                            ? "bg-green-100 text-green-700"
                                            : data.kycStatus === "REJECTED"
                                                ? "bg-red-100 text-red-700"
                                                : data.kycStatus === "SUBMITTED"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {data.kycStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Right Column - Details */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Basic Information */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                                        Basic Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoItem label="Email" value={data.email} />
                                        <InfoItem label="Role" value={data.role} />
                                        <InfoItem
                                            label="Date of Birth"
                                            value={formatDate(data.dateOfBirth)}
                                        />
                                        {data.website && (
                                            <InfoItem
                                                label="Website"
                                                value={
                                                    <a
                                                        href={data.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline truncate block"
                                                    >
                                                        {data.website}
                                                    </a>
                                                }
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* LinkedIn URL */}
                                {data.linkedInUrl && (
                                    <div>
                                        <InfoItem
                                            label="LinkedIn Profile URL"
                                            value={
                                                <a
                                                    href={data.linkedInUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline flex items-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                                    </svg>
                                                    View Profile
                                                </a>
                                            }
                                        />
                                    </div>
                                )}

                                {/* Investor-specific Information */}
                                {isInvestor && investorData && (
                                    <>
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800 mb-3">
                                                Investment Details
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <InfoItem
                                                    label="Average Investment Range"
                                                    value={
                                                        investorData.investmentMin &&
                                                            investorData.investmentMax
                                                            ? `₹${investorData.investmentMin?.toLocaleString()} - ₹${investorData.investmentMax?.toLocaleString()}`
                                                            : "N/A"
                                                    }
                                                />
                                                <InfoItem
                                                    label="Company / Firm Name"
                                                    value={investorData.companyName || "N/A"}
                                                />
                                                <InfoItem
                                                    label="Phone Number"
                                                    value={investorData.phoneNumber || "N/A"}
                                                />
                                                <InfoItem
                                                    label="Location"
                                                    value={investorData.location || "N/A"}
                                                />
                                            </div>
                                        </div>

                                        {investorData.address && (
                                            <div>
                                                <InfoItem
                                                    label="Address"
                                                    value={investorData.address}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* User Contact Information (if available) */}
                                {!isInvestor && hasContactInfo && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-3">
                                            Contact Information
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {userData?.phoneNumber && (
                                                <InfoItem
                                                    label="Phone Number"
                                                    value={userData.phoneNumber}
                                                />
                                            )}
                                            {userData?.address && (
                                                <InfoItem
                                                    label="Address"
                                                    value={userData.address}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* KYC Documents */}
                                {hasKycDocuments && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-3">
                                            KYC Documents
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(investorData?.selfieImg || userData?.selfieImg) && (
                                                <DocumentPreview
                                                    label="Selfie"
                                                    imageUrl={investorData?.selfieImg || userData?.selfieImg || ""}
                                                />
                                            )}
                                            {(investorData?.aadharImg || userData?.aadharImg) && (
                                                <DocumentPreview
                                                    label="Aadhar Card"
                                                    imageUrl={investorData?.aadharImg || userData?.aadharImg || ""}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer - Action Buttons */}
                    {canApproveOrReject && (
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end rounded-b-2xl">
                            <button
                                onClick={() => {
                                    setSelectedAction("REJECT");
                                    setIsKycModalOpen(true);
                                }}
                                disabled={isUpdating}
                                className="px-8 py-2.5 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUpdating ? "Processing..." : "Reject"}
                            </button>

                            <button
                                onClick={() => {
                                    setSelectedAction("APPROVE");
                                    setIsKycModalOpen(true);
                                }}
                                disabled={isUpdating}
                                className="px-8 py-2.5 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUpdating ? "Processing..." : "Approve"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* KYC Status Change Confirmation Modal */}
            {selectedAction && (
                <KYCStatusChangeModal
                    isOpen={isKycModalOpen}
                    onClose={() => {
                        if (!isUpdating) {
                            setIsKycModalOpen(false);
                            setSelectedAction(null);
                        }
                    }}
                    name={data.userName}
                    actionType={selectedAction}
                    onConfirm={() => {
                        handleKycUpdate(selectedAction === "APPROVE" ? "APPROVED" : "REJECTED");
                    }}
                />
            )}
        </>
    );
};

export interface InfoItemProps {
    label: string;
    value: React.ReactNode;
}

export const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
    <div>
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value || "N/A"}</p>
    </div>
);

interface DocumentPreviewProps {
    label: string;
    imageUrl: string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ label, imageUrl }) => (
    <div>
        <p className="text-xs text-gray-500 mb-2">{label}</p>
        <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition"
        >
            <img
                src={imageUrl}
                alt={label}
                className="w-full h-32 object-cover"
            />
        </a>
    </div>
);

export default VerificationModal;