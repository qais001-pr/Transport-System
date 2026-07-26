import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { schoolQueryKeys } from "../queryKeys";
import { toast } from "react-toastify";

const useUpdateComplaintStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: schoolQueryKeys.complaintResponses(),
    mutationFn: async ({ complaintId, status }) => {
      const response = await apiClient.put(
        `${apiConstant.school.verifyComplaint}/${complaintId}`,
        {
          status,
        },
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(
        schoolQueryKeys.complaintResponses(variables.complaintId),
      );
      queryClient.invalidateQueries({
        queryKey: schoolQueryKeys.complaints(),
      });
      toast.success(data?.message || "Complaint status updated successfully");
    },
    onError: (error) => {
      console.error("Error updating complaint status:", error);
      toast.error("Failed to update complaint status");
    },
  });
};

export default useUpdateComplaintStatus;
