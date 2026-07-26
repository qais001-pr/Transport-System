import apiClient from "../../../api/apiClient";
import { guardQueryKeys } from "../querykeys";
import apiConstant from "../../../api/apiConstant";
import { useQuery } from "@tanstack/react-query";

const usePendingStudents = () => {
  return useQuery({
    queryKey: guardQueryKeys.pendingStudents(),
    queryFn: async ({ signal }) => {
      const response = await apiClient.get(apiConstant.pendingStudents, {
        signal,
      });
      return response.data;
    },
    keepPreviousData: true,
  });
};

export default usePendingStudents;
