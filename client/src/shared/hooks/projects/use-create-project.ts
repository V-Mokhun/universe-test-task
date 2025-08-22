import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  projectsService,
  type CreateProjectBody,
  type CreateProjectResponse,
} from "@/services";
import { GET_PROJECTS_QUERY_KEY } from "./use-projects";

interface ApiError extends Error {
  status?: number;
}

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateProjectResponse, Error, CreateProjectBody>({
    mutationFn: async (payload) => {
      const { data, error, status } = await projectsService.createProject(
        payload
      );
      if (!data || error) {
        const err = new Error(error || `Failed to create project`) as ApiError;
        err.status = status;
        throw err;
      }
      return data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: GET_PROJECTS_QUERY_KEY.all,
      });
    },
  });
};
