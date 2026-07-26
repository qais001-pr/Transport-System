import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";

const useRebook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [QUERY_KEYS.PARENT.RE_BOOKING],

    mutationFn: async ({ bookingId }, { signal } = {}) => {
      const response = await apiClient.post(
        `${apiConstant.bookings}/${bookingId}/rebook`,
        {
          signal,
        },
      );
      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.PARENT.BOOKINGS]);
      toast.success(data?.message ?? "Booking rebooked successfully.");
    },

    onError: (error) => {
      if (error?.name !== "AbortError") {
        console.error("Rebooking error:", error?.response?.data);
        const errorMessage =
          error?.response?.data?.errors?.[0]?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to rebooking. Please try again.";
        toast.error(errorMessage);
      }
    },
  });
};

export default useRebook;
