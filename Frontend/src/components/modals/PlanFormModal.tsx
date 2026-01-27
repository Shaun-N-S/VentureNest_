"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

/* ================= TYPES ================= */

type PlanRole = "USER" | "INVESTOR";

interface Billing {
  price: number;
  durationDays: number;
}

interface Limits {
  projects?: number;
  proposalsPerMonth?: number;
  meetingRequests?: number;
  investmentOffers?: number;
  activeInvestments?: number;
}

interface Permissions {
  canCreateProject: boolean;
  canSendProposal: boolean;
  canRequestMeeting: boolean;
  canSendInvestmentOffer: boolean;
  canInvestMoney: boolean;
  canViewInvestmentDashboard: boolean;
}

export interface CreatePlanFormData {
  name: string;
  role: PlanRole;
  description: string;
  limits: Limits;
  permissions: Permissions;
  billing: Billing;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePlanFormData) => Promise<void>;
  initialData?: CreatePlanFormData;
}

/* ================= COMPONENT ================= */

export function PlanFormModal({ open, onClose, onSubmit, initialData }: Props) {
  const [role, setRole] = useState<PlanRole>(initialData?.role ?? "USER");

  const [form, setForm] = useState<CreatePlanFormData>(
    initialData ?? {
      name: "",
      role: "USER",
      description: "",
      limits: {
        projects: 0,
        proposalsPerMonth: 0,
        meetingRequests: 0,
        investmentOffers: 0,
        activeInvestments: 0,
      },
      permissions: {
        canCreateProject: false,
        canSendProposal: false,
        canRequestMeeting: false,
        canSendInvestmentOffer: false,
        canInvestMoney: false,
        canViewInvestmentDashboard: false,
      },
      billing: {
        price: 0,
        durationDays: 30,
      },
    },
  );

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setRole(initialData.role);
    } else {
      setForm({
        name: "",
        role: "USER",
        description: "",
        limits: {
          projects: 0,
          proposalsPerMonth: 0,
          meetingRequests: 0,
          investmentOffers: 0,
          activeInvestments: 0,
        },
        permissions: {
          canCreateProject: false,
          canSendProposal: false,
          canRequestMeeting: false,
          canSendInvestmentOffer: false,
          canInvestMoney: false,
          canViewInvestmentDashboard: false,
        },
        billing: {
          price: 0,
          durationDays: 30,
        },
      });
      setRole("USER");
    }
  }, [initialData, open]);

  const updateField = <T extends keyof CreatePlanFormData>(
    key: T,
    value: CreatePlanFormData[T],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateLimits = <K extends keyof Limits>(key: K, value: number) => {
    setForm((prev) => ({
      ...prev,
      limits: { ...prev.limits, [key]: value },
    }));
  };

  const updatePermissions = <K extends keyof Permissions>(
    key: K,
    value: boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, [key]: value },
    }));
  };

  const handleSubmit = async () => {
    await onSubmit({ ...form, role });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* HEADER */}
        <DialogHeader className="sticky top-0 z-10 bg-white border-b px-6 py-4">
          <DialogTitle className="text-xl font-bold">
            {initialData
              ? "Edit Subscription Plan"
              : "Create Subscription Plan"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Configure plan details, limits, permissions and billing.
          </p>
        </DialogHeader>

        <div className="space-y-8 px-6 py-6">
          {/* BASIC INFO */}
          <Section title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Plan Name">
                <Input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </Field>

              <Field label="Role">
                <Select
                  value={role}
                  onValueChange={(val) => {
                    const role = val as PlanRole;
                    setRole(role);
                    setForm((prev) => ({
                      ...prev,
                      role,
                      limits:
                        role === "USER"
                          ? {
                              projects: prev.limits.projects ?? 0,
                              proposalsPerMonth:
                                prev.limits.proposalsPerMonth ?? 0,
                              meetingRequests: prev.limits.meetingRequests ?? 0,
                              investmentOffers: 0,
                              activeInvestments: 0,
                            }
                          : {
                              projects: 0,
                              proposalsPerMonth: 0,
                              meetingRequests: 0,
                              investmentOffers:
                                prev.limits.investmentOffers ?? 0,
                              activeInvestments:
                                prev.limits.activeInvestments ?? 0,
                            },
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User (Founder)</SelectItem>
                    <SelectItem value="INVESTOR">Investor</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Description">
              <Textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </Field>
          </Section>

          {/* BILLING */}
          <Section title="Billing">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Price">
                <Input
                  type="number"
                  value={form.billing.price}
                  onChange={(e) =>
                    updateField("billing", {
                      ...form.billing,
                      price: Number(e.target.value),
                    })
                  }
                />
              </Field>

              <Field label="Duration (Days)">
                <Input
                  type="number"
                  value={form.billing.durationDays}
                  onChange={(e) =>
                    updateField("billing", {
                      ...form.billing,
                      durationDays: Number(e.target.value),
                    })
                  }
                />
              </Field>
            </div>
          </Section>

          {/* ROLE SPECIFIC */}
          {role === "USER" && (
            <Section title="User Limits & Permissions">
              <LimitsGrid>
                <NumberInput
                  label="Projects"
                  value={form.limits.projects}
                  onChange={(v) => updateLimits("projects", v)}
                />
                <NumberInput
                  label="Proposals / Month"
                  value={form.limits.proposalsPerMonth}
                  onChange={(v) => updateLimits("proposalsPerMonth", v)}
                />
                <NumberInput
                  label="Meeting Requests"
                  value={form.limits.meetingRequests}
                  onChange={(v) => updateLimits("meetingRequests", v)}
                />
              </LimitsGrid>

              <PermissionsGrid>
                <PermissionToggle
                  label="Create Project"
                  value={form.permissions.canCreateProject}
                  onChange={(v) => updatePermissions("canCreateProject", v)}
                />
                <PermissionToggle
                  label="Send Proposal"
                  value={form.permissions.canSendProposal}
                  onChange={(v) => updatePermissions("canSendProposal", v)}
                />
                <PermissionToggle
                  label="Request Meeting"
                  value={form.permissions.canRequestMeeting}
                  onChange={(v) => updatePermissions("canRequestMeeting", v)}
                />
              </PermissionsGrid>
            </Section>
          )}

          {role === "INVESTOR" && (
            <Section title="Investor Limits & Permissions">
              <LimitsGrid>
                <NumberInput
                  label="Investment Offers"
                  value={form.limits.investmentOffers}
                  onChange={(v) => updateLimits("investmentOffers", v)}
                />
                <NumberInput
                  label="Active Investments"
                  value={form.limits.activeInvestments}
                  onChange={(v) => updateLimits("activeInvestments", v)}
                />
              </LimitsGrid>

              <PermissionsGrid>
                <PermissionToggle
                  label="Send Investment Offer"
                  value={form.permissions.canSendInvestmentOffer}
                  onChange={(v) =>
                    updatePermissions("canSendInvestmentOffer", v)
                  }
                />
                <PermissionToggle
                  label="Invest Money"
                  value={form.permissions.canInvestMoney}
                  onChange={(v) => updatePermissions("canInvestMoney", v)}
                />
                <PermissionToggle
                  label="View Dashboard"
                  value={form.permissions.canViewInvestmentDashboard}
                  onChange={(v) =>
                    updatePermissions("canViewInvestmentDashboard", v)
                  }
                />
              </PermissionsGrid>
            </Section>
          )}
        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? "Update Plan" : "Create Plan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ================= UI HELPERS ================= */

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">{title}</h3>
    <div className="bg-gray-50 border rounded-lg p-4 space-y-4">{children}</div>
  </div>
);

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <Label className="text-sm font-medium">{label}</Label>
    {children}
  </div>
);

const LimitsGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
);

const PermissionsGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
);

const NumberInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: number;
  onChange: (v: number) => void;
}) => (
  <Field label={label}>
    <Input
      type="number"
      value={value ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </Field>
);

function PermissionToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between border rounded-md px-3 py-2 bg-white">
      <span className="text-sm">{label}</span>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}
