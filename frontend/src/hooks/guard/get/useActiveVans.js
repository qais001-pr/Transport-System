import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import { guardQueryKeys } from "../querykeys";
import apiConstant from "../../../api/apiConstant";

const useActiveVans = () => {
  return useQuery({
    queryKey: guardQueryKeys.activeVans(),
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.guard.activeVans, { signal });
      return res.data;
    },
    keepPreviousData: true,
  });
};

export default useActiveVans;
