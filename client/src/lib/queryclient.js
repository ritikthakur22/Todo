import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient(
    {
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 1, //1 minute
                gcTime: 1000 * 60 * 5,   //5 minutes
                retry: 2,
                retryDelay: (attemptIndex) => Math.min(1000 * attemptIndex * 2, 30000) //30 seconds max
            },
            mutations: {
                retry: 0,
            }
        }
    }
);