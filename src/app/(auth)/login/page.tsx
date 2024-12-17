'use client';
import apiClient from '@/services/api-services/api-client';
import sessionService from '@/services/session-service';
import AuthDTO from '@/types/dtos/AuthDTO';
import { Button, Image, Input } from '@nextui-org/react';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import * as yup from 'yup';

import useNotiState from '@/hooks/states/useNotiState';
import useSocketState from '@/hooks/states/useSocketState';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useGlobalAuthState from '@/hooks/states/useGlobalAuthState';
import useRefetch from '@/hooks/states/useRefetch';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .matches(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/, 'Email không hợp lệ!')
    .required('Vui lòng nhập email'),
  password: yup
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .max(25, 'Mật khẩu chỉ có tối đa 25 ký tự')
    .matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất một ký tự số (0-9)')
    .matches(/[a-z]/, 'Mật khẩu phải chứa ít nhất một chữ cái in thường (a-z)')
    .matches(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ cái in hoa (A-Z)')
    .matches(
      /[^\w]/,
      'Mật khẩu phải chứa ít nhất một ký tự đặc biệt (`, ~, !, @, #, $, %, ^, &, *, ?)',
    )
    .required('Vui lòng nhập mật khẩu'),
});

export default function Login() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setIsRefetch } = useRefetch();

  const toggleVisibility = () => setIsVisible(!isVisible);
  const globalSocketState = useSocketState();
  const globalNotiState = useNotiState();
  const globalAuthState = useGlobalAuthState();

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const payload = {
        loginContext: 3,
        email: data.email,
        password: data.password,
      };
      const responseData = await apiClient.post('auth/login', payload);
      console.log(responseData);
      console.log(payload);

      if (responseData.data.isSuccess) {
        const authDTO = responseData.data?.value?.accountResponse
          ? (responseData.data?.value?.accountResponse as AuthDTO)
          : null;
        const roleId = responseData.data?.value?.accountResponse?.roleName == 'ShopOwner' ? 2 : 3;
        const token = responseData.data?.value?.tokenResponse?.accessToken || '';

        if (authDTO) {
          sessionService.setAuthDTO(authDTO);
        }
        sessionService.setAuthToken(token);
        sessionService.setAuthRole(roleId);
        localStorage.setItem('token', responseData.data.value.tokenResponse.accessToken);
        globalAuthState.setAuthDTO(authDTO);
        globalAuthState.setRoleId(roleId);
        globalAuthState.setToken(token);
        router.push('/orders');
      } else {
        setError(responseData.data.error.message);
      }
    } catch (error: any) {
      setError(error.response.data.error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = await sessionService.getAuthToken();
      if (!token) {
        return;
      }
      const roleId = await sessionService.getAuthRole();
      globalAuthState.setToken(token);
      globalAuthState.setRoleId(roleId);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const updateAuthState = async () => {
      const token = await sessionService.getAuthToken();
      globalAuthState.setToken(token || '');
      const roleId = await sessionService.getAuthRole();
      globalAuthState.setRoleId(roleId);
    };

    updateAuthState();
  }, []);

  const { socket, setSocket } = globalSocketState;

  const initializeSocket = async () => {
    const token = globalAuthState.token;
    if (!token) return;
    try {
      if (!token) {
        console.log('Không tìm thấy token, vui lòng đăng nhập lại');
        return;
      }

      // Connect to the server with JWT authentication
      const newSocket = io('https://socketio.1wolfalone1.com/', {
        auth: {
          token: token,
        },
        transports: ['websocket', 'polling'],
      });

      globalSocketState.setSocket(newSocket);
      console.log(newSocket, 'newSocket');

      newSocket.on('notification', (noti: any) => {
        try {
          globalNotiState.setToggleChangingFlag(false);
          globalNotiState.setToggleChangingFlag(true);
          console.log(noti);
          setIsRefetch();
        } catch (err) {
          console.error('Lấy danh sách thông báo lỗi', err);
        }
      });

      // Handle connection errors
      newSocket.on('connect_error', (error: Error) => {
        console.error('Connection Error:', error);
      });

      setSocket(newSocket);
    } catch (error) {
      globalSocketState.setSocket(null);
      console.log('Error retrieving token:', error);
    }
  };

  useEffect(() => {
    initializeSocket();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [globalAuthState.token]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-[500px] bg-white rounded-lg shadow-md border border-gray-200 p-12">
        <div className="flex items-center mb-8 justify-center gap-4">
          <Image alt="MealSync Logo" height={32} radius="md" src="./images/logo.png" width={32} />
          <div className="flex flex-col">
            <h1 className="text-2xl font-medium">MealSync</h1>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Input
            isRequired
            type="email"
            name="email"
            label="Email"
            placeholder="Nhập email của bạn"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.email && !!formik.errors.email}
            errorMessage={formik.touched.email && formik.errors.email}
          />
          <Input
            isRequired
            type={isVisible ? 'text' : 'password'}
            name="password"
            label="Mật khẩu"
            placeholder="Nhập mật khẩu của bạn"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.password && !!formik.errors.password}
            errorMessage={formik.touched.password && formik.errors.password}
            endContent={
              <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <FaEye className="text-2xl text-default-400" />
                ) : (
                  <FaEyeSlash className="text-2xl text-default-400" />
                )}
              </button>
            }
          />
          {error && <p className="text-medium text-danger text-center">{error}</p>}
          <div className="flex justify-end">
            <Link href={'/forgot-password'}>
              <p className="underline text-primary text-sm w-28">Quên mật khẩu?</p>
            </Link>
          </div>
          <Button
            type="submit"
            color="primary"
            className="w-full py-6 text-lg"
            isLoading={isLoading}
          >
            Đăng nhập
          </Button>
          <div className="text-sm text-center">
            Chưa có cửa hàng? {}
            <Link href={'/register'} className="text-primary underline">
              Đăng ký
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
