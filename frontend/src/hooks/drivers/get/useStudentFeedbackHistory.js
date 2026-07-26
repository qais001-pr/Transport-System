import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { QUERY_KEYS } from "../../queryKeys";

const useStudentFeedbackHistory = (studentId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DRIVER.STUDENT_FEEDBACK_HISTORY, studentId],
    queryFn: async ({ signal }) => {
      const endpoint = studentId ? `${apiConstant.studentFeedbackHistory}/${studentId}` : apiConstant.studentFeedbackHistory;
      const res = await apiClient.get(endpoint, { signal });
      return res.data;
    },
    enabled: !!studentId,
  });
};

export default useStudentFeedbackHistory;
