import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { planFormSchema } from "../../lib/validations/planFormValidation";
import type { PlanFormValues } from "../../lib/validations/planFormValidation";
import type { Plan } from "../../types/planType";

import { useCreatePlan, useUpdatePlan } from "../../hooks/Admin/PlanHooks";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  plan?: Plan | null;
}

const PlanFormModal = ({ isOpen, onClose, plan }: Props) => {
  const isEdit = Boolean(plan);

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: plan?.name ?? "",
      description: plan?.description ?? "",
      billing: {
        price: plan?.billing.price ?? 1,
        durationDays: plan?.billing.durationDays ?? 30,
      },
      limits: {
        messages: plan?.limits.messages ?? 0,
        consentLetters: plan?.limits.consentLetters ?? 0,
        profileBoost: plan?.limits.profileBoost ?? "basic",
      },
    },
  });

  const { mutate: createPlan } = useCreatePlan();
  const { mutate: updatePlan } = useUpdatePlan();

  const onSubmit = (values: PlanFormValues) => {
    if (isEdit && plan) {
      updatePlan(
        { planId: plan._id, payload: values },
        {
          onSuccess: () => {
            toast.success("Plan updated successfully");
            onClose();
          },
        }
      );
    } else {
      createPlan(
        {
          ...values,
          role: "User",
        },
        {
          onSuccess: () => {
            toast.success("Plan created successfully");
            onClose();
          },
        }
      );
    }
  };

  const { errors } = form.formState;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEdit ? "Edit Subscription Plan" : "Create Subscription Plan"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ================= BASIC INFO ================= */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase text-gray-600">
              Basic Information
            </h3>

            <Input placeholder="Plan name" {...form.register("name")} />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}

            <Textarea
              placeholder="Plan description"
              rows={3}
              {...form.register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* ================= BILLING ================= */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase text-gray-600">
              Billing Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Price (₹)"
                {...form.register("billing.price", {
                  valueAsNumber: true,
                })}
              />

              <Input
                type="number"
                placeholder="Duration (days)"
                {...form.register("billing.durationDays", {
                  valueAsNumber: true,
                })}
              />
            </div>

            {(errors.billing?.price || errors.billing?.durationDays) && (
              <p className="text-xs text-red-500">
                {errors.billing?.price?.message ||
                  errors.billing?.durationDays?.message}
              </p>
            )}
          </div>

          {/* ================= LIMITS ================= */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase text-gray-600">
              Usage Limits
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                type="number"
                placeholder="Messages"
                {...form.register("limits.messages", {
                  valueAsNumber: true,
                })}
              />

              <Input
                type="number"
                placeholder="Consent letters"
                {...form.register("limits.consentLetters", {
                  valueAsNumber: true,
                })}
              />

              <Controller
                control={form.control}
                name="limits.profileBoost"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Profile boost" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            {isEdit ? "Update Plan" : "Create Plan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlanFormModal;
