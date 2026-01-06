import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  useInfiniteProjects,
  useLikeProject,
} from "../../hooks/Project/projectHooks";
import { ProjectPageCard } from "../../components/card/ProjectPageCard";
import type { ProjectsPage } from "../../types/projectType";
import { queryClient } from "../../main";
import toast from "react-hot-toast";
import { STAGES } from "../../types/StartupStages";
import { SECTOR } from "../../types/PreferredSector";
import { useDebounce } from "../../hooks/Debounce/useDebounce";
import { Search, X } from "lucide-react";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { useInView } from "react-intersection-observer";
import ProjectSkeleton from "../../components/Skelton/ProjectSkelton";
import type { InfiniteData } from "@tanstack/react-query";

const ProjectPage = () => {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<string | undefined>();
  const [sector, setSector] = useState<string | undefined>();
  const debouncedSearch = useDebounce(search, 500);
  const debouncedStage = useDebounce(stage, 300);
  const debouncedSector = useDebounce(sector, 300);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProjects(2, debouncedSearch, debouncedStage, debouncedSector);

  const projects =
    data?.pages.flatMap((page: ProjectsPage) => page.projects) ?? [];

  const { ref, inView } = useInView({
    rootMargin: "200px",
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const { mutate: likeProject } = useLikeProject();

  const handleProjectLike = (
    projectId: string,
    updateUI: (liked: boolean, count: number) => void
  ) => {
    likeProject(projectId, {
      onSuccess: (res) => {
        updateUI(res.data?.liked, res.data.likeCount);
        queryClient.setQueryData<InfiniteData<ProjectsPage>>(
          ["projects", 2, debouncedSearch, debouncedStage, debouncedSector],
          (old) => {
            if (!old) return old;

            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                projects: page.projects.map((p) =>
                  p._id === projectId
                    ? {
                        ...p,
                        liked: res.data.liked,
                        likeCount: res.data.likeCount,
                      }
                    : p
                ),
              })),
            };
          }
        );
      },
      onError: () => {
        toast.error("Failed to like project");
      },
    });
  };

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Discover Innovative Startup Ideas & Projects
      </h1>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full"
      >
        <div className="group relative mb-6 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* Decorative border accent */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative z-10 flex flex-col md:flex-row gap-3 md:items-center">
            {/* Search Input with Clear Button */}
            <div className="relative w-full md:flex-1 group/search">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 transition-colors group-focus-within/search:text-slate-600 dark:group-focus-within/search:text-slate-300" />
              <Input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-9 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-transparent transition-all duration-200"
              />
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors duration-150"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" />
                </motion.button>
              )}
            </div>

            {/* Stage Select - Doesn't filter immediately */}
            <Select
              value={stage ?? "all"}
              onValueChange={(value) => {
                setStage(value === "all" ? undefined : value);
              }}
            >
              <SelectTrigger className="w-full md:w-44 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 hover:border-slate-400 dark:hover:border-slate-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:border-transparent transition-all duration-200 data-[state=open]:ring-2 data-[state=open]:ring-blue-500">
                <div>
                  {/* <ChevronDown className="h-4 w-4 opacity-50 " /> */}
                  <SelectValue>{stage ?? "All Stages"}</SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                sideOffset={8}
                className="z-50 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg"
              >
                <SelectItem value="all">All Stages</SelectItem>
                {STAGES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sector Select - Doesn't filter immediately */}
            <Select
              value={sector ?? "all"}
              onValueChange={(value) => {
                setSector(value === "all" ? undefined : value);
              }}
            >
              <SelectTrigger className="w-full md:w-44 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 hover:border-slate-400 dark:hover:border-slate-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:border-transparent transition-all duration-200 data-[state=open]:ring-2 data-[state=open]:ring-blue-500">
                <SelectValue>{sector ?? "All Sectors"}</SelectValue>
                {/* <ChevronDown className="h-4 w-4  opacity-50" /> */}
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                sideOffset={8}
                className="z-50 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg"
              >
                <SelectItem value="all">All Sectors</SelectItem>
                {SECTOR.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Button */}
            {/* {hasFilters && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Button
                                    variant="outline"
                                    onClick={clearAllFilters}
                                    className="h-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-50 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200 whitespace-nowrap gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Clear
                                </Button>
                            </motion.div>
                        )} */}
          </div>
        </div>
      </motion.div>

      {/* Projects List */}
      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <ProjectSkeleton key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No projects found</div>
      ) : (
        <>
          <motion.div className="space-y-6">
            {projects.map((project) => (
              <ProjectPageCard
                key={project._id}
                id={project._id}
                name={project.startupName}
                description={project.shortDescription}
                stage={project.stage!}
                image={project.coverImageUrl || "/placeholder.svg"}
                likes={project.likeCount}
                liked={project.liked}
                onLike={(updateUI) => handleProjectLike(project._id, updateUI)}
              />
            ))}
          </motion.div>

          {/* Infinite Loader */}
          <div ref={ref} className="mt-8 space-y-6">
            {isFetchingNextPage && (
              <>
                <ProjectSkeleton />
                <ProjectSkeleton />
              </>
            )}

            {!hasNextPage && (
              <p className="text-center text-sm text-gray-400">
                You’ve reached the end 🚀
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectPage;
