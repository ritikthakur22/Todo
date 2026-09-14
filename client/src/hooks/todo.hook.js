import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodos, createTodo, updateTodo, deleteTodo, reorderTodos } from "../api/todoapi";

export const useTodos = (limit = 10) => {
    return useInfiniteQuery({
        queryKey: ["todos", limit],
        queryFn: ({ pageParam = 1 }) => getTodos(pageParam, limit),
        getNextPageParam: (lastPage) => {
            if (lastPage.pagination.page < lastPage.pagination.pages) {
                return lastPage.pagination.page + 1;
            }
            return undefined;
        },
        staleTime: 1000 * 60 * 5,
    });
};

export const useAddTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTodo,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
    });
};

export const useUpdateTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateTodo(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ["todos"] });
            const previousTodos = queryClient.getQueriesData({ queryKey: ["todos"] });
            
            queryClient.setQueriesData({ queryKey: ["todos"] }, (oldData) => {
                if (!oldData || !oldData.pages) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map(page => ({
                        ...page,
                        data: page.data.map(todo => 
                            todo._id === id ? { ...todo, ...data } : todo
                        )
                    }))
                };
            });
            
            return { previousTodos };
        },
        onError: (err, variables, context) => {
            if (context?.previousTodos) {
                context.previousTodos.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });
};

export const useDeleteTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTodo,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["todos"] });
            const previousTodos = queryClient.getQueriesData({ queryKey: ["todos"] });
            
            queryClient.setQueriesData({ queryKey: ["todos"] }, (oldData) => {
                if (!oldData || !oldData.pages) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map(page => ({
                        ...page,
                        data: page.data.filter(todo => todo._id !== id)
                    }))
                };
            });
            
            return { previousTodos };
        },
        onError: (err, id, context) => {
            if (context?.previousTodos) {
                context.previousTodos.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });
};

export const useReorderTodos = () => {
    return useMutation({
        mutationFn: reorderTodos,
        // Not invalidating immediately to allow smooth local state drag-and-drop
    });
};
