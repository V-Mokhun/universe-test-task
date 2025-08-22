import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsService, type RefreshProjectResponse } from "@/services";
import { GET_PROJECTS_QUERY_KEY } from "./use-projects";

export const useRefreshProject = () => {
  const queryClient = useQueryClient();

  return useMutation<RefreshProjectResponse, Error, string>({
    mutationFn: async (projectId: string) => {
      const { data, error } = await projectsService.refreshProject(projectId);
      if (!data || error) throw new Error(error || "Failed to refresh project");
      return data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: GET_PROJECTS_QUERY_KEY.all,
      });
    },
  });
};
