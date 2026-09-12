import { apiClient } from "./axios";

export const getTodos = async(page, limit)=>{
    const response = await apiClient.get(`?page=${page}&limit=${limit}`);
    return response.data;
}

export const createTodo = async (todoData) => {
    const response = await apiClient.post('/', todoData);
    return response.data;
};

export const updateTodo = async (id, todoData) => {
    const response = await apiClient.put(`/${id}`, todoData);
    return response.data;
};

export const deleteTodo = async (id) => {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
};

export const reorderTodos = async (items) => {
    const response = await apiClient.put('/reorder', { items });
    return response.data;
};

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};
