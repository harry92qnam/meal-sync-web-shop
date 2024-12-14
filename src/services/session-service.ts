import AuthDTO from '@/types/dtos/AuthDTO';

const sessionService = {
  getAuthToken: () => {
    const token = localStorage.getItem('token');
    return token;
  },
  getRole: () => {
    if (typeof window !== 'undefined') return window.localStorage.getItem('role');
    return null;
  },
  getAuthDTO: () => {
    if (typeof window !== 'undefined') {
      const authDTOString = localStorage.getItem('authDTO');
      try {
        return authDTOString ? (JSON.parse(authDTOString) as AuthDTO) : null;
      } catch (error: any) {
        console.error('Failed to parse authMoAuthDTO:', error);
        return null;
      }
    }
    return null;
  },
  setAuthDTO: (authDTO: AuthDTO) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authDTO', authDTO ? JSON.stringify(authDTO) : '');
    }
  },
  setAuthRole: async (role: number) => {
    localStorage.setItem('auth-role', role.toString());
  },

  setAuthToken: async (token: string) => {
    localStorage.setItem('auth-token', token);
  },
  getAuthRole: async () => {
    const role = await localStorage.getItem('auth-role');
    return parseInt(role || '', 10);
  },
};

export default sessionService;
