import { useMemo, useState } from "react";
import { Plus, Edit, ToggleLeft, ToggleRight, Search } from "lucide-react";
import Table from "../../components/table/Table";
import Pagination from "../../components/pagination/Pagination";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import StatusChangeModal from "../../components/modals/StatusChangeModal";
import toast from "react-hot-toast";

import type {
  CreatePlanPayload,
  PaginatedPlansExplaination,
  Plan,
} from "../../types/planType";
import type { PlanStatus } from "../../types/planStatus";

import {
  useGetAllPlans,
  useUpdatePlanStatus,
  useCreatePlan,
  useUpdatePlan,
} from "../../hooks/Admin/PlanHooks";

import { PlanFormModal } from "../../components/modals/PlanFormModal";
import { planStatusToModalStatus } from "../../types/statusAdapter";
import type { CreatePlanFormData } from "../../components/modals/PlanFormModal";
import { QUERY_KEYS } from "../../constants/queryKey";
import { queryClient } from "../../main";
import { useDebounce } from "../../hooks/Debounce/useDebounce";

/* ================= TYPES ================= */

interface TablePlan extends Plan {
  id: string;
}

/* ================= COMPONENT ================= */

const AdminPlansPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 5;
  const [statusFilter, setStatusFilter] = useState<PlanStatus | "">("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  /* ---------------- API Hooks ---------------- */

  const { data } = useGetAllPlans({
    page,
    limit,
    status: statusFilter || undefined,
    search: debouncedSearchTerm || undefined,
  });

  const { mutateAsync: updateStatus, isPending } = useUpdatePlanStatus();
  const { mutate: createPlan } = useCreatePlan();
  const { mutateAsync: updatePlan } = useUpdatePlan();

  /* ---------------- Derived Data ---------------- */

  const plans = useMemo(() => data?.plans ?? [], [data]);
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const tableData: TablePlan[] = useMemo(
    () => plans.map((p) => ({ ...p, id: p._id })),
    [plans],
  );

  /* ---------------- Handlers ---------------- */

  const handleStatusToggle = async () => {
    if (!selectedPlan) return;

    const newStatus: PlanStatus =
      selectedPlan.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      const updatedPlan = await updateStatus({
        planId: selectedPlan._id,
        status: newStatus,
      });

      queryClient.setQueryData<PaginatedPlansExplaination>(
        [
          QUERY_KEYS.ADMIN_PLANS,
          { page, limit, status: statusFilter || undefined },
        ],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            plans: oldData.plans.map((plan) =>
              plan._id === updatedPlan._id ? updatedPlan : plan,
            ),
          };
        },
      );

      toast.success("Plan status updated");
      setStatusModalOpen(false);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const mapFormToPayload = (form: CreatePlanFormData): CreatePlanPayload => ({
    ...form,
    limits: {
      projects: form.limits.projects ?? 0,
      proposalsPerMonth: form.limits.proposalsPerMonth ?? 0,
      meetingRequests: form.limits.meetingRequests ?? 0,
      investmentOffers: form.limits.investmentOffers ?? 0,
      activeInvestments: form.limits.activeInvestments ?? 0,
    },
  });

  const handleCreatePlan = async (data: CreatePlanFormData): Promise<void> => {
    return new Promise((resolve, reject) => {
      createPlan(mapFormToPayload(data), {
        onSuccess: (newPlan) => {
          toast.success("Plan created successfully");

          queryClient.setQueryData<PaginatedPlansExplaination>(
            [
              QUERY_KEYS.ADMIN_PLANS,
              { page, limit, status: statusFilter || undefined },
            ],
            (oldData) => {
              if (!oldData) return oldData;

              return {
                ...oldData,
                plans: [newPlan, ...oldData.plans],
                total: oldData.total + 1,
              };
            },
          );

          resolve();
          setFormOpen(false);
        },
        onError: () => {
          toast.error("Failed to create plan");
          reject();
        },
      });
    });
  };

  const handleUpdatePlan = async (data: CreatePlanFormData): Promise<void> => {
    if (!editingPlan) {
      return Promise.resolve();
    }

    try {
      const updatedPlan = await updatePlan({
        planId: editingPlan._id,
        payload: mapFormToPayload(data),
      });

      queryClient.setQueryData<PaginatedPlansExplaination>(
        [
          QUERY_KEYS.ADMIN_PLANS,
          { page, limit, status: statusFilter || undefined },
        ],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            plans: oldData.plans.map((plan) =>
              plan._id === updatedPlan._id ? updatedPlan : plan,
            ),
          };
        },
      );

      toast.success("Plan updated successfully");

      setFormOpen(false);
      setEditingPlan(null);
    } catch {
      toast.error("Failed to update plan");
      throw new Error("Update failed"); // IMPORTANT
    }
  };

  const mapPlanToFormData = (plan: Plan): CreatePlanFormData => ({
    name: plan.name,
    role: plan.role,
    description: plan.description,
    limits: plan.limits,
    permissions: plan.permissions,
    billing: plan.billing,
  });

  /* ---------------- Table Headers ---------------- */

  const headers = [
    {
      id: "name",
      label: "Plan Name",
      render: (row: TablePlan) => (
        <div>
          <p className="font-semibold">{row.name}</p>
          <p className="text-xs text-gray-500">{row.role}</p>
        </div>
      ),
    },
    {
      id: "price",
      label: "Price",
      render: (row: TablePlan) => (
        <span>
          ₹{row.billing.price} / {row.billing.durationDays} days
        </span>
      ),
    },
    {
      id: "limits",
      label: "Limits",
      render: (row: TablePlan) => (
        <div className="text-xs space-y-1">
          {row.role === "USER" && (
            <>
              <p>Projects: {row.limits.projects}</p>
              <p>Proposals: {row.limits.proposalsPerMonth}</p>
              <p>Meetings: {row.limits.meetingRequests}</p>
            </>
          )}

          {row.role === "INVESTOR" && (
            <>
              <p>Offers: {row.limits.investmentOffers}</p>
              <p>Active Investments: {row.limits.activeInvestments}</p>
            </>
          )}
        </div>
      ),
    },
    {
      id: "status",
      label: "Status",
      render: (row: TablePlan) => (
        <button
          disabled={isPending}
          onClick={() => {
            setSelectedPlan(row);
            setStatusModalOpen(true);
          }}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 ${
            row.status === "ACTIVE"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status === "ACTIVE" ? (
            <ToggleRight size={16} />
          ) : (
            <ToggleLeft size={16} />
          )}
          {row.status}
        </button>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      render: (row: TablePlan) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEditingPlan(row);
            setFormOpen(true);
          }}
        >
          <Edit size={14} className="mr-2" />
          Edit
        </Button>
      ),
    },
  ];

  /* ---------------- JSX ---------------- */

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Plan Management</h1>
        <Button
          onClick={() => {
            setEditingPlan(null);
            setFormOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Plus size={16} className="mr-2" /> Add Plan
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by plan name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-10 border-gray-300"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as PlanStatus | "");
            setPage(1);
          }}
          className="w-full sm:w-40 px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      <Table headers={headers} data={tableData} primaryField="name" />

      {total > 0 && (
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          setPage={setPage}
        />
      )}

      {/* CREATE & EDIT PLAN MODAL */}
      <PlanFormModal
        key={editingPlan?._id ?? "create"}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingPlan(null);
        }}
        initialData={editingPlan ? mapPlanToFormData(editingPlan) : undefined}
        onSubmit={editingPlan ? handleUpdatePlan : handleCreatePlan}
      />

      {/* STATUS MODAL */}
      {selectedPlan && (
        <StatusChangeModal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          name={selectedPlan.name}
          currentStatus={planStatusToModalStatus(selectedPlan.status)}
          onConfirm={handleStatusToggle}
        />
      )}
    </div>
  );
};

export default AdminPlansPage;
