import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { QUERY_KEYS } from "../../queryKeys";

const useDelayReports = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER.REPORTS],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.delayReports, { signal });
      return res.data;
    },
    keepPreviousData: true,
  });
};

export default useDelayReports;
