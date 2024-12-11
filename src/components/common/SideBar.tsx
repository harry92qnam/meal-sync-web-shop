import { Avatar, Button, Divider } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { GrTransaction } from 'react-icons/gr';
import { IoMdGift } from 'react-icons/io';
import { IoFastFoodOutline, IoPeopleOutline } from 'react-icons/io5';
import { MdLogout, MdOutlineCategory, MdOutlineDashboard, MdOutlineReport } from 'react-icons/md';
import { RiExchangeDollarFill } from 'react-icons/ri';
import { LuPackageCheck } from 'react-icons/lu';
import { VscFeedback } from 'react-icons/vsc';
import apiClient from '@/services/api-services/api-client';
import ShopModel from '@/types/models/ShopModel';

interface SidebarItemProps {
  title: string;
  icon: IconType;
  iconSize: number;
  path: string;
}
export const SidebarItemPropsList: Array<SidebarItemProps> = [
  { title: 'Thống kê tổng quan', icon: MdOutlineDashboard, iconSize: 19, path: '/dashboard' },
  { title: 'Quản lý đơn hàng', icon: GrTransaction, iconSize: 18, path: '/orders' },
  { title: 'Quản lý sản phẩm', icon: IoFastFoodOutline, iconSize: 19, path: '/products' },
  { title: 'Quản lý danh mục', icon: MdOutlineCategory, iconSize: 19, path: '/categories' },
  { title: 'Quản lý báo cáo', icon: MdOutlineReport, iconSize: 19, path: '/reports' },
  { title: 'Quản lý khuyến mãi', icon: IoMdGift, iconSize: 19, path: '/promotions' },
  { title: 'Quản lý nhân viên', icon: IoPeopleOutline, iconSize: 19, path: '/staffs' },
  {
    title: 'Quản lý tài chính',
    icon: RiExchangeDollarFill,
    iconSize: 19,
    path: '/account-balance',
  },
  {
    title: 'Đánh giá sản phẩm',
    icon: VscFeedback,
    iconSize: 19,
    path: '/review',
  },
  {
    title: 'Lịch sử phân công',
    icon: LuPackageCheck,
    iconSize: 19,
    path: '/history-assign',
  },
];
const SideBar = ({ activeContentIndex }: { activeContentIndex: number }) => {
  const router = useRouter();
  const [shopInfor, setShopInfor] = useState<ShopModel>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await apiClient.get('shop-owner/full-infor');
        setShopInfor(responseData.data.value);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <aside className="bg-white p-6 pt-5 h-screen flex-col items-center shadow-md overflow-y-scroll">
      <Link
        href={'/shop'}
        className="flex items-center gap-2 justify-center cursor-pointer hover:opacity-80 max-w-[240px]"
      >
        <Avatar
          src={shopInfor?.logoUrl ?? '/images/banner.png'}
          size="lg"
          className="w-16 h-16 min-w-16 border-small"
        />
        <p className="text-xl font-bold text-primary">{shopInfor?.name}</p>
      </Link>
      <Divider className="my-5" />
      <nav>
        <ul className="space-y-5">
          {SidebarItemPropsList.map((item, index) => (
            <li key={index}>
              <Link
                href={item.path}
                className={`flex pl-3 py-2 pr-8 rounded-xl items-center w-full ${
                  activeContentIndex === index
                    ? 'text-white bg-bgPrimary font-medium hover:text-white hover:bg-opacity-100'
                    : 'text-gray-600 hover:bg-orange-100 hover:text-black'
                }`}
              >
                <item.icon size={item.iconSize} />
                <span className="text-lg ml-2">{item.title}</span>
              </Link>
            </li>
          ))}

          <Button
            className="w-full font-medium gap-2 text-gray-600 hover:text-white hover:bg-primary"
            onClick={handleLogout}
          >
            <MdLogout size={20} />
            <p className="text-base">Đăng xuất</p>
          </Button>
        </ul>
      </nav>
    </aside>
  );
};

export default React.memo(SideBar);
