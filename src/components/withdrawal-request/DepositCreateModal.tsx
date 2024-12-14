import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
import { formatPriceForInput, toast } from '@/utils/MyUtils';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';

interface WithdrawalRequestModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: (isOpen: boolean) => void;
}

const validationSchema = yup.object().shape({
  amount: yup
    .number()
    .positive('Vui lòng nhập số tiền muốn nạp')
    .min(50000, 'Số tiền muốn nạp phải lớn hơn hoặc bằng 50.000 VNĐ'),
});

export default function DepositCreateModal({
  isOpen,
  onClose,
  onOpenChange,
}: WithdrawalRequestModalProps) {
  const formik = useFormik({
    initialValues: {
      amount: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      handleCreate(values);
    },
  });

  const handleCreate = async (values: any) => {
    try {
      const payload = {
        amount: Number(values?.amount),
      };

      const responseData = await apiClient.get(`shop-owner/deposit?amount=${payload.amount}`);
      if (responseData.data.isSuccess) {
        window.location.href = responseData.data.value.paymentUrl;
        handleCancel();
      } else {
        console.log(responseData.data.error.message);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    onClose();
    onOpenChange(false);
    formik.resetForm();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton
        isDismissable={false}
        className="max-h-[640px] rounded-xl overflow-y-auto"
      >
        <ModalContent>
          {(onClose) => (
            <React.Fragment>
              <ModalHeader className="flex flex-col text-2xl text-center">
                Nạp tiền vào tài khoản
              </ModalHeader>
              <ModalBody>
                <form className="space-y-4">
                  <Input
                    isRequired
                    type="text"
                    name="amount"
                    label="Số tiền muốn nạp"
                    placeholder="Nhập số tiền muốn nạp"
                    value={
                      formik.values.amount
                        ? formatPriceForInput(formik.values.amount.toString())
                        : ''
                    }
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      formik.setFieldValue('amount', value);
                    }}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.amount && !!formik.errors.amount}
                    errorMessage={formik.touched.amount && formik.errors.amount}
                    endContent={'VND'}
                  />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="faded"
                  onClick={() => handleCancel()}
                  className="hover:text-danger-500 hover:border-danger-500"
                >
                  Đóng
                </Button>
                <Button type="button" color="primary" onClick={() => formik.handleSubmit()}>
                  Nạp
                </Button>
              </ModalFooter>
            </React.Fragment>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
