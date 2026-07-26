import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QUERY_KEYS } from "../../queryKeys";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";

export const useBooking = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PARENT.BOOKINGS],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.bookings, { signal });
      return res.data;
    },
    keepPreviousData: true,
  });
};
