'use client';
import HeaderAuthentication from '@/components/authentication/HeaderAuthentication';
import useEmailState from '@/hooks/states/useCounterState';
import apiClient from '@/services/api-services/api-client';
import { Button, Input } from '@nextui-org/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .matches(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/, 'Email không hợp lệ!')
    .required('Vui lòng nhập email'),
});

export default function ForgotPassword() {
  const router = useRouter();
  const { setEmail } = useEmailState();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: (values) => {
      handleForgot(values);
    },
  });

  const handleForgot = async (values: { email: string }) => {
    const payload = {
      verifyType: 3,
      email: values.email,
    };
    try {
      const responseData = await apiClient.post('auth/send-code', payload);
      if (responseData.data.isSuccess) {
        setEmail(values.email);
        router.push('/verify-code-forgot');
      } else {
        setError(responseData.data.error.message);
      }
    } catch (error: any) {
      setError(error.response.data.error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-[500px] bg-white rounded-lg shadow-md border border-gray-200 p-12">
        <HeaderAuthentication />
        <p className="text-center my-10 text-xl font-medium">Nhập email để lấy lại mật khẩu</p>
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
          {error && <p className="text-medium text-primary text-center">{error}</p>}
          <div>
            <Button type="submit" color="primary" className="w-full py-6 text-lg">
              Lấy lại mật khẩu
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
