import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
import OptionGroupModel from '@/types/models/OptionGroupModel';
import { toast } from '@/utils/MyUtils';
import {
  Avatar,
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';

type OptionAssignmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  existOptions?: Array<any>;
  id: number;
};

export const AddNewOption = ({ isOpen, onClose, existOptions, id }: OptionAssignmentModalProps) => {
  console.log(id, 'id');

  const { setIsRefetch } = useRefetch();
  const [data, setData] = useState<OptionGroupModel[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const responseData = await apiClient.get('shop-owner/option-group');
        if (responseData.data.isSuccess) {
          const newOptions = responseData.data?.value.items.filter(
            (option: OptionGroupModel) => !existOptions?.includes(option.id),
          );
          setData(newOptions);
        } else {
          toast('error', responseData.data.error.message);
        }
      } catch (error) {
        console.log('>>> error', error);
      }
    })();
  }, [existOptions]);

  const handleAddNew = async (optionIds: number[]) => {
    onClose();
    const payload = {
      foodId: id,
      optionGroupIds: optionIds.map(Number),
    };
    console.log(payload, 'payload');

    try {
      const responseData = await apiClient.put('shop-owner/food/link-option-group', payload);
      if (responseData.data.isSuccess) {
        setIsRefetch();
        setSelectedOptions([]);
        toast('success', responseData.data.value.message);
      } else {
        console.log('Something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isDismissable={false} className="rounded-xl">
      <ModalContent>
        {() => (
          <ModalBody className="flex py-4">
            <p className="text-center text-lg py-2 font-bold">Thêm mới nhóm lựa chọn</p>
            <Select
              selectionMode="multiple"
              isRequired
              name="optionGroup"
              label="Nhóm lựa chọn"
              disabled={!data.length}
              className={!data.length ? 'cursor-not-allowed opacity-50' : ''}
              onSelectionChange={(value) => setSelectedOptions(Array.from(value) as number[])}
              isMultiline
              renderValue={(selected) => (
                <div className="flex flex-wrap gap-2">
                  {selected.map((slot) => (
                    <Chip key={slot.key} color="success" className="text-septenary">
                      {slot.rendered}
                    </Chip>
                  ))}
                </div>
              )}
            >
              {data.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.title}
                </SelectItem>
              ))}
            </Select>
            <Button
              onClick={() => handleAddNew(selectedOptions)}
              disabled={selectedOptions.length === 0}
              className={selectedOptions.length === 0 ? 'cursor-not-allowed opacity-50' : ''}
            >
              Thêm
            </Button>
            {data.length === 0 && (
              <p className="text-danger-500 py-2 text-center">Bạn đã chọn hết các nhóm lựa chọn</p>
            )}
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};
