'use client';
import HeaderAuthentication from '@/components/authentication/HeaderAuthentication';
import { Button, Input } from '@nextui-org/react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
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
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp')
    .required('Vui lòng nhập lại mật khẩu'),
});

export default function ResetPassword() {
  const [isShowPassword, setIsShownPassword] = useState(false);
  const [isShowConfirmPassword, setIsShownConfirmPassword] = useState(false);
  const togglePassword = () => setIsShownPassword(!isShowPassword);
  const toggleConfirmPassword = () => setIsShownConfirmPassword(!isShowConfirmPassword);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('New password:', values.password);
      // Handle logic here
      router.push('/login');
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-[500px] bg-white rounded-lg shadow-md border border-gray-200 p-12">
        <HeaderAuthentication />
        <p className="text-center my-10 text-xl font-medium">Đặt mật khẩu mới</p>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Input
            type={isShowPassword ? 'text' : 'password'}
            name="password"
            label="Mật khẩu"
            placeholder="Nhập mật khẩu mới"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.password && !!formik.errors.password}
            errorMessage={formik.touched.password && formik.errors.password}
            endContent={
              <button className="focus:outline-none" type="button" onClick={togglePassword}>
                {isShowPassword ? (
                  <FaEye className="text-2xl text-default-400" />
                ) : (
                  <FaEyeSlash className="text-2xl text-default-400" />
                )}
              </button>
            }
          />
          <Input
            type={isShowConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            label="Nhập lại mật khẩu"
            placeholder="Nhập lại mật khẩu"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
            errorMessage={formik.touched.confirmPassword && formik.errors.confirmPassword}
            endContent={
              <button className="focus:outline-none" type="button" onClick={toggleConfirmPassword}>
                {isShowConfirmPassword ? (
                  <FaEye className="text-2xl text-default-400" />
                ) : (
                  <FaEyeSlash className="text-2xl text-default-400" />
                )}
              </button>
            }
          />
          <div>
            <Button type="submit" color="primary" className="w-full mt-4 py-6 text-lg">
              Đặt mật khẩu mới
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
