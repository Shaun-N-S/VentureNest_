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
  investmentOffers?: number;
}

interface Permissions {
  canCreateProject: boolean;
  canSendProposal: boolean;

  canSendInvestmentOffer: boolean;
  canInvestMoney: boolean;
  canViewInvestmentDashboard: boolean;

  canStartVideoCall: boolean;
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Plan name is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";

    if (form.billing.price <= 0)
      newErrors.price = "Price must be greater than 0";
    if (form.billing.durationDays <= 0)
      newErrors.durationDays = "Duration must be greater than 0";

    if (form.limits.projects !== undefined && form.limits.projects < 0)
      newErrors.projects = "Projects limit must be a positive number";

    if (
      form.limits.proposalsPerMonth !== undefined &&
      form.limits.proposalsPerMonth < 0
    )
      newErrors.proposalsPerMonth = "Proposals limit must be a positive number";

    if (
      form.limits.investmentOffers !== undefined &&
      form.limits.investmentOffers < 0
    )
      newErrors.investmentOffers =
        "Investment offers limit must be a positive number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [form, setForm] = useState<CreatePlanFormData>(
    initialData ?? {
      name: "",
      role: "USER",
      description: "",
      limits: {
        projects: 0,
        proposalsPerMonth: 0,
        investmentOffers: 0,
      },
      permissions: {
        canCreateProject: false,
        canSendProposal: false,

        canSendInvestmentOffer: false,
        canInvestMoney: false,
        canViewInvestmentDashboard: false,

        canStartVideoCall: false,
      },
      billing: {
        price: 0,
        durationDays: 30,
      },
    },
  );

  useEffect(() => {
    setErrors({});
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
          investmentOffers: 0,
        },
        permissions: {
          canCreateProject: false,
          canSendProposal: false,

          canSendInvestmentOffer: false,
          canInvestMoney: false,
          canViewInvestmentDashboard: false,

          canStartVideoCall: false,
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
    if (!validate()) return;

    try {
      setLoading(true);
      await onSubmit({ ...form, role });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
                  className={errors.name ? "border-red-500" : ""}
                  onChange={(e) => updateField("name", e.target.value)}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
              </Field>

              <Field label="Role">
                {initialData ? (
                  <Input value={role} disabled />
                ) : (
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
                                investmentOffers: 0,
                              }
                            : {
                                projects: 0,
                                proposalsPerMonth: 0,
                                investmentOffers:
                                  prev.limits.investmentOffers ?? 0,
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
                )}
              </Field>
            </div>

            <Field label="Description">
              <Textarea
                value={form.description}
                className={errors.description ? "border-red-500" : ""}
                onChange={(e) => updateField("description", e.target.value)}
              />
              {errors.description && (
                <p className="text-red-500 text-xs">{errors.description}</p>
              )}
            </Field>
          </Section>

          {/* BILLING */}
          <Section title="Billing">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Price">
                <Input
                  type="number"
                  className={errors.price ? "border-red-500" : ""}
                  value={form.billing.price}
                  onChange={(e) => {
                    const val = e.target.value;
                    const num = val === "" ? 0 : Math.max(0, Number(val));

                    updateField("billing", {
                      ...form.billing,
                      price: num,
                    });
                  }}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs">{errors.price}</p>
                )}
              </Field>

              <Field label="Duration (Days)">
                <Input
                  type="number"
                  className={errors.durationDays ? "border-red-500" : ""}
                  value={form.billing.durationDays}
                  onChange={(e) => {
                    const val = e.target.value;
                    const num = val === "" ? 0 : Math.max(0, Number(val));

                    updateField("billing", {
                      ...form.billing,
                      durationDays: num,
                    });
                  }}
                />
                {errors.durationDays && (
                  <p className="text-red-500 text-xs">{errors.durationDays}</p>
                )}
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
                  error={errors.projects}
                />

                <NumberInput
                  label="Proposals / Month"
                  value={form.limits.proposalsPerMonth}
                  onChange={(v) => updateLimits("proposalsPerMonth", v)}
                  error={errors.proposalsPerMonth}
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
                  label="Video Call Access"
                  value={form.permissions.canStartVideoCall}
                  onChange={(v) => updatePermissions("canStartVideoCall", v)}
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
                  error={errors.investmentOffers}
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
          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? "Processing..."
              : initialData
                ? "Update Plan"
                : "Create Plan"}
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
  error,
}: {
  label: string;
  value?: number;
  onChange: (v: number) => void;
  error?: string;
}) => (
  <Field label={label}>
    <Input
      type="number"
      className={error ? "border-red-500" : ""}
      min="0"
      value={value ?? ""}
      onChange={(e) => {
        const val = e.target.value;
        const num = val === "" ? 0 : Math.max(0, Number(val));
        onChange(num);
      }}
    />

    {/* ✅ ERROR INSIDE */}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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
