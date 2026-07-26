import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { QUERY_KEYS } from "../../queryKeys";

const useStudentDetail = (studentId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER.STUDENT_DETAIL, studentId],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(`${apiConstant.studentDetail}/${studentId}`, { signal });
      return res.data;
    },
    enabled: !!studentId,
  });
};

export default useStudentDetail;
