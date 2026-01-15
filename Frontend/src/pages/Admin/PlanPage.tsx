import { useMemo, useState } from "react";
import { Plus, Edit, ToggleLeft, ToggleRight } from "lucide-react";
import Table from "../../components/table/Table";
import Pagination from "../../components/pagination/Pagination";
import { Button } from "../../components/ui/button";
import StatusChangeModal from "../../components/modals/StatusChangeModal";
import toast from "react-hot-toast";
import type { Plan } from "../../types/planType";
import type { PlanStatus } from "../../types/planStatus";
import {
  useGetAllPlans,
  useUpdatePlanStatus,
} from "../../hooks/Admin/PlanHooks";
import PlanFormModal from "../../components/modals/PlanFormModal";
import { planStatusToModalStatus } from "../../types/statusAdapter";

interface TablePlan extends Plan {
  id: string;
}

const AdminPlansPage = () => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const [statusFilter, setStatusFilter] = useState<PlanStatus | "">("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const { data } = useGetAllPlans({
    page,
    limit,
    status: statusFilter || undefined,
  });

  const { mutate: updateStatus, isPending } = useUpdatePlanStatus();

  const plans = useMemo(() => data?.plans ?? [], [data]);
  const totalPages = Math.ceil((data?.total ?? 0) / limit);

  const tableData: TablePlan[] = useMemo(
    () => plans.map((p) => ({ ...p, id: p._id })),
    [plans]
  );

  /* ---------------- Status Toggle ---------------- */
  const handleStatusToggle = () => {
    if (!selectedPlan) return;

    updateStatus(
      {
        planId: selectedPlan._id,
        status: selectedPlan.status === "Active" ? "Inactive" : "Active",
      },
      {
        onSuccess: () => {
          toast.success("Plan status updated");
          setStatusModalOpen(false);
        },
      }
    );
  };

  /* ---------------- Table Headers ---------------- */
  const headers = [
    {
      id: "name",
      label: "Plan Name",
      render: (row: TablePlan) => (
        <div>
          <p className="font-semibold text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.role}</p>
        </div>
      ),
    },
    {
      id: "price",
      label: "Price",
      render: (row: TablePlan) => (
        <span className="font-medium">
          ₹{row.billing.price} / {row.billing.durationDays} days
        </span>
      ),
    },
    {
      id: "limits",
      label: "Limits",
      render: (row: TablePlan) => (
        <div className="text-xs text-gray-600 space-y-1">
          <p>Messages: {row.limits.messages}</p>
          <p>Consent Letters: {row.limits.consentLetters}</p>
          <p>Boost: {row.limits.profileBoost}</p>
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
          className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2
          ${
            row.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status === "Active" ? (
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

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Plan Management
        </h1>

        <Button onClick={() => setFormOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Plan
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as PlanStatus | "");
            setPage(1);
          }}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <Table<TablePlan>
        headers={headers}
        data={tableData}
        primaryField="name"
      />

      {tableData.length > 0 && (
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          setPage={setPage}
        />
      )}

      {/* Modals */}
      <PlanFormModal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingPlan(null);
        }}
        plan={editingPlan}
      />

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
