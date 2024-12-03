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
};

export default sessionService;
