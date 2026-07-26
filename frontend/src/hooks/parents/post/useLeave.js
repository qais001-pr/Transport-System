import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { QUERY_KEYS } from "../../queryKeys";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";

const useLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [QUERY_KEYS.PARENT.LEAVE_REQUEST],

    mutationFn: async (
      { childId, childIds, reason, leave_days, leave_date, isMultiple = false },
      { signal } = {},
    ) => {
      console.log(
        "Leave request payload:",
        childId,
        childIds,
        reason,
        leave_days,
      );
      const response = await apiClient.post(
        apiConstant.leaveRequest,
        { childId, childIds, reason, leave_days, leave_date, isMultiple },
        {
          signal,
        },
      );
      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries(QUERY_KEYS.PARENT.LEAVE_HISTORY);
      queryClient.invalidateQueries(QUERY_KEYS.PARENT.CHILDREN_FOR_LEAVE);
      //   toast.success(data?.message ?? "Leave request submitted successfully!");
    },

    onError: (error) => {
      if (error?.name !== "AbortError") {
        console.error("Leave request error:", error?.response?.data);
        const errorMessage =
          error?.response?.data?.errors?.[0]?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to submit leave request. Please try again.";
        toast.error(errorMessage);
      }
    },
  });
};

export default useLeave;
