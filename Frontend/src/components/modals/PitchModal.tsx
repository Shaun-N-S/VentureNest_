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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import toast from "react-hot-toast";

import { useFetchPersonalProjects } from "../../hooks/Project/projectHooks";
import { useCreatePitch } from "../../hooks/Pitch/pitchHooks";
import type { ProjectType } from "../../types/projectType";
import {
  pitchFormSchema,
  type PitchFormValues,
} from "../../lib/validations/pitchValidation";

/* ---------------- Project Select Item ---------------- */

function ProjectSelectItem({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl?: string | null;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-full bg-muted overflow-hidden flex items-center justify-center">
        {logoUrl ? (
          <img src={logoUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs font-semibold">
            {name.charAt(0)}
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
  const { data: projectData, isLoading } = useFetchPersonalProjects(1, 10);
  const { mutate: createPitch } = useCreatePitch();
  const projects: ProjectType[] = projectData?.data?.data?.projects ?? [];

  let isSubmitting = false;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PitchFormValues>({
    resolver: zodResolver(pitchFormSchema),
    defaultValues: {
      projectId: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (values: PitchFormValues) => {
    createPitch(
      { ...values, investorId },
      {
        onSuccess: () => {
          isSubmitting = true;
          toast.success("Pitch sent successfully");
          reset();
          onOpenChange(false);
        },
        onError: () => toast.error("Failed to send pitch"),
      }
    );
  };

  const hasNoProjects = !isLoading && projects.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-xl rounded-2xl p-6 sm:p-8">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold">
            Send Pitch 🚀
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Pitch your startup clearly and concisely to start a conversation.
          </DialogDescription>
        </DialogHeader>

        {hasNoProjects ? (
          <div className="mt-6 rounded-xl border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
              You need at least one project to send a pitch.
            </p>
            <Button className="mt-4" onClick={() => onOpenChange(false)}>
              Create Project
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
            {/* -------- Project -------- */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Project</label>
              <Select
                onValueChange={(value) =>
                  setValue("projectId", value, { shouldValidate: true })
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project._id} value={project._id}>
                      <ProjectSelectItem
                        name={project.startupName}
                        logoUrl={project.logoUrl}
                      />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectId && (
                <p className="text-xs text-red-500">
                  {errors.projectId.message}
                </p>
              )}
            </div>

            {/* -------- Subject -------- */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Subject</label>
              <Input
                className="h-11"
                placeholder="Investment opportunity in my startup"
                {...register("subject")}
              />
              {errors.subject && (
                <p className="text-xs text-red-500">
                  {errors.subject.message}
                </p>
              )}
            </div>

            {/* -------- Message -------- */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                rows={6}
                className="resize-none leading-relaxed"
                placeholder="Briefly explain what your startup does, traction, revenue, and what you're looking for..."
                {...register("message")}
              />
              <p className="text-xs text-muted-foreground">
                Tip: Mention traction, users, revenue, or why you stand out.
              </p>
              {errors.message && (
                <p className="text-xs text-red-500">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* -------- Actions -------- */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Pitch
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
