import axiosInstance from '../axiosConfig';

export interface LoginResponse {
  idUsuario?: number;
  email: string;
  nombreUsuario: string;
  rol: 'INVITADO' | 'REGISTRADO' | 'ADMIN';
  token?: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/usuarios/login', {
      email,
      contrasena: password,
    });
    
    const data = response.data;
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    localStorage.setItem('authUser', JSON.stringify(data));
    
    return data;
  },

  register: async (email: string, username: string, password: string, ubicacion?: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/usuarios/register', {
      email,
      nombreUsuario: username,
      contrasena: password,
      ubicacion: ubicacion || '',
    });
    
    const data = response.data;
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    localStorage.setItem('authUser', JSON.stringify(data));
    
    return data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  },

  getCurrentUser: (): LoginResponse | null => {
    const user = localStorage.getItem('authUser');
    return user ? JSON.parse(user) : null;
  },

  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },
};

export default authService;
