'use client';
import UpdateProfileModal from '@/components/authentication/UpdateProfileModal';
import sessionService from '@/services/session-service';
import { Avatar, Badge, Divider, useDisclosure } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { IoMdNotifications } from 'react-icons/io';
import { sampleNotifications } from '../../data/TestData';
import { formatDate } from '../../utils/MyUtils';

const Header: React.FC<{ title: string }> = ({ title }) => {
  const [notiVisible, setNotiVisible] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const authDTO = sessionService.getAuthDTO();
  const avatarUrl =
    isMounted && authDTO?.avatarUrl
      ? authDTO?.avatarUrl
      : 'https://avatars.githubusercontent.com/u/62385893?v=4';

  const handleAvatarClick = () => {
    onOpen();
    setNotiVisible(false);
  };

  const handleNotiClick = () => {
    setNotiVisible((prev) => !prev);
  };

  return (
    <div className="fixed top-0 left-[305px] right-[13px] z-50 bg-white shadow-md py-4 pl-8">
      <div className="flex justify-between items-center pr-4">
        <p className="text-2xl text-primary font-medium">{title}</p>
        <div className="flex gap-4 justify-between items-center">
          <div
            className="flex justify-center items-center h-[36px] w-[36px] bg-blue-100 rounded-lg cursor-pointer hover:opacity-70"
            onClick={handleNotiClick}
          >
            <Badge content="5" color="primary">
              <IoMdNotifications size={24} className="text-orange-500" />
            </Badge>
          </div>
          {notiVisible && (
            <div className="absolute max-w-[360px] top-16 right-8 border-1 px-2 py-2 rounded-lg bg-white shadow-2xl">
              <p className="text-2xl font-bold mt-2">Thông báo</p>
              <Divider className="my-2" />
              {sampleNotifications.map((noti) => (
                <div
                  className="flex gap-2 py-1 pl-2 pr-5 items-center hover:bg-slate-200 hover:rounded-lg cursor-pointer"
                  key={noti.id}
                >
                  <Avatar src={noti.avatar} size="md" className="w-12 h-12 min-w-12" />
                  <div key={noti.id} className="flex-col items-center">
                    <p className={`text-sm ${!noti.isRead && 'font-bold'}`}>{noti.content}</p>
                    <p className="text-xs text-gray-400">{formatDate(noti.createdDate)}</p>
                  </div>
                  {!noti.isRead && (
                    <span className="w-3 h-3 bg-blue-500 rounded-full absolute right-4" />
                  )}
                </div>
              ))}
            </div>
          )}

          <Avatar
            src={avatarUrl}
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
