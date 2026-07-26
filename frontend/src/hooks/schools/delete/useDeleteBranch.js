import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { schoolQueryKeys } from "../queryKeys";
import { toast } from "react-toastify";

const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: schoolQueryKeys.deleteBranch(),
    mutationFn: async ({ branchId }) => {
      const response = await apiClient.delete(
        `${apiConstant.school.deleteSchoolBranch}/${branchId}`,
      );
      return response.data;
    },
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries(
        schoolQueryKeys.deleteBranch(variables.branchId),
      );
      await queryClient.invalidateQueries({
        queryKey: schoolQueryKeys.branches(),
        refetchType: "active", // force refetch
      });
      toast.success(data?.message || "Branch deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting branch:", error);
      toast.error("Failed to delete branch");
    },
  });
};

export default useDeleteBranch;
