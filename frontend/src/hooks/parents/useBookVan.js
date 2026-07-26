import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";
import apiConstant from "../../api/apiConstant";
import { QUERY_KEYS } from "../queryKeys";

const useBookVan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [QUERY_KEYS.PARENT.BOOK_VAN],

    mutationFn: async ({ vanId, childrenIds }, { signal } = {}) => {
      console.log("Book van payload:", vanId, childrenIds);
      const response = await apiClient.post(
        `${apiConstant.bookVan}/${vanId}`,
        { childId: childrenIds },
        {
          signal,
        },
      );
      return response.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.PARENT.BOOKINGS]);
      toast.success(data?.message ?? "Booking request submitted successfully!");
    },

    onError: (error) => {
      if (error?.name !== "AbortError") {
        console.error("Full error:", error?.response?.data);

        const errorMessage =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.response?.data?.errors?.[0]?.message ||
          error?.message ||
          "Failed to book van. Please try again.";

        toast.error(errorMessage);
      }
    },
  });
};

export default useBookVan;
