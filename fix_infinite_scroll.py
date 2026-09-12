import re

with open("client/src/hooks/todo.hook.js", "r") as f:
    hooks = f.read()

hooks = hooks.replace(
    'import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";',
    'import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";'
)

old_useTodos = """export const useTodos = (params) => {
    return useQuery({
        queryKey: ["todos", params.page, params.limit],
        queryFn: () => getTodos(params.page, params.limit),
        staleTime: 1000 * 60 * 5, // cache for 5 minutes
    });
};"""

new_useTodos = """export const useTodos = (limit = 10) => {
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
};"""

hooks = hooks.replace(old_useTodos, new_useTodos)

with open("client/src/hooks/todo.hook.js", "w") as f:
    f.write(hooks)
