import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";
import { toast } from "react-toastify";

const useStudentFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.DRIVER.STUDENT_FEEDBACK],
    mutationFn: async (payload) => {
      const res = await apiClient.post(apiConstant.studentFeedback, payload);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries([
        QUERY_KEYS.DRIVER.STUDENT_FEEDBACK_HISTORY,
        variables.child_id,
      ]);
      toast.success(data?.message || "Feedback submitted");
    },
    onError: (error) => {
      console.error("Feedback error:", error?.response?.data || error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to submit feedback",
      );
    },
  });
};

export default useStudentFeedback;
