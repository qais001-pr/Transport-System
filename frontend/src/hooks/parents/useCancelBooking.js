import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";

export const useCancelBooking = () => {
  const queryClient=useQueryClient();
  return useMutation({
    mutationKey: [QUERY_KEYS.PARENT.CANCEL_BOOKING],

    mutationFn: async (payload, { signal } = {}) => {
      const response = await apiClient.put(
        `${apiConstant.bookings}/${payload.bookingId}/cancel`,
        payload,
        {
          signal,
        }
      );
      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.PARENT.BOOKINGS]);
      toast.success(data?.message ?? "Booking cancelled successfully.");
    },

    onError: (error) => {
      if (error?.name !== "AbortError") {
        console.error("Cancel booking error:", error?.response?.data);
        const errorMessage =
          error?.response?.data?.errors?.[0]?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to cancel booking. Please try again.";
        toast.error(errorMessage);
      }
    },
  });
};

