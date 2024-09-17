import { Avatar, Button, Divider } from '@nextui-org/react';
import React from 'react';
import { IconType } from 'react-icons';
import { BsShop } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { GrTransaction } from 'react-icons/gr';
import { IoMdGift } from 'react-icons/io';
import { IoFastFoodOutline, IoPeopleOutline } from 'react-icons/io5';
import { MdLogout, MdOutlineDashboard, MdOutlineReport } from 'react-icons/md';
import { RiExchangeDollarFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';

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
  { title: 'Quản lý khuyến mãi', icon: IoMdGift, iconSize: 19, path: '/promotions' },
  { title: 'Quản lý nhân viên', icon: IoPeopleOutline, iconSize: 19, path: '/staffs' },
  { title: 'Quản lý báo cáo', icon: MdOutlineReport, iconSize: 19, path: '/reports' },
  { title: 'Kiểm tra số dư', icon: RiExchangeDollarFill, iconSize: 19, path: '/account-balance' },
  { title: 'Thông tin cửa hàng', icon: BsShop, iconSize: 18, path: '/shop' },
  { title: 'Thông tin cá nhân', icon: CgProfile, iconSize: 17, path: '/profile' },
];
const SideBar = ({ activeContentIndex }: { activeContentIndex: number }) => {
  const navigate = useNavigate();
  // const isAuthenticated = () => {
  //   const token = localStorage.getItem('token');
  //   return token !== null;
  // };

  // useEffect(() => {
  //   if (!isAuthenticated()) {
  //     navigate('/login');
  //   }
  // }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <aside className="bg-white p-6 pt-5 h-screen flex-col items-center min-w-[240px] overflow-scroll">
      <Link
        to={'/shop'}
        className="flex items-center gap-2 justify-center cursor-pointer hover:opacity-80 max-w-[240px]"
      >
        <Avatar
          src="https://i.pinimg.com/originals/98/48/d6/9848d697fc7882b000c0fac2eabb4b6b.png"
          size="lg"
          className="w-16 h-16 min-w-16"
        />
        <p className="text-xl font-bold text-primary">Tiệm ăn tháng năm</p>
      </Link>
      <Divider className="my-4" />
      <nav>
        <ul className="space-y-5">
          {SidebarItemPropsList.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex pl-3 py-2 pr-8 rounded-xl items-center w-full ${
                  activeContentIndex === index
                    ? 'text-white bg-bgPrimary bg-opacity-80 font-medium hover:text-white hover:bg-opacity-100'
                    : 'text-gray-600 hover:bg-cyan-200'
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
