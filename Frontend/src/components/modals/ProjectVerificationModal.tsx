import React, { useState } from "react";
import {
  X,
  ExternalLink,
  Building2,
  User,
  FileCheck,
  Globe,
} from "lucide-react";
import type { AdminProjectRegistration } from "../../types/AdminProjectRegistrationType";
import { useUpdateProjectRegistrationStatus } from "../../hooks/Admin/ProjectHooks";
import toast from "react-hot-toast";
import { queryClient } from "../../main";
import RejectReasonModal from "./RejectReasonModal"; // Reusing your existing rejection modal
import { AxiosError } from "axios";
import { ProjectRegistrationStatus } from "../../types/projectRegistrationStatus";

interface ProjectVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AdminProjectRegistration | null;
}

const ProjectVerificationModal: React.FC<ProjectVerificationModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const { mutate, isPending } = useUpdateProjectRegistrationStatus();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  if (!isOpen || !data) return null;

  const handleStatusUpdate = (
    status: ProjectRegistrationStatus,
    reason?: string,
  ) => {
    mutate(
      {
        registrationId: data.registrationId,
        status: status,
        reason: reason,
      },
      {
        onSuccess: () => {
          toast.success(`Project ${statusConfig.label} successfully`);
          queryClient.invalidateQueries({
            queryKey: ["admin-project-registrations"],
          });
          setRejectModalOpen(false);
          onClose();
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(
              error?.response?.data?.message || `Failed to update status`,
            );
          }
        },
      },
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const STATUS_CONFIG: Record<
    ProjectRegistrationStatus,
    { className: string; label: string }
  > = {
    APPROVED: {
      className: "bg-green-50 text-green-700 border-green-200",
      label: "Approved",
    },
    REJECTED: {
      className: "bg-red-50 text-red-700 border-red-200",
      label: "Rejected",
    },
    SUBMITTED: {
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      label: "Submitted",
    },
    PENDING: {
      className: "bg-blue-50 text-blue-700 border-blue-200",
      label: "Pending",
    },
  };

  const statusConfig = STATUS_CONFIG[data.status];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Project Verification
              </h2>
              <p className="text-xs text-gray-500">ID: {data.registrationId}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full"
              disabled={isPending}
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Branding & Status */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center">
                  <div className="relative group">
                    {data.project.logoUrl ? (
                      <img
                        src={data.project.logoUrl}
                        alt={data.project.startupName}
                        className="w-32 h-32 rounded-2xl object-cover shadow-md border-2 border-white"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-2xl bg-orange-100 flex items-center justify-center text-3xl font-bold text-orange-600 shadow-inner">
                        {data.project.startupName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-gray-900">
                    {data.project.startupName}
                  </h3>
                  <div className="mt-2 flex items-center gap-1 text-gray-500 text-sm">
                    <Globe size={14} />
                    <span>{data.country}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Verification Status
                  </p>
                  <span
                    className={`flex items-center justify-center px-4 py-2 rounded-xl text-sm font-bold w-full border ${statusConfig.className}`}
                  >
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              {/* Right Column: Detailed Information */}
              <div className="lg:col-span-2 space-y-8">
                {/* Section: Founder & Company */}
                <section>
                  <div className="flex items-center gap-2 mb-4 text-gray-800">
                    <Building2 size={20} className="text-blue-500" />
                    <h4 className="font-bold text-lg">Entity Details</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl">
                    <InfoItem
                      label="Founder Name"
                      value={
                        <div className="flex items-center gap-2">
                          <User size={14} /> {data.founder.userName}
                        </div>
                      }
                    />
                    <InfoItem
                      label="CIN Number"
                      value={data.cinNumber || "Not Provided"}
                    />
                    <InfoItem
                      label="Registration Date"
                      value={formatDate(data.createdAt)}
                    />
                  </div>
                </section>

                {/* Section: Legal Documents */}
                <section>
                  <div className="flex items-center gap-2 mb-4 text-gray-800">
                    <FileCheck size={20} className="text-blue-500" />
                    <h4 className="font-bold text-lg">Legal Documents</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.gstCertificateUrl && (
                      <DocumentPreview
                        label="GST Certificate"
                        imageUrl={data.gstCertificateUrl}
                      />
                    )}
                    {data.companyRegistrationCertificateUrl && (
                      <DocumentPreview
                        label="Company Registration"
                        imageUrl={data.companyRegistrationCertificateUrl}
                      />
                    )}
                    {!data.gstCertificateUrl &&
                      !data.companyRegistrationCertificateUrl && (
                        <p className="text-sm text-gray-400 italic">
                          No documents uploaded
                        </p>
                      )}
                  </div>
                </section>

                {data.status === ProjectRegistrationStatus.REJECTED &&
                  data.rejectionReason && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                      <p className="text-xs text-red-400 font-bold uppercase">
                        Previous Rejection Reason
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        {data.rejectionReason}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          {data.status === ProjectRegistrationStatus.SUBMITTED && (
            <div className="bg-gray-50 border-t border-gray-200 px-8 py-5 flex justify-end gap-4 rounded-b-2xl">
              <button
                onClick={() => setRejectModalOpen(true)}
                disabled={isPending}
                className="px-8 py-2.5 bg-white border border-red-200 text-red-600 rounded-full font-semibold hover:bg-red-50 transition shadow-sm disabled:opacity-50"
              >
                Reject Project
              </button>
              <button
                onClick={() =>
                  handleStatusUpdate(ProjectRegistrationStatus.APPROVED)
                }
                disabled={isPending}
                className="px-8 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-md disabled:opacity-50"
              >
                {isPending ? "Approving..." : "Approve Project"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal Component */}
      <RejectReasonModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onSubmit={(reason) =>
          handleStatusUpdate(ProjectRegistrationStatus.REJECTED, reason)
        }
      />
    </>
  );
};

/** Reusable Sub-components **/

const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight mb-1">
      {label}
    </p>
    <div className="text-sm font-semibold text-gray-700">{value || "N/A"}</div>
  </div>
);

const DocumentPreview: React.FC<{ label: string; imageUrl: string }> = ({
  label,
  imageUrl,
}) => (
  <div className="group border border-gray-200 rounded-xl p-3 bg-white hover:border-blue-300 transition-colors">
    <div className="flex justify-between items-center mb-2">
      <p className="text-xs font-bold text-gray-500">{label}</p>
      <a
        href={imageUrl}
        target="_blank"
        rel="noreferrer"
        className="text-blue-500 hover:text-blue-700"
      >
        <ExternalLink size={14} />
      </a>
    </div>
    <div className="relative h-24 bg-gray-100 rounded-lg overflow-hidden">
      <img
        src={imageUrl}
        alt={label}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
  </div>
);

export default ProjectVerificationModal;
