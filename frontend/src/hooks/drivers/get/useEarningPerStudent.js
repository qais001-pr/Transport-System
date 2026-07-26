import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { QUERY_KEYS } from "../../queryKeys";

const useEarningPerStudent = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER.EARNING],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.earningPerStudents, {
        signal,
      });
      return res.data;
    },
    keepPreviousData: true,
  });
};

export default useEarningPerStudent;
