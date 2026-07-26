import { keepPreviousData, useQuery } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import { guardQueryKeys } from "../querykeys";
import apiConstant from "../../../api/apiConstant";

const useAllStudents = () => {
  return useQuery({
    queryKey: guardQueryKeys.allStudents(),
    queryFn: async ({ signal }) => {
      const response = await apiClient.get(apiConstant.guard.allStudents, {
        signal,
      });
      return response.data;
    },
    keepPreviousData: true,
  });
};

export default useAllStudents;
