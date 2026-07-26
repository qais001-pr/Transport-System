import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { QUERY_KEYS } from "../../queryKeys";

const useAllStudents = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER.ALL_STUDENTS],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.allStudents, { signal });
      return res.data;
    },
    keepPreviousData: true,
  });
};

export default useAllStudents;
