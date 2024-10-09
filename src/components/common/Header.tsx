import UpdateProfileModal from '@/components/authentication/UpdateProfileModal';
import { Avatar, Badge, Divider, useDisclosure } from '@nextui-org/react';
import { useState } from 'react';
import { FaFacebookMessenger } from 'react-icons/fa6';
import { IoMdNotifications } from 'react-icons/io';
import { sampleChats, sampleNotifications } from '../../data/TestData';
import { formatDate, formatTimeAgo } from '../../utils/MyUtils';

const Header: React.FC<{ title: string }> = ({ title }) => {
  const [chatVisible, setChatVisible] = useState(false);
  const [notiVisible, setNotiVisible] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleAvatarClick = () => {
    // setDropdownVisible((prev) => !prev);
    onOpen();
    setChatVisible(false);
    setNotiVisible(false);
  };

  const handleChatClick = () => {
    setChatVisible((prev) => !prev);
    // setDropdownVisible(false);
    setNotiVisible(false);
  };

  const handleNotiClick = () => {
    setNotiVisible((prev) => !prev);
    // setDropdownVisible(false);
    setChatVisible(false);
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
          <UpdateProfileModal isOpen={isOpen} onOpenChange={onOpenChange} />
        </div>
      </div>
    </div>
  );
};

export default Header;
