import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { schoolQueryKeys } from "../queryKeys";
import { toast } from "react-toastify";

const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: schoolQueryKeys.updateBranch(),
    mutationFn: async ({ branchId, branchData }) => {
      const response = await apiClient.put(
        `${apiConstant.school.updateSchoolBranch}/${branchId}`,
        branchData,
      );
      return response.data;
    },
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries(
        schoolQueryKeys.updateBranch(variables.branchId),
      );
      await queryClient.invalidateQueries({
        queryKey: schoolQueryKeys.branches(),
        refetchType: "active", // force refetch
      });
      toast.success(data?.message || "Branch updated successfully");
    },
    onError: (error) => {
      console.error("Error updating branch:", error);
      toast.error("Failed to update branch");
    },
  });
};

export default useUpdateBranch;
