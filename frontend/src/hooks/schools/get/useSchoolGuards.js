import { useQuery } from "@tanstack/react-query";
import { schoolQueryKeys } from "../queryKeys";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";

const useSchoolGuards = () => {
  return useQuery({
    queryKey: schoolQueryKeys.guards(),
    queryFn: async ({ signal }) => {
      const response = await apiClient.get(apiConstant.school.schoolGuards, {
        signal,
      });
      return response.data;
    },
    keepPreviousData: true,
  });
};

export default useSchoolGuards;
