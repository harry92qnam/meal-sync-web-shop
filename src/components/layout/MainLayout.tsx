'use client';
import { ReactNode } from 'react';
import SideBar from '../common/SideBar';

const MainLayout = ({
  children,
  activeContentIndex,
}: {
  children: ReactNode;
  activeContentIndex: number;
}) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-[auto,3fr] grid-rows-[auto,1fr] h-screen w-screen overflow-hidden bg-gray-10`}
    >
      {/* Sider Bar */}
      <div className="col-span-1 row-span-2 shadow-md">
        {' '}
        {/* Added height and overflow */}
        <SideBar activeContentIndex={activeContentIndex} />
      </div>

      {/* Main Content */}
      <div className="md:col-span-1 p-4 overflow-y-auto overflow-x-hidden">{children}</div>
    </div>
  );
};

export default MainLayout;
