// import { formatCurrency, formatTimeToSeconds } from '@/utils/MyUtils';
// import {
//   Button,
//   Chip,
//   Input,
//   Modal,
//   ModalBody,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   Textarea,
// } from '@nextui-org/react';
// import React from 'react';

// interface OptionModalProps {
//   isOpen: boolean;
//   onOpen: () => void;
//   onOpenChange: (isOpen: boolean) => void;
//   onClose: () => void;
// }

// export default function OptionModal({
//   isOpen,
//   onOpenChange,
//   onClose,
// }: OptionModalProps) {
//   const { model: option } = useOptionTargetState();

//   return (
//     <Modal
//       isOpen={isOpen}
//       onOpenChange={onOpenChange}
//       placement="top-center"
//       isDismissable={false}
//       hideCloseButton
//       size="4xl"
//       style={{ zIndex: 100 }}
//     >
//       <ModalContent>
//         <ModalHeader className="flex flex-col mt-6">
//           <div className="flex justify-between items-center">
//             <div className="flex gap-4 justify-start items-center">
//               <p>{'#' + option.id + ' | ' + option.shopName}</p>
//               <Chip
//                 className={`capitalize ${
//                   option.status === 1
//                     ? 'bg-gray-200 text-gray-600'
//                     : option.status === 2
//                       ? 'bg-green-200 text-green-600'
//                       : 'bg-red-200 text-rose-600'
//                 }`}
//                 size="md"
//                 variant="flat"
//               >
//                 {OPTIONAL_STATUS.find((item) => item.key == option.status)?.desc}
//               </Chip>
//             </div>
//             <div className="flex gap-2 items-center mr-4">
//               {option.status === OPTIONAL_STATUS[0].key && (
//                 <React.Fragment>
//                   <Button
//                     color="danger"
//                     variant="flat"
//                     className="capitalize text-danger-500"
//                     onClick={() => onReject(option)}
//                   >
//                     Từ chối
//                   </Button>
//                   <Button
//                     color="success"
//                     variant="shadow"
//                     className="capitalize text-white"
//                     onClick={() => onApprove(option)}
//                   >
//                     Phê duyệt
//                   </Button>
//                 </React.Fragment>
//               )}
//             </div>
//           </div>
//         </ModalHeader>
//         <ModalBody>
//           <div className="flex gap-3">
//             <div className="flex-1 flex flex-col gap-2">
//               <div className="input-container">
//                 <Input
//                   name="shopName"
//                   label="Tên cửa hàng"
//                   value={option.shopName}
//                   readOnly
//                   fullWidth
//                 />
//               </div>
//               <div className="input-container">
//                 <Input name="email" label="Email" value={option.email} readOnly fullWidth />
//               </div>
//               <div className="input-container">
//                 <Input
//                   name="balance"
//                   label="Số dư hiện tại"
//                   value={formatCurrency(option.balance)}
//                   readOnly
//                   fullWidth
//                 />
//               </div>
//               <div className="input-container">
//                 <Input
//                   name="createdDate"
//                   label="Ngày yêu cầu"
//                   value={formatTimeToSeconds(option.createdDate)}
//                   readOnly
//                   fullWidth
//                 />
//               </div>
//               {option.status !== OPTIONAL_STATUS[0].key && (
//                 <div className="input-container">
//                   <Input
//                     name="processedDate"
//                     label="Ngày xử lý"
//                     value={formatTimeToSeconds(option.processedDate)}
//                     readOnly
//                     fullWidth
//                   />
//                 </div>
//               )}
//             </div>
//             <div className="flex-1 flex flex-col gap-2 justify-between">
//               <div className="input-container">
//                 <Input
//                   name="bankShortName"
//                   label="Tên ngân hàng"
//                   value={option.bankShortName}
//                   readOnly
//                   fullWidth
//                 />
//               </div>
//               <div className="input-container">
//                 <Input
//                   name="bankAccountNumber"
//                   label="Số tài khoản"
//                   value={option.bankAccountNumber}
//                   readOnly
//                   fullWidth
//                 />
//               </div>
//               <div className="input-container">
//                 <Input
//                   name="amount"
//                   label="Số tiền yêu cầu"
//                   value={formatCurrency(option.requestedAmount)}
//                   readOnly
//                   fullWidth
//                 />
//               </div>
//               <div className="input-container">
//                 <Textarea
//                   name="note"
//                   label="Ghi chú"
//                   placeholder={option.note ? '' : 'Không có ghi chú'}
//                   value={option.note ?? ''}
//                   readOnly
//                   fullWidth
//                 />
//               </div>
//             </div>
//           </div>
//         </ModalBody>
//         <ModalFooter>
//           <Button
//             color="danger"
//             variant="flat"
//             className="text-danger-500 hover:bg-danger-500 hover:text-white"
//             onPress={onClose}
//           >
//             Đóng
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// }
