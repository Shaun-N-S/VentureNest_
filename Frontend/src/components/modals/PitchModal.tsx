import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, Sparkles, AlertCircle, Briefcase } from "lucide-react";
import toast from "react-hot-toast";

import { useFetchPersonalProjects } from "../../hooks/Project/projectHooks";
import { useCreatePitch } from "../../hooks/Pitch/pitchHooks";
import type { ProjectType } from "../../types/projectType";
import {
  pitchFormSchema,
  type PitchFormValues,
} from "../../lib/validations/pitchValidation";

/* ---------------- Project Select Item Component ---------------- */

function ProjectSelectItem({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl?: string | null;
}) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="h-8 w-8 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs font-bold text-slate-500">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <span className="text-sm font-medium truncate">{name}</span>
    </div>
  );
}

/* ---------------- Pitch Modal ---------------- */

interface PitchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investorId: string;
}

export function PitchModal({
  open,
  onOpenChange,
  investorId,
}: PitchModalProps) {
  const { data: projectData, isLoading: loadingProjects } =
    useFetchPersonalProjects(1, 10);
  const { mutate: createPitch, isPending } = useCreatePitch(); // Corrected: use isPending from hook

  const projects: ProjectType[] = projectData?.data?.data?.projects ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<PitchFormValues>({
    resolver: zodResolver(pitchFormSchema),
    defaultValues: {
      projectId: "",
      subject: "",
      message: "",
    },
  });

  const selectedProjectId = watch("projectId");

  const onSubmit = (values: PitchFormValues) => {
    createPitch(
      { ...values, investorId },
      {
        onSuccess: () => {
          toast.success("Pitch delivered to investor!");
          reset();
          onOpenChange(false);
        },
        onError: () => toast.error("Failed to send pitch. Please try again."),
      },
    );
  };

  const hasNoProjects = !loadingProjects && projects.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[550px] gap-0 p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
        {/* Decorative Header Gradient */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <div className="p-6 sm:p-10">
          <DialogHeader className="space-y-3 text-left">
            <div className="flex items-center gap-2 text-blue-600">
              <Sparkles className="w-5 h-5 fill-current" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
                Investor Outreach
              </span>
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Deliver Your Pitch
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Make a great first impression. High-quality pitches focus on
              traction, problem-solving, and vision.
            </DialogDescription>
          </DialogHeader>

          {loadingProjects ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm text-slate-400 font-medium">
                Fetching your projects...
              </p>
            </div>
          ) : hasNoProjects ? (
            <div className="mt-8 rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center bg-slate-50">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="font-semibold text-slate-900">
                No Projects Found
              </h3>
              <p className="mt-2 text-sm text-slate-500 max-w-[250px] mx-auto">
                You need an active project to pitch to investors.
              </p>
              <Button
                variant="default"
                className="mt-6 bg-slate-900 hover:bg-slate-800"
                onClick={() => onOpenChange(false)}
              >
                Create a Project First
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              {/* Project Selection */}
              <div className="space-y-2">
                <Label
                  htmlFor="project"
                  className="text-xs font-bold uppercase text-slate-500 ml-1"
                >
                  Select Project
                </Label>
                <Select
                  value={selectedProjectId}
                  onValueChange={(value) =>
                    setValue("projectId", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger
                    className={`h-12 bg-slate-50 border-slate-200 transition-all focus:ring-2 focus:ring-blue-500/20 ${
                      errors.projectId ? "border-red-500 bg-red-50" : ""
                    }`}
                  >
                    <SelectValue placeholder="Which startup are you pitching?" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {projects.map((project) => (
                      <SelectItem
                        key={project._id}
                        value={project._id}
                        className="cursor-pointer"
                      >
                        <ProjectSelectItem
                          name={project.startupName}
                          logoUrl={project.logoUrl}
                        />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.projectId && (
                  <div className="flex items-center gap-1.5 mt-1 text-red-500">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <p className="text-xs font-medium">
                      {errors.projectId.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Subject Line */}
              <div className="space-y-2">
                <Label
                  htmlFor="subject"
                  className="text-xs font-bold uppercase text-slate-500 ml-1"
                >
                  Subject Line
                </Label>
                <Input
                  id="subject"
                  className={`h-12 bg-slate-50 border-slate-200 transition-all focus:ring-2 focus:ring-blue-500/20 ${
                    errors.subject ? "border-red-500 bg-red-50" : ""
                  }`}
                  placeholder="e.g., Revolutionizing Fintech - [Startup Name]"
                  {...register("subject")}
                />
                {errors.subject && (
                  <div className="flex items-center gap-1.5 mt-1 text-red-500">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <p className="text-xs font-medium">
                      {errors.subject.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-xs font-bold uppercase text-slate-500 ml-1"
                >
                  Your Pitch
                </Label>
                <Textarea
                  id="message"
                  rows={5}
                  className={`bg-slate-50 border-slate-200 transition-all focus:ring-2 focus:ring-blue-500/20 resize-none leading-relaxed p-4 ${
                    errors.message ? "border-red-500 bg-red-50" : ""
                  }`}
                  placeholder="Describe your traction, team, and the specific problem you are solving..."
                  {...register("message")}
                />
                <div className="flex items-start justify-between px-1">
                  <p className="text-[11px] text-slate-400 italic max-w-[80%]">
                    Pro-tip: Investors love data. Mention your Monthly Recurring
                    Revenue (MRR) or user growth.
                  </p>
                </div>
                {errors.message && (
                  <div className="flex items-center gap-1.5 mt-1 text-red-500">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <p className="text-xs font-medium">
                      {errors.message.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 order-2 sm:order-1 text-slate-500 hover:bg-slate-100"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 order-1 sm:order-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all h-11 text-white"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Pitch
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
