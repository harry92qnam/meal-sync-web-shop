'use client';
import UpdateProfileModal from '@/components/authentication/UpdateProfileModal';
import apiClient from '@/services/api-services/api-client';
import sessionService from '@/services/session-service';
import PageableModel from '@/types/models/PageableModel';
import { Avatar, Badge, Button, Divider, useDisclosure } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { IoMdNotifications } from 'react-icons/io';
import { formatTimeToSeconds } from '../../utils/MyUtils';
import { useRouter } from 'next/navigation';

interface NotificationModel {
  id: number;
  accountId: number;
  referenceId: number;
  imageUrl: string;
  title: string;
  content: string;
  entityType: number;
  isRead: boolean;
  createdDate: string;
}

const Header: React.FC<{ title: string }> = ({ title }) => {
  const [notiVisible, setNotiVisible] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [pageSize, setPageSize] = useState(5);
  const [notifications, setNotifications] = useState<NotificationModel[]>();
  const [tmp, setTmp] = useState<PageableModel>();
  const [numberOfUnread, setNumberOfUnread] = useState(0);

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

  const handleLoadMore = () => {
    if (tmp!.totalCount > pageSize) {
      setPageSize(pageSize + 5);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const responseData = await apiClient.get(
        `shop-owner-staff/notification?pageSize=${pageSize}`,
      );

      if (responseData.data.isSuccess) {
        setNotifications((prevNotifications) => {
          const newItems = responseData.data.value.items;
          const existingIds = prevNotifications
            ? new Set(prevNotifications.map((item: NotificationModel) => item.id))
            : new Set();
          const uniqueNewItems = newItems.filter(
            (item: NotificationModel) => !existingIds.has(item.id),
          );
          return prevNotifications ? [...prevNotifications, ...uniqueNewItems] : uniqueNewItems;
        });
        setTmp(responseData.data.value);
      }
    };
    fetchData();
  }, [pageSize, notiVisible]);

  useEffect(() => {
    const fetchUnread = async () => {
      const responseData = await apiClient.get('shop-owner-staff/notification/total-unread');
      if (responseData.data.isSuccess) {
        setNumberOfUnread(responseData.data.value.totalUnerad);
      }
    };
    fetchUnread();
  }, []);

  return (
    <div className="fixed top-0 left-[305px] right-[13px] z-50 bg-white shadow-md py-4 pl-8">
      <div className="flex justify-between items-center pr-4">
        <p className="text-2xl text-primary font-medium">{title}</p>
        <div className="flex gap-4 justify-between items-center">
          <div
            className="flex justify-center items-center h-[40px] w-[40px] bg-blue-100 rounded-lg cursor-pointer hover:opacity-70"
            onClick={handleNotiClick}
          >
            {numberOfUnread ? (
              <Badge content={numberOfUnread} color="primary">
                <IoMdNotifications size={28} className="text-orange-500" />
              </Badge>
            ) : (
              <IoMdNotifications size={28} className="text-orange-500" />
            )}
          </div>
          {notiVisible && (
            <div className="absolute max-w-[360px] max-h-[620px] overflow-y-scroll top-[72px] right-[0.5px] border-1 px-2 py-2 rounded-lg bg-white shadow-2xl">
              <p className="text-2xl font-bold mt-2 text-center">Thông báo</p>
              <Divider className="my-2" />
              {notifications?.map((noti) => (
                <div
                  className="flex gap-2 py-1 pl-2 pr-5 items-center hover:bg-slate-200 hover:rounded-lg cursor-pointer"
                  key={noti.id}
                  onClick={() => router.push(`/orders/${noti.referenceId}`)}
                >
                  <Avatar src={noti.imageUrl} size="md" className="w-12 h-12 min-w-12" />
                  <div key={noti.id} className="flex-col items-center">
                    <p className={`text-sm ${!noti.isRead && 'font-bold'}`}>{noti.content}</p>
                    <p className="text-xs text-gray-400">{formatTimeToSeconds(noti.createdDate)}</p>
                  </div>
                  {!noti.isRead && (
                    <span className="w-3 h-3 bg-blue-500 rounded-full absolute right-4" />
                  )}
                </div>
              ))}
              <div>
                {tmp && tmp.totalCount > pageSize && (
                  <div className="flex justify-center">
                    <Button
                      onClick={() => handleLoadMore()}
                      size="sm"
                      className="w-full text-medium mb-2 mt-4"
                    >
                      Xem thêm
                    </Button>
                  </div>
                )}
              </div>
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
