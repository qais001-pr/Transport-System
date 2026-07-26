import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { schoolQueryKeys } from "../queryKeys";
import { toast } from "react-toastify";

const useAddSchoolBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: schoolQueryKeys.addBranch(),
    mutationFn: async (branchData, { signal }) => {
      const response = await apiClient.post(
        apiConstant.school.addSchoolBranch,
        branchData,
        { signal },
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(schoolQueryKeys.branches());
      toast.success(data?.message || "School branch added successfully");
    },
    onError: (error) => {
      console.error("Error adding school branch:", error);
      toast.error("Failed to add school branch");
    },
  });
};

export default useAddSchoolBranch;
