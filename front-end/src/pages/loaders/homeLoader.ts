import { QueryClient } from "@tanstack/react-query";

// Defines the query key and query function for consistency
export const getHomeDataQuery = {
  queryKey: ["homeData"],
  queryFn: () => {}, // TODO: add the query function here
};

/**
 * Loader to prefetch home page data and cache them before loading the home page
 * @param {QueryClient} queryClient Tanstack query client as loaders can't call useQueryClient
 * @returns Promise with home data query
 */
export const homeDataLoader = (queryClient: QueryClient) => async () => {
  const response = await queryClient.ensureQueryData(getHomeDataQuery);
  return response;
};
