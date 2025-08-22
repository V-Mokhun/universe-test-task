import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsService } from "@/services";
import { GET_PROJECTS_QUERY_KEY } from "./use-projects";

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (projectId: string) => {
      const { success, error } = await projectsService.deleteProject(projectId);
      if (!success) throw new Error(error || "Failed to delete project");
      return { success: true };
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: GET_PROJECTS_QUERY_KEY.all,
      });
    },
  });
};
