import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";
import { toast } from "react-toastify";
import { userQueryKeys } from "../queryKeys";

const useEditProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: userQueryKeys.profile(),
    mutationFn: async (formData, { signal }) => {
      const response = await apiClient.put(
        apiConstant.user.editProfile,
        formData,
        {
          signal,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(userQueryKeys.profile());
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.editProfile(variables.id),
      });
      toast.success(data?.message || "Profile updated successfully");
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    },
  });
};

export default useEditProfile;
