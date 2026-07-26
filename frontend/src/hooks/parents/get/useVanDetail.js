import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QUERY_KEYS } from "../../queryKeys";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";

export const useVanDetail = ({ vanId }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PARENT.VAN_DETAIL, vanId],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(`${apiConstant.vanDetail}/${vanId}`, {
        signal,
      });
      return res.data;
    },
    keepPreviousData: true,
  });
};

