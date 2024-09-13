import APICommonResponse from '../../types/responses/APICommonResponse';
import apiClient from '../api-services/api-client';

const authEndpoints = {
  login: 'customer/login',
  register: 'customer/register',
};
const authService = {
  login: async (email: string, password: string) => {
    return await apiClient
      .post<APICommonResponse>(authEndpoints.login, {
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.data.isSuccess) {
          // session handle
          return true;
        } else {
          return false;
        }
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  },
};

export default authService;
