'use client';
import apiClient from '@/services/api-services/api-client';
import { Button, Image, Input } from '@nextui-org/react';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import * as yup from 'yup';

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

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const payload = {
        loginContext: 3,
        email: data.email,
        password: data.password,
      };
      const responseData = await apiClient.post('auth/login', payload);
      if (responseData.data.isSuccess) {
        localStorage.setItem('token', responseData.data.value.tokenResponse.accessToken);
        router.push('/orders');
      } else {
        setError(responseData.data.error.message);
      }
    } catch (error: any) {
      setError(error.response.data.error.message);
    }
  };

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
          <Button type="submit" color="primary" className="w-full py-6 text-lg">
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
