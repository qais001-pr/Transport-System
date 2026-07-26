import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../queryKeys";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";

const useChildDetail = ({ childId }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PARENT.CHILD_DETAIL, childId],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(`${apiConstant.children}/${childId}`, {
        signal,
        params: { childId },
      });
      return res.data;
    },
  });
};

export default useChildDetail;
