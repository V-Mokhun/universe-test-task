import { type CreateProjectBody } from "@/services";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  useCreateProject,
  useDeleteProject,
  useProjects,
  useRefreshProject,
} from "@/shared/hooks";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { Pagination } from "../../shared/components/pagination";
import { Input } from "../../shared/components/ui/input";
import {
  AddProjectDialog,
  EmptyState,
  NoSearchResults,
  ProjectsGrid,
} from "./components";

export const ProjectsPage = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const pageFromParams = Number(searchParams.get("page") || "1");
  const page =
    Number.isFinite(pageFromParams) && pageFromParams > 0 ? pageFromParams : 1;
  const pagination = useMemo(() => ({ page, limit: 10 }), [page]);

  const projectsQuery = useProjects({ ...pagination, search: debouncedSearch });
  const createProjectMutation = useCreateProject();
  const deleteProjectMutation = useDeleteProject();
  const refreshProjectMutation = useRefreshProject();

  const onSubmit = async (data: CreateProjectBody) => {
    setError(null);
    try {
      await createProjectMutation.mutateAsync({
        repositoryPath: data.repositoryPath,
      });
    } catch (err) {
      if (err instanceof Error && "status" in err && err.status === 404) {
        setError("Repository not found");
      } else if (
        err instanceof Error &&
        "status" in err &&
        err.status === 401
      ) {
        setError(
          "Authentication failed. Please try again or contact support if the issue persists."
        );
      } else {
        setError(err instanceof Error ? err.message : "Failed to add project");
      }
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setError(null);
    try {
      await deleteProjectMutation.mutateAsync(projectId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const handleRefreshProject = async (projectId: string) => {
    setError(null);
    try {
      await refreshProjectMutation.mutateAsync(projectId);
    } catch (err) {
      if (err instanceof Error && "status" in err && err.status === 401) {
        setError(
          "Authentication failed. Please try again or contact support if the issue persists."
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to refresh project"
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-1">Manage your GitHub repositories</p>
        </div>
        <AddProjectDialog
          onSubmit={onSubmit}
          isPending={createProjectMutation.isPending}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="relative">
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {projectsQuery.isSuccess && projectsQuery.data.projects.length > 0 ? (
        <>
          <ProjectsGrid
            projects={projectsQuery.data.projects}
            onDelete={handleDeleteProject}
            onRefresh={handleRefreshProject}
            isDeletePending={deleteProjectMutation.isPending}
            isRefreshPending={refreshProjectMutation.isPending}
          />
          {projectsQuery.data.total > 0 && (
            <Pagination
              currentPage={page}
              totalPages={Math.max(
                1,
                Math.ceil(projectsQuery.data.total / pagination.limit)
              )}
              disablePrevious={page <= 1 || projectsQuery.isFetching}
              disableNext={
                page >=
                  Math.ceil(projectsQuery.data.total / pagination.limit) ||
                projectsQuery.isFetching
              }
            />
          )}
        </>
      ) : projectsQuery.isSuccess &&
        projectsQuery.data.projects.length === 0 ? (
        debouncedSearch ? (
          <NoSearchResults
            searchTerm={debouncedSearch}
            onClearSearch={() => setSearch("")}
          />
        ) : (
          <EmptyState onAddProject={() => setIsDialogOpen(true)} />
        )
      ) : null}

      {projectsQuery.isPending && (
        <Card className="text-center py-12">
          <CardContent>Loading projects...</CardContent>
        </Card>
      )}
    </div>
  );
};
