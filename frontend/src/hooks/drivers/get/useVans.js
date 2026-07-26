import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { QUERY_KEYS } from "../../queryKeys";

const useVans = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER.VANS],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.vanDetails, { signal });
      return res.data;
    },
    keepPreviousData: true,
  });
};

export default useVans;
