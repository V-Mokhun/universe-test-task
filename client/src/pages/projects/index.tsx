import { createProjectSchema, type CreateProjectBody } from "@/services";
import {
  useCreateProject,
  useDeleteProject,
  useProjects,
  useRefreshProject,
} from "@/shared/hooks";
import { formatNumber, formatUnixDate } from "@/shared/lib";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Calendar,
  ExternalLink,
  GitFork,
  Plus,
  RefreshCw,
  Star,
  Trash2,
} from "lucide-react";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { ProjectsPagination } from "../../shared/components/pagination";
import { Button } from "../../shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../shared/components/ui/form";
import { Input } from "../../shared/components/ui/input";

import { useSearchParams } from "react-router-dom";

export const ProjectsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const pageFromParams = Number(searchParams.get("page") || "1");
  const page =
    Number.isFinite(pageFromParams) && pageFromParams > 0 ? pageFromParams : 1;
  const pagination = useMemo(() => ({ page, limit: 10 }), [page]);

  const form = useForm<CreateProjectBody>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      repositoryPath: "",
    },
  });

  const projectsQuery = useProjects({ ...pagination });
  const createProjectMutation = useCreateProject();
  const deleteProjectMutation = useDeleteProject();
  const refreshProjectMutation = useRefreshProject();

  const onSubmit = async (data: CreateProjectBody) => {
    setError(null);
    try {
      await createProjectMutation.mutateAsync({
        repositoryPath: data.repositoryPath,
      });
      form.reset();
      setIsDialogOpen(false);
    } catch (err) {
      if (err instanceof Error && "status" in err && err.status === 404) {
        form.setError("repositoryPath", {
          type: "server",
          message: "Repository not found",
        });
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
      setError(
        err instanceof Error ? err.message : "Failed to refresh project"
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-1">Manage your GitHub repositories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                Enter the GitHub repository path to add it to your projects.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="repositoryPath"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repository Path</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., facebook/react" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createProjectMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    {createProjectMutation.isPending ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Add Project
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsQuery.data?.projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                    {project.owner}/{project.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 shrink-0 text-gray-400" />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">
                        Created {formatUnixDate(project.repoCreatedAt)}
                      </span>
                      <span className="text-xs text-gray-500">
                        (Unix timestamp: {project.repoCreatedAt})
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRefreshProject(project.id)}
                    disabled={refreshProjectMutation.isPending}
                    className="h-8 w-8 p-0"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProject(project.id)}
                    disabled={deleteProjectMutation.isPending}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-yellow-600">
                    <Star className="w-4 h-4" />
                    <span className="font-semibold">
                      {formatNumber(project.stars)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Stars</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-600">
                    <GitFork className="w-4 h-4" />
                    <span className="font-semibold">
                      {formatNumber(project.forks)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Forks</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-semibold">
                      {formatNumber(project.openIssues)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Issues</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(project.url, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on GitHub
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projectsQuery.data && (
        <ProjectsPagination
          currentPage={page}
          totalPages={Math.max(
            1,
            Math.ceil(projectsQuery.data.total / pagination.limit)
          )}
          disablePrevious={page <= 1 || projectsQuery.isFetching}
          disableNext={
            page >= Math.ceil(projectsQuery.data.total / pagination.limit) ||
            projectsQuery.isFetching
          }
        />
      )}

      {/* Empty State */}
      {projectsQuery.isSuccess && projectsQuery.data.projects.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-500 mb-4">
              Start by adding your first GitHub repository to track its metrics.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
      {projectsQuery.isPending && (
        <Card className="text-center py-12">
          <CardContent>Loading projects...</CardContent>
        </Card>
      )}
    </div>
  );
};
