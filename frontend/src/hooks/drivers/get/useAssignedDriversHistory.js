import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { QUERY_KEYS } from "../../queryKeys";

const useAssignedDriversHistory = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER.ASSIGNED_DRIVERS],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.assignedDrivers, { signal });
      return res.data;
    },
    keepPreviousData: true,
  });
};

export default useAssignedDriversHistory;
