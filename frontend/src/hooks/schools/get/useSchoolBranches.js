import { useQuery } from "@tanstack/react-query";
import { schoolQueryKeys } from "../queryKeys";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";

const useSchoolBranches = () => {
  return useQuery({
    queryKey: schoolQueryKeys.branches(),
    queryFn: async ({ signal }) => {
      const response = await apiClient.get(apiConstant.school.schoolData, {
        signal,
      });
      return response.data;
    },
    keepPreviousData: true,
  });
};

export default useSchoolBranches;
