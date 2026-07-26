import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { QUERY_KEYS } from "../../queryKeys";

const useMyRoutes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER.MY_ROUTES],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.myRoutes, { signal });
      return res.data;
    },
    keepPreviousData: true,
  });
};

export default useMyRoutes;
