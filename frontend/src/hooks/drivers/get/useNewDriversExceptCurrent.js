import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { QUERY_KEYS } from "../../queryKeys";

const useNewDriversExceptCurrent = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER.NEW_DRIVERS],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.newDrivers, { signal });
      return res.data;
    },
    keepPreviousData: true,
  });
};

export default useNewDriversExceptCurrent;
