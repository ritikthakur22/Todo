import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodos, createTodo, updateTodo, deleteTodo, reorderTodos } from "../api/todoapi";

export const useTodos = (params) => {
    return useQuery({
        queryKey: ["todos", params.page, params.limit],
        queryFn: () => getTodos(params.page, params.limit),
        staleTime: 1000 * 60 * 5, // cache for 5 minutes
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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
    });
};

export const useDeleteTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
    });
};

export const useReorderTodos = () => {
    return useMutation({
        mutationFn: reorderTodos,
        // Not invalidating immediately to allow smooth local state drag-and-drop
    });
};
