import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { QUERY_KEYS } from "../../queryKeys";

const useRouteDetail = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER.ROUTE_DETAIL],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.routeDetail, { signal });
      return res.data;
    },
    keepPreviousData: true,
  });
};

export default useRouteDetail;
