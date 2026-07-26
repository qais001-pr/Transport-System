import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { policeQueryKeys } from "../queryKeys";

const useDriverApplications = () => {
  return useQuery({
    queryKey: policeQueryKeys.driverApplications(),
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.police.driverApplications, {
        signal,
      });
      return res.data;
    },
    keepPreviousData: true,
  });
};

export default useDriverApplications;
