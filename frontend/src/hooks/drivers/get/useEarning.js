import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { QUERY_KEYS } from "../../queryKeys";

const useEarning = (year) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER.EARNING, year],
    queryFn: async ({ signal }) => {
      const endpoint = year ? `${apiConstant.earning}?year=${year}` : apiConstant.earning;
      const res = await apiClient.get(endpoint, { signal });
      return res.data;
    },
    enabled: true,
    keepPreviousData: true,
  });
};

export default useEarning;
