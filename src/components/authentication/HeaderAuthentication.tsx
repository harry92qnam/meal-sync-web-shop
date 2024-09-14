import { Image } from '@nextui-org/react';
import { IoMdArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

export default function HeaderAuthentication() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center mb-8 justify-start gap-4">
      <IoMdArrowBack
        size={28}
        className="mr-20 hover:cursor-pointer"
        onClick={() => navigate(-1)}
      />
      <div className="flex">
        <Image alt="MealSync Logo" height={32} radius="md" src="./images/logo.png" width={32} />
        <h1 className="text-2xl font-medium ml-2">MealSync</h1>
      </div>
    </div>
  );
}
