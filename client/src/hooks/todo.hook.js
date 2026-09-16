import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodos, createTodo, updateTodo, deleteTodo, reorderTodos, restoreTodo, hardDeleteTodo } from "../api/todoapi";

export const useTodos = (page = 1, limit = 10, trash = false) => {
    return useQuery({
        queryKey: ["todos", page, limit, trash],
        queryFn: () => getTodos(page, limit, trash),
        staleTime: 1000 * 60 * 5,
    });
};

export const useAddTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTodo,
        onMutate: async (newTodoData) => {
            await queryClient.cancelQueries({ queryKey: ["todos"] });
            const previousTodos = queryClient.getQueriesData({ queryKey: ["todos"] });
            
            const optimisticTodo = { 
                ...newTodoData, 
                _id: 'temp-' + Date.now(),
                completed: false,
                createdAt: new Date().toISOString()
            };

            queryClient.setQueriesData({ queryKey: ["todos"] }, (oldData) => {
                if (!oldData || !oldData.data) return oldData;
                return { ...oldData, data: [optimisticTodo, ...oldData.data] };
            });
            
            return { previousTodos };
        },
        onError: (err, newTodo, context) => {
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

export const useUpdateTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateTodo(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ["todos"] });
            const previousTodos = queryClient.getQueriesData({ queryKey: ["todos"] });
            
            queryClient.setQueriesData({ queryKey: ["todos"] }, (oldData) => {
                if (!oldData || !oldData.data) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.map(todo => 
                        todo._id === id ? { ...todo, ...data } : todo
                    )
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
                if (!oldData || !oldData.data) return oldData;
                return {
                    ...oldData,
                    data: oldData.data.filter(todo => todo._id !== id)
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
    });
};

export const useRestoreTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: restoreTodo,
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });
};

export const useHardDeleteTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: hardDeleteTodo,
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });
};
