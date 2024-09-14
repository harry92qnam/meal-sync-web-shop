import { Button, Divider, Image, Input } from '@nextui-org/react';
import { useFormik } from 'formik';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .matches(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/, 'Email không hợp lệ!')
    .required('Vui lòng nhập email'),
  password: yup.string().required('Vui lòng nhập mật khẩu'),
});

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Form submitted with values:', values);
      // Handle logic here
      navigate('/dashboard');
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
          <Link to={'/forgot-password'}>
            <p className="underline text-primary text-sm text-right my-2">Quên mật khẩu?</p>
          </Link>
          <Button type="submit" color="primary" className="w-full py-6 text-lg">
            Đăng nhập
          </Button>
          <div className="flex items-center">
            <Divider className="flex-grow w-1/3" />
            <span className="px-2 text-gray-500">Hoặc</span>
            <Divider className="flex-grow w-1/3" />
          </div>
          <Button type="submit" color="default" className="w-full py-6 text-lg">
            <Image
              alt="MealSync Logo"
              height={24}
              width={24}
              radius="md"
              src="./images/google-icon.png"
            />{' '}
            Đăng nhập bằng Google
          </Button>
          <div className="text-sm text-center">
            Chưa có cửa hàng? {}
            <Link to="/register" className="text-primary underline">
              Đăng ký
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
