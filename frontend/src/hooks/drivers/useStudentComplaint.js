import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";
import { toast } from "react-toastify";

const useStudentComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.DRIVER.STUDENT_COMPLAINT],
    mutationFn: async (payload) => {
      const res = await apiClient.post(apiConstant.studentComplaint, payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.DRIVER.STUDENT_COMPLAINT_HISTORY]);
      toast.success(data?.message || "Complaint submitted");
    },
    onError: (error) => {
      console.error("Complaint error:", error?.response?.data || error);
      toast.error(error?.response?.data?.message || error.message || "Failed to submit complaint");
    },
  });
};

export default useStudentComplaint;
