import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  projectsService,
  type GetProjectsOptions,
  type GetProjectsResponse,
} from "@/services";

export const GET_PROJECTS_QUERY_KEY = {
  all: ["projects"] as const,
  list: (options: GetProjectsOptions) =>
    [...GET_PROJECTS_QUERY_KEY.all, options] as const,
};

export const useProjects = (options: GetProjectsOptions) => {
  return useQuery<GetProjectsResponse, Error>({
    queryKey: GET_PROJECTS_QUERY_KEY.list(options),
    queryFn: async () => {
      const { data, error } = await projectsService.getProjects(options);
      if (error || !data) throw new Error(error || "Failed to load projects");
      return data;
    },
  });
};

export const usePrefetchProjects = () => {
  const queryClient = useQueryClient();
  return (options: GetProjectsOptions) =>
    queryClient.prefetchQuery({
      queryKey: GET_PROJECTS_QUERY_KEY.list(options),
      queryFn: async () => {
        const { data, error } = await projectsService.getProjects(options);
        if (error || !data) throw new Error(error || "Failed to load projects");
        return data;
      },
      staleTime: 30_000,
    });
};
