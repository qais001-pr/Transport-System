import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QUERY_KEYS } from "../../queryKeys";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";

export const useAllBookedDrivers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PARENT.ALL_BOOKED_DRIVERS],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.allBookedDrivers, { signal });
      return res.data;
    },
    keepPreviousData: true,
  });
};
