import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { schoolQueryKeys } from "../queryKeys";
import { toast } from "react-toastify";

const useApproveGuard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: schoolQueryKeys.approveGuard(),
    mutationFn: async ({ guardId, status }) => {
      const response = await apiClient.put(
        `${apiConstant.school.approveGuard}/${guardId}`,
        {
          status,
        },
      );
      return response.data;
    },
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries(
        schoolQueryKeys.approveGuard(variables.guardId),
      );
      await queryClient.invalidateQueries({
        queryKey: schoolQueryKeys.guards(),
        refetchType: "active", // force refetch
      });
      toast.success(data?.message || "Guard status updated successfully");
    },
    onError: (error) => {
      console.error("Error updating guard status:", error);
      toast.error("Failed to update guard status");
    },
  });
};

export default useApproveGuard;
