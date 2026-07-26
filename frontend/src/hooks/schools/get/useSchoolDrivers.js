import { useQuery } from "@tanstack/react-query";
import { schoolQueryKeys } from "../queryKeys";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
const useSchoolDrivers = () => {
  return useQuery({
    queryKey: schoolQueryKeys.drivers(),
    queryFn: async ({ signal }) => {
      const response = await apiClient.get(apiConstant.school.allDrivers, { signal });
      return response.data;
    },
    keepPreviousData: true,
  });
};

export default useSchoolDrivers;
