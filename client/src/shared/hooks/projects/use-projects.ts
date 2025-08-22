import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  projectsService,
  type GetProjectsOptions,
  type GetProjectsResponse,
} from "@/services";

export const GET_PROJECTS_QUERY_KEY = {
  all: ["projects"] as const,
  list: (page: number, limit: number) =>
    [...GET_PROJECTS_QUERY_KEY.all, { page, limit }] as const,
};

export const useProjects = ({ page, limit }: GetProjectsOptions) => {
  return useQuery<GetProjectsResponse, Error>({
    queryKey: GET_PROJECTS_QUERY_KEY.list(page, limit),
    queryFn: async () => {
      const { data, error } = await projectsService.getProjects({
        page,
        limit,
      });
      if (error || !data) throw new Error(error || "Failed to load projects");
      return data;
    },
  });
};

export const usePrefetchProjects = () => {
  const queryClient = useQueryClient();
  return (page: number, limit: number) =>
    queryClient.prefetchQuery({
      queryKey: GET_PROJECTS_QUERY_KEY.list(page, limit),
      queryFn: async () => {
        const { data, error } = await projectsService.getProjects({
          page,
          limit,
        });
        if (error || !data) throw new Error(error || "Failed to load projects");
        return data;
      },
      staleTime: 30_000,
    });
};
