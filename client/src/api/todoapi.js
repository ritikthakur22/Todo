import { apiClient } from "./axios";

export const getTodos = async(page, limit, trash = false)=>{
    const response = await apiClient.get(`?page=${page}&limit=${limit}${trash ? '&trash=true' : ''}`);
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

export const restoreTodo = async (id) => {
    const response = await apiClient.patch(`/${id}/restore`);
    return response.data;
};

export const hardDeleteTodo = async (id) => {
    const response = await apiClient.delete(`/${id}/hard`);
    return response.data;
};
