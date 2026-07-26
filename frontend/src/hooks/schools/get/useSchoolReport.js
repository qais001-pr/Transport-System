import { useQuery } from "@tanstack/react-query";
import { schoolQueryKeys } from "../queryKeys";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
const useSchoolReport = () => {
  return useQuery({
    queryKey: schoolQueryKeys.reports(),
    queryFn: async ({ signal }) => {
      const response = await apiClient.get(apiConstant.school.driverReports, {
        signal,
      });
      return response.data;
    },
    keepPreviousData: true,
  });
};

export default useSchoolReport;
