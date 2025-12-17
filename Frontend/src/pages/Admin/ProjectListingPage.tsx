import { useState, useMemo, useCallback } from "react"
import Table from "../../components/table/Table"
import Pagination from "../../components/pagination/Pagination"
import StatusChangeModal from "../../components/modals/StatusChangeModal"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { X } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import {
    useGetAllProjects,
    useUpdateProjectStatus,
} from "../../hooks/Admin/ProjectHooks"
import type { ProjectType } from "../../types/projectType"

interface TableProject extends ProjectType {
    id: string
}

interface AdminProjectsResponse {
    data: {
        data: {
            projects: ProjectType[]
            totalPages: number
            currentPage: number
        }
    }
}

const ProjectsListing = () => {
    const [page, setPage] = useState(1)
    const [limit] = useState(5)
    const [statusFilter, setStatusFilter] = useState("")
    const [searchInput, setSearchInput] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [modalOpen, setModalOpen] = useState(false)

    const [selectedProject, setSelectedProject] = useState<{
        id: string
        name: string
        isActive: boolean
    } | null>(null)

    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { data, refetch } = useGetAllProjects(
        page,
        limit,
        statusFilter,
        debouncedSearch
    )

    const { mutate: updateStatus, isPending } = useUpdateProjectStatus()

    const projects = useMemo(
        () => data?.data?.data?.projects ?? [],
        [data]
    )

    const totalPages = useMemo(
        () => data?.data?.data?.totalPages ?? 1,
        [data]
    )

    const tableData: TableProject[] = useMemo(
        () => projects.map(p => ({ ...p, id: p._id })),
        [projects]
    )

    /* -------------------- Search handlers -------------------- */
    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchInput(e.target.value)
        },
        []
    )

    const handleSearchClick = useCallback(() => {
        setDebouncedSearch(searchInput.trim())
        setPage(1)
    }, [searchInput])

    const handleClearSearch = useCallback(() => {
        setSearchInput("")
        setDebouncedSearch("")
        setPage(1)
        refetch()
    }, [refetch])

    const handleStatusFilterChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setStatusFilter(e.target.value)
            setPage(1)
        },
        []
    )

    /* -------------------- Status toggle -------------------- */
    const handleStatusToggle = useCallback(() => {
        if (!selectedProject) return

        updateStatus(
            {
                projectId: selectedProject.id,
                currentStatus: selectedProject.isActive ? "ACTIVE" : "BLOCKED",
            },
            {
                onSuccess: () => {
                    const newIsActive = !selectedProject.isActive
                    toast.success(
                        `Project ${newIsActive ? "ACTIVE" : "BLOCKED"} successfully`
                    )

                    queryClient.setQueryData<AdminProjectsResponse>(
                        ["admin-projects", page, limit, statusFilter, debouncedSearch],
                        old => {
                            if (!old) return old

                            const copy = structuredClone(old)
                            copy.data.data.projects = copy.data.data.projects.map(p =>
                                p._id === selectedProject.id
                                    ? { ...p, isActive: newIsActive }
                                    : p
                            )
                            return copy
                        }
                    )
                },
            }
        )

        setModalOpen(false)
    }, [
        selectedProject,
        updateStatus,
        queryClient,
        page,
        limit,
        statusFilter,
        debouncedSearch,
    ])

    /* -------------------- Table headers -------------------- */
    const headers = useMemo(
        () => [
            {
                id: "index",
                label: "#",
                render: (row: TableProject) =>
                    String(
                        (page - 1) * limit +
                        tableData.findIndex(p => p._id === row._id) +
                        1
                    ),
            },
            {
                id: "name",
                label: "Project",
                render: (row: TableProject) => row.startupName,
            },
            // {
            //     id: "founder",
            //     label: "Founder",
            //     render: (row: TableProject) => row.user?.userName ?? "N/A",
            // },
            {
                id: "stage",
                label: "Stage",
                render: (row: TableProject) => row.stage,
            },
            {
                id: "status",
                label: "Status",
                render: (row: TableProject) => (
                    <button
                        disabled={isPending}
                        onClick={() => {
                            setSelectedProject({
                                id: row._id,
                                name: row.startupName,
                                isActive: row.isActive!,
                            })
                            setModalOpen(true)
                        }}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold ${row.isActive
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                    >
                        {row.isActive ? "ACTIVE" : "BLOCKED"}
                    </button>
                ),
            },
            {
                id: "view",
                label: "View",
                render: (row: TableProject) => (
                    <button
                        onClick={() => navigate(`/admin/projects/${row._id}`)}
                        className="px-5 py-1.5 bg-blue-500 text-white text-xs rounded-full"
                    >
                        View
                    </button>
                ),
            },
        ],
        [page, limit, tableData, isPending, navigate]
    )

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">
                Projects Management
            </h1>

            {/* Search + Filter */}
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
                <div className="flex gap-2 w-full md:w-1/3 relative">
                    <input
                        type="text"
                        placeholder="Search by project name"
                        value={searchInput}
                        onChange={handleSearchChange}
                        onKeyDown={e => e.key === "Enter" && handleSearchClick()}
                        className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-400"
                    />

                    {searchInput && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute right-20 top-2.5 text-gray-500 hover:text-red-500"
                        >
                            <X size={18} />
                        </button>
                    )}

                    <button
                        onClick={handleSearchClick}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Search
                    </button>
                </div>

                <select
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                >
                    <option value="">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="BLOCKED">Blocked</option>
                </select>
            </div>

            <Table<TableProject> headers={headers} data={tableData} />

            {tableData.length > 0 && (
                <Pagination
                    totalPages={totalPages}
                    currentPage={page}
                    setPage={setPage}
                />
            )}

            {selectedProject && (
                <StatusChangeModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    name={selectedProject.name}
                    currentStatus={selectedProject.isActive ? "ACTIVE" : "BLOCKED"}
                    onConfirm={handleStatusToggle}
                />
            )}
        </div>
    )
}

export default ProjectsListing
