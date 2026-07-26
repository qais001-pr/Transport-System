import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { QUERY_KEYS } from "../../queryKeys";

const useLatestEarning = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER.EARNING],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.latestEarnings, {
        signal,
      });
      return res.data;
    },
    keepPreviousData: true,
  });
};

export default useLatestEarning;
