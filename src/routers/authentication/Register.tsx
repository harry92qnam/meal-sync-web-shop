import { Button, Image, Input } from '@nextui-org/react';
import { useFormik } from 'formik';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  shopOwner: yup
    .string()
    .required('Vui lòng nhập tên của bạn')
    .max(30, 'Tên cửa hàng chỉ có tối đa 30 ký tự'),
  shopName: yup
    .string()
    .required('Vui lòng nhập tên cửa hàng')
    .max(30, 'Tên cửa hàng chỉ có tối đa 30 ký tự'),
  email: yup
    .string()
    .matches(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/, 'Email không hợp lệ!')
    .required('Vui lòng nhập email'),
  phoneNumber: yup
    .string()
    .matches(/((^(\\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/, 'Số điện thoại không hợp lệ!')
    .required('Vui lòng nhập số điện thoại'),
  address: yup
    .string()
    .required('Vui lòng nhập địa chỉ cửa hàng')
    .max(100, 'Địa chỉ cửa hàng chỉ có tối đa 100 ký tự'),
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

export default function Register() {
  const [isShowPassword, setIsShownPassword] = useState(false);
  const [isShowConfirmPassword, setIsShownConfirmPassword] = useState(false);
  const togglePassword = () => setIsShownPassword(!isShowPassword);
  const toggleConfirmPassword = () => setIsShownConfirmPassword(!isShowConfirmPassword);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      shopOwner: '',
      shopName: '',
      email: '',
      phoneNumber: '',
      address: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('New shop infor:', values);
      // Handle logic here
      navigate('/verify-register');
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
            type="text"
            name="shopOwner"
            label="Tên chủ cửa hàng"
            placeholder="Nhập tên của bạn"
            value={formik.values.shopOwner}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.shopOwner && !!formik.errors.shopOwner}
            errorMessage={formik.touched.shopOwner && formik.errors.shopOwner}
          />
          <Input
            type="text"
            name="shopName"
            label="Tên cửa hàng"
            placeholder="Nhập tên cửa hàng của bạn"
            value={formik.values.shopName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.shopName && !!formik.errors.shopName}
            errorMessage={formik.touched.shopName && formik.errors.shopName}
          />
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
            type="text"
            name="phoneNumber"
            label="Số điện thoại"
            placeholder="Nhập số điện thoại của bạn"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.phoneNumber && !!formik.errors.phoneNumber}
            errorMessage={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />
          <Input
            type="text"
            name="address"
            label="Địa chỉ"
            placeholder="Nhập địa chỉ của cửa hàng"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.address && !!formik.errors.address}
            errorMessage={formik.touched.address && formik.errors.address}
          />
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
              Đăng ký
            </Button>
          </div>
          <div className="text-sm text-center">
            Đã có tài khoản? {}
            <Link to="/" className="text-primary underline">
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
