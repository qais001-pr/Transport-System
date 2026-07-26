import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { policeQueryKeys } from "../queryKeys";

const useReport = () => {
  return useQuery({
    queryKey: policeQueryKeys.reports(),
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.police.report, {
        signal,
      });
      return res.data;
    },
    keepPreviousData: true,
  });
};

export default useReport;
