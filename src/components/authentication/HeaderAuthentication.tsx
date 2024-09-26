import { Image } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { IoMdArrowBack } from 'react-icons/io';

export default function HeaderAuthentication() {
  const router = useRouter();
  return (
    <div className="flex items-center mb-8 justify-start gap-4">
      <IoMdArrowBack
        size={28}
        className="mr-20 hover:cursor-pointer"
        onClick={() => router.back()}
      />
      <div className="flex">
        <Image alt="MealSync Logo" height={32} radius="md" src="./images/logo.png" width={32} />
        <h1 className="text-2xl font-medium ml-2">MealSync</h1>
      </div>
    </div>
  );
}
