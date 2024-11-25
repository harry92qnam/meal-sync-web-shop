import useRefetch from '@/hooks/states/useRefetch';
import apiClient from '@/services/api-services/api-client';
import { formatPriceForInput, toast } from '@/utils/MyUtils';
import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Textarea,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { useFormik } from 'formik';
import React, { ChangeEvent, useState, useEffect, useRef } from 'react';
import * as yup from 'yup';
import axios from 'axios';
import Image from 'next/image';

interface WithdrawalRequestModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
}

interface BankProps {
  id: number;
  name: string;
  shortName: string;
  code: string;
  bin: string;
  logo: string;
}

const validationSchema = yup.object().shape({
  amount: yup.number().positive('Vui lòng nhập số tiền muốn rút'),
  bankAccountNumber: yup.string().required('Vui lòng nhập số tài khoản thụ hưởng'),
  bankAccountName: yup.string().required('Vui lòng nhập tên tài khoản thụ hưởng'),
});

const fetchBanks = async (setBanks: React.Dispatch<React.SetStateAction<BankProps[]>>) => {
  try {
    const response = await axios.get('https://api.vietqr.io/v2/banks');
    setBanks(response.data.data);
  } catch (error) {
    console.error('Error fetching banks:', error);
  }
};

export default function WithDrawalRequestCreateModal({
  isOpen,
  onOpenChange,
}: WithdrawalRequestModalProps) {
  const { setIsRefetch } = useRefetch();
  const [banks, setBanks] = useState<BankProps[]>([]);
  const [selectedBank, setSelectedBank] = useState<BankProps>();
  const [hasFetchedBanks, setHasFetchedBanks] = useState(false);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [code, setCode] = useState(['', '', '', '']);
  const [countDown, setCountDown] = useState(120);
  const [isCountDown, setIsCountDown] = useState(false);
  const [error, setError] = useState('');

  const [payloadData, setPayloadData] = useState<{
    bankCode?: string;
    bankShortName?: string;
    bankAccountNumber: string;
    bankAccountName: string;
    amount: number;
  } | null>(null);

  useEffect(() => {
    if (isNewModalOpen) {
      const id = setInterval(() => {
        setCountDown((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(id);
    } else {
      setCountDown(120);
    }
  }, [isNewModalOpen, isCountDown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setCode((prevCode) => {
        const newCode = [...prevCode];
        newCode[index] = value;
        return newCode;
      });

      if (value !== '' && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && index > 0 && code[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      handleSubmitBtn();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitBtn = async () => {
    try {
      const payload = {
        bankCode: payloadData?.bankCode,
        bankShortName: payloadData?.bankShortName,
        bankAccountNumber: payloadData?.bankAccountNumber,
        bankAccountName: payloadData?.bankAccountName,
        amount: payloadData?.amount ?? 0,
        verifyCode: parseInt(code.join(''), 10),
      };

      const responseData = await apiClient.post('shop-owner/withdrawal', payload);
      if (!responseData.data.isSuccess) {
        setError(responseData.data.error.message);
      } else {
        toast('success', responseData.data.value.message);
        setIsNewModalOpen(false);
        setIsRefetch();
      }
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.error.message);
    }
  };

  const handleResendOTP = async () => {
    // Implement logic for resending OTP here
    setCountDown(120);
    setCode(['', '', '', '']);
    setError('');
    setIsCountDown(!isCountDown);
    await apiClient.post('shop-owner/withdrawal/send-verify-code', payloadData);
  };

  const formik = useFormik({
    initialValues: {
      amount: 0,
      bank: {
        currentKey: '',
      },
      bankCode: '',
      bankShortName: '',
      bankAccountNumber: '',
      bankAccountName: '',
    },
    validationSchema,
    onSubmit: (values) => {
      handleCreate(values);
    },
  });

  const handleCreate = async (values: any) => {
    try {
      const payload = {
        bankCode: selectedBank?.code,
        bankShortName: selectedBank?.shortName,
        bankAccountNumber: values.bankAccountNumber,
        bankAccountName: values.bankAccountName,
        amount: Number(values?.amount),
      };

      setPayloadData(payload);

      if (payload.amount < 50000) {
        toast('error', 'Số tiền rút phải lớn hơn hoặc bằng 50.000 VNĐ.');
      } else if (!payload.bankCode || !payload.bankShortName) {
        toast('error', 'Vui lòng chọn ngân hàng để rút tiền về');
      } else {
        const responseData = await apiClient.post(
          'shop-owner/withdrawal/send-verify-code',
          payload,
        );
        if (!responseData.data.isSuccess) {
          toast('error', responseData.data.error.message);
        } else {
          onOpenChange(false);
          setIsNewModalOpen(true);
          formik.resetForm();
        }
      }
    } catch (error: any) {
      toast('error', error.response.data.error.message);
    }
  };

  const handleCancel = (onClose: () => void) => {
    onClose();
    formik.resetForm();
  };

  const handleBankSelectFocus = () => {
    if (!hasFetchedBanks) {
      fetchBanks(setBanks);
      setHasFetchedBanks(true);
    }
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
                Tạo yêu cầu rút tiền mới
              </ModalHeader>
              <ModalBody>
                <form className="space-y-4">
                  <Select
                    selectionMode="single"
                    isRequired
                    name="bank"
                    label="Ngân hàng thụ hưởng"
                    onSelectionChange={(value) => {
                      const bank = banks.find((b) => b.id === Number(value.currentKey));
                      setSelectedBank(bank);
                      formik.setFieldValue('bank', value);
                    }}
                    onFocus={handleBankSelectFocus}
                    renderValue={(selected) => (
                      <div className="flex flex-wrap gap-2">
                        {selected.map((bank) => (
                          <div key={bank.key} className="text-septenary">
                            {bank.rendered}
                          </div>
                        ))}
                      </div>
                    )}
                  >
                    {banks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id}>
                        <div className="flex gap-2">
                          <Image
                            src={bank.logo}
                            width={40}
                            height={40}
                            className="rounded-full border-small object-contain"
                            alt="bankImage"
                          />
                          <p>
                            {bank.name} <span>({bank.shortName})</span>
                          </p>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    isRequired
                    type="text"
                    name="bankAccountName"
                    label="Tên tài khoản thụ hưởng"
                    placeholder="Nhập tên tài khoản thụ hưởng"
                    value={formik.values.bankAccountName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.bankAccountName && !!formik.errors.bankAccountName}
                    errorMessage={formik.touched.bankAccountName && formik.errors.bankAccountName}
                  />
                  <Input
                    isRequired
                    type="text"
                    name="bankAccountNumber"
                    label="Số tài khoản thụ hưởng"
                    placeholder="Nhập số tài khoản thụ hưởng"
                    value={formik.values.bankAccountNumber}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      formik.setFieldValue('bankAccountNumber', value);
                    }}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.bankAccountNumber && !!formik.errors.bankAccountNumber
                    }
                    errorMessage={
                      formik.touched.bankAccountNumber && formik.errors.bankAccountNumber
                    }
                  />
                  <Input
                    isRequired
                    type="text"
                    name="amount"
                    label="Số tiền muốn rút"
                    placeholder="Nhập số tiền muốn rút"
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
                  onClick={() => handleCancel(onClose)}
                  className="hover:text-danger-500 hover:border-danger-500"
                >
                  Đóng
                </Button>
                <Button type="button" color="primary" onClick={() => formik.handleSubmit()}>
                  Tạo
                </Button>
              </ModalFooter>
            </React.Fragment>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isNewModalOpen}
        onOpenChange={() => setIsNewModalOpen(false)} // Close new modal
        isDismissable={false}
        className="rounded-xl py-4"
      >
        <ModalContent>
          <ModalHeader className="flex justify-center text-2xl">
            Nhập mã OTP để xác nhận rút tiền
          </ModalHeader>
          <ModalBody>
            <form onSubmit={onFormSubmit} className="space-y-4">
              <div className="flex justify-between">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    className="codeInput text-2xl text-center w-1/6 border-b border-gray-300 mx-4 text-primary focus:border-primary focus:outline-none"
                    type="tel"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
              </div>
              <div className="flex justify-center gap-1">
                {countDown <= 0 ? (
                  <p className=" text-gray-400">Mã OTP đã hết hạn. </p>
                ) : (
                  <p className=" text-gray-400">
                    Mã OTP sẽ hết hạn sau <span className="text-primary">{countDown}</span> giây.
                  </p>
                )}
                <p
                  className="text-primary hover:cursor-pointer hover:text-opacity-80"
                  onClick={handleResendOTP}
                >
                  Gửi lại mã?
                </p>
              </div>
              {error && <p className="text-medium text-danger text-center">{error}</p>}
              <div>
                <Button
                  type="submit"
                  color="primary"
                  className="w-full mt-4 py-6 text-lg"
                  onClick={() => formik.handleSubmit()}
                >
                  Xác thực
                </Button>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
