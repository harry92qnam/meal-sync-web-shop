import React from 'react';
import { IconType } from 'react-icons';
import { BsShop } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { GrTransaction } from 'react-icons/gr';
import { IoMdGift } from 'react-icons/io';
import { IoFastFoodOutline, IoPeopleOutline } from 'react-icons/io5';
import { MdOutlineDashboard, MdOutlineReport } from 'react-icons/md';
import { RiExchangeDollarFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

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
  // const navigate = useNavigate();
  // const isAuthenticated = () => {
  //   const token = localStorage.getItem('token');
  //   return token !== null;
  // };

  // useEffect(() => {
  //   if (!isAuthenticated()) {
  //     navigate('/login');
  //   }
  // }, []);

  return (
    <aside className="bg-white shadow-md p-6 pt-5 h-screen flex-col items-center min-w-[240px]">
      <div className="text-xl font-bold text-primary text-center">MealSync</div>
      <nav className="pt-6">
        <ul className="space-y-6">
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
        </ul>
      </nav>
    </aside>
  );
};

export default React.memo(SideBar);
