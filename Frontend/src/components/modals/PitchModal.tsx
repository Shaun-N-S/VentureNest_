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

import { useFetchPersonalProjects } from "../../hooks/Project/projectHooks";
import type { ProjectType } from "../../types/projectType";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useCreatePitch } from "../../hooks/Pitch/pitchHooks";
import {
  pitchFormSchema,
  type PitchFormValues,
} from "../../lib/validations/pitchValidation";

interface PitchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investorId: string;
}

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
      <div className="h-7 w-7 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs font-semibold text-gray-600">
            {name.charAt(0)}
          </span>
        )}
      </div>
      <span className="text-sm truncate">{name}</span>
    </div>
  );
}

/* ---------------- Pitch Modal ---------------- */

export function PitchModal({
  open,
  onOpenChange,
  investorId,
}: PitchModalProps) {
  const { data: projectData, isLoading } = useFetchPersonalProjects(1, 10);
  const { mutate: createPitch } = useCreatePitch();
  let isSubmitting: boolean = false;
  const projects: ProjectType[] = projectData?.data?.data?.projects ?? [];
  console.log("investor id : ", investorId);
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
      {
        ...values,
        investorId,
      },
      {
        onSuccess: () => {
          isSubmitting = true;
          toast.success("Pitch sent successfully");
          reset();
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Failed to send pitch");
        },
      },
    );
  };

  const hasNoProjects = !isLoading && projects.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg rounded-2xl p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Send Pitch
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Introduce your startup and start a conversation with the investor.
          </DialogDescription>
        </DialogHeader>

        {hasNoProjects ? (
          <div className="rounded-xl border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
              You need to create a project before sending a pitch.
            </p>
            <Button className="mt-4" onClick={() => onOpenChange(false)}>
              Create Project
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
            {/* -------- Project Select -------- */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Project</label>

              <Select
                onValueChange={(value) =>
                  setValue("projectId", value, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your project" />
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
                className="w-full"
                placeholder="Investment opportunity in my startup"
                {...register("subject")}
              />
              {errors.subject && (
                <p className="text-xs text-red-500">{errors.subject.message}</p>
              )}
            </div>

            {/* -------- Message -------- */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                className="w-116 resize-none "
                rows={5}
                placeholder="Briefly explain what your startup does, your traction, and what you’re looking for..."
                {...register("message")}
              />
              <p className="text-xs text-muted-foreground">
                Tip: Mention traction, revenue, or what makes you different.
              </p>
              {errors.message && (
                <p className="text-xs text-red-500">{errors.message.message}</p>
              )}
            </div>

            {/* -------- Actions -------- */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 w-50">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Send Pitch"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
