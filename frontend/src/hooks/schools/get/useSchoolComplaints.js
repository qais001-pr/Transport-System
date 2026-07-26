import { useQuery } from "@tanstack/react-query";
import { schoolQueryKeys } from "../queryKeys";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
const useSchoolComplaints = () => {
  return useQuery({
    queryKey: schoolQueryKeys.complaints(),
    queryFn: async ({ signal }) => {
      const response = await apiClient.get(apiConstant.school.complaints, {
        signal,
      });
      return response.data;
    },
    keepPreviousData: true,
  });
};

export default useSchoolComplaints;
