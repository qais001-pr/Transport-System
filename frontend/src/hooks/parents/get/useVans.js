import { useQuery } from "@tanstack/react-query";
import React from "react";
import { QUERY_KEYS } from "../../queryKeys";
import apiClient from "../../../api/apiClient";
import apiConstant from "../../../api/apiConstant";

const useVans = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PARENT.ALL_ACTIVE_VANS],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(apiConstant.allActiveVans, { signal });
      return res.data;
    },
    keepPreviousData: true,
  });
};

export default useVans;
