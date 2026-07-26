import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";

const useGiveComplaint = () => {
  return useMutation({
    mutationKey: [QUERY_KEYS.PARENT.GIVE_COMPLAINT],

    mutationFn: async (payload, { signal } = {}) => {
      const response = await apiClient.post(
        apiConstant.giveComplaint,
        payload,
        {
          signal,
        }
      );
      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data?.message ?? "Complaint submitted successfully.");
    },

    onError: (error) => {
      if (error?.name !== "AbortError") {
        console.error("Give complaint error:", error?.response?.data);
        const errorMessage =
          error?.response?.data?.errors?.[0]?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to submit complaint. Please try again.";
        toast.error(errorMessage);
      }
    },
  });
};

export default useGiveComplaint;
