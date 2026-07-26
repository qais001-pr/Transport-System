import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { QUERY_KEYS } from "../../queryKeys";

const useStudentComplaintHistory = (studentId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER.STUDENT_COMPLAINT_HISTORY, studentId],
    queryFn: async ({ signal }) => {
      const endpoint = studentId ? `${apiConstant.studentComplaintHistory}/${studentId}` : apiConstant.studentComplaintHistory;
      const res = await apiClient.get(endpoint, { signal });
      return res.data;
    },
    enabled: !!studentId,
  });
};

export default useStudentComplaintHistory;
