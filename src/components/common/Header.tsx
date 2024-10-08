import { Avatar, Badge, Divider, Listbox, ListboxItem } from '@nextui-org/react';
import { useState } from 'react';
import { FaFacebookMessenger } from 'react-icons/fa6';
import { IoMdNotifications } from 'react-icons/io';
import { sampleNotifications, sampleChats } from '../../data/TestData';
import { formatDate, formatTimeAgo } from '../../utils/MyUtils';
import { ListboxWrapper } from './ListboxWrapper';
import { MdLogout } from 'react-icons/md';
import { useRouter } from 'next/navigation';

const Header: React.FC<{ title: string }> = ({ title }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [notiVisible, setNotiVisible] = useState(false);

  const router = useRouter();

  const handleAvatarClick = () => {
    setDropdownVisible((prev) => !prev);
    setChatVisible(false);
    setNotiVisible(false);
  };

  const handleChatClick = () => {
    setChatVisible((prev) => !prev);
    setDropdownVisible(false);
    setNotiVisible(false);
  };

  const handleNotiClick = () => {
    setNotiVisible((prev) => !prev);
    setDropdownVisible(false);
    setChatVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="fixed top-0 left-[290px] right-4 z-50 bg-white shadow-md py-4 pl-8">
      <div className="flex justify-between items-center pr-4">
        <p className="text-2xl text-primary font-medium">{title}</p>
        <div className="flex gap-4 justify-between items-center">
          <div
            className="flex justify-center items-center h-[36px] w-[36px] bg-blue-100 rounded-lg cursor-pointer hover:opacity-70"
            onClick={handleChatClick}
          >
            <Badge content="3" color="primary">
              <FaFacebookMessenger size={22} className="text-blue-400" />
            </Badge>
          </div>
          {chatVisible && (
            <div className="absolute max-w-[360px] top-20 right-8 border-1 px-4 py-2 rounded-lg bg-white shadow-2xl">
              <p className="text-2xl font-bold mt-2">Tin nhắn</p>
              <Divider className="my-2" />
              {sampleChats.map((chat) => (
                <div
                  className="flex gap-2 pb-2 items-center hover:opacity-70 cursor-pointer"
                  key={chat.id}
                >
                  <Avatar src={chat.avatar} size="md" className="w-12 h-12 min-w-12" />
                  <div key={chat.id} className="flex-col">
                    <p className="text-sm">{chat.message}</p>
                    <p className="text-xs text-gray-400">
                      {formatTimeAgo(new Date(chat.createdDate))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            className="flex justify-center items-center h-[36px] w-[36px] bg-blue-100 rounded-lg cursor-pointer hover:opacity-70"
            onClick={handleNotiClick}
          >
            <Badge content="5" color="primary">
              <IoMdNotifications size={24} className="text-orange-500" />
            </Badge>
          </div>
          {notiVisible && (
            <div className="absolute max-w-[360px] top-20 right-8 border-1 px-4 py-2 rounded-lg bg-white shadow-2xl">
              <p className="text-2xl font-bold mt-2">Thông báo</p>
              <Divider className="my-2" />
              {sampleNotifications.map((noti) => (
                <div
                  className="flex gap-2 pb-2 items-center hover:opacity-70 cursor-pointer"
                  key={noti.id}
                >
                  <Avatar src={noti.avatar} size="md" className="w-12 h-12 min-w-12" />
                  <div key={noti.id} className="flex-col items-center">
                    <p className="text-sm">{noti.content}</p>
                    <p className="text-xs text-gray-400">{formatDate(noti.createdDate)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Avatar
            src="https://avatars.githubusercontent.com/u/62385893?v=4"
            size="md"
            onClick={handleAvatarClick}
            className="cursor-pointer hover:opacity-70"
          />
          {dropdownVisible && (
            <div className="absolute top-20 right-8 bg-white shadow-2xl">
              <ListboxWrapper>
                <Listbox aria-label="actions">
                  <ListboxItem key="profile" href="/profile">
                    <div className="flex items-center gap-2">
                      <Avatar
                        src="https://avatars.githubusercontent.com/u/62385893?v=4"
                        size="sm"
                        onClick={handleAvatarClick}
                        className="cursor-pointer hover:opacity-70"
                      />
                      <p className="text-base">Huỳnh Văn Phướt</p>
                    </div>
                  </ListboxItem>
                  <ListboxItem key="divider" isDisabled>
                    <Divider />
                  </ListboxItem>
                  <ListboxItem
                    key="logout"
                    className="text-red-500"
                    color="primary"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center gap-2">
                      <MdLogout size={20} /> <p className="text-base">Đăng xuất</p>
                    </div>
                  </ListboxItem>
                </Listbox>
              </ListboxWrapper>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
