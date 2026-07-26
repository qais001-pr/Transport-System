import { keepPreviousData, useQuery } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import { guardQueryKeys } from "../querykeys";
import apiConstant from "../../../api/apiConstant";

const useRecentVerifiedStudents = () => {
  return useQuery({
    queryKey: guardQueryKeys.recentVerifiedStudents(),
    queryFn: async ({ signal }) => {
      const response = await apiClient.get(apiConstant.guard.recentVerifiedStudents, {
        signal,
      });
      return response.data;
    },
    keepPreviousData: true,
  });
};

export default useRecentVerifiedStudents;
