import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Thay đổi URL API Laravel của bạn nếu khác
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Tự động đính kèm Token vào headers trước khi gửi request đi
api.interceptors.request.use(
    (config) => {
        // Kiểm tra xem đang chạy ở môi trường trình duyệt (client-side) không
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;