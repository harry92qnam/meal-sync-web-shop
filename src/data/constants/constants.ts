// Manage orders
const INCOMING_ORDER_COLUMNS = [
  { key: 'id', name: 'Thứ tự đơn hàng' },
  { key: 'customerName', name: 'Tên khách hàng' },
  { key: 'phoneNumber', name: 'Số điện thoại' },
  { key: 'price', name: 'Tổng hóa đơn' },
  { key: 'orderedDate', name: 'Thời gian đặt đơn' },
  { key: 'actions', name: 'Thao tác' },
];

const CONFIRMED_ORDER_COLUMNS = [
  { key: 'id', name: 'Thứ tự đơn hàng' },
  { key: 'customerName', name: 'Tên khách hàng' },
  { key: 'phoneNumber', name: 'Số điện thoại' },
  { key: 'price', name: 'Tổng hóa đơn' },
  { key: 'confirmedDate', name: 'Thời gian nhận đơn' },
  { key: 'actions', name: 'Thao tác' },
];

const DELIVERING_ORDER_COLUMNS = [
  { key: 'id', name: 'Thứ tự đơn hàng' },
  { key: 'customerName', name: 'Tên khách hàng' },
  { key: 'staffName', name: 'Tên nhân viên giao hàng' },
  { key: 'status', name: 'Trạng thái giao hàng' },
  { key: 'price', name: 'Tổng hóa đơn' },
  { key: 'deliveryDate', name: 'Thời gian giao hàng' },
];

const HISTORY_ORDER_COLUMNS = [
  { key: 'id', name: 'Thứ tự đơn hàng' },
  { key: 'customerName', name: 'Tên khách hàng' },
  { key: 'phoneNumber', name: 'Số điện thoại' },
  { key: 'status', name: 'Trạng thái đơn hàng' },
  { key: 'price', name: 'Tổng hóa đơn' },
  { key: 'orderedDate', name: 'Thời gian giao dịch' },
];

const DELIVERY_STATUS = [
  { key: 1, desc: 'Đang giao' },
  { key: 2, desc: 'Thành công' },
  { key: 3, desc: 'Thất bại' },
];

const ORDER_STATUS = [
  { key: 1, desc: 'Đã hủy' },
  { key: 2, desc: 'Hoàn thành' },
  { key: 3, desc: 'Thất bại' },
  { key: 4, desc: 'Bị báo cáo' },
  { key: 5, desc: 'Hoàn tiền' },
];

// Manage reports
const REPORT_COLUMNS = [
  { key: 'id', name: 'Thứ tự' },
  { key: 'orderId', name: 'Mã đơn hàng' },
  { key: 'customerName', name: 'Tên người báo cáo' },
  { key: 'reason', name: 'Lý do' },
  { key: 'status', name: 'Trạng thái' },
  { key: 'createdDate', name: 'Thời gian báo cáo' },
];

const REPORT_STATUS = [
  { key: 1, desc: 'Đang xử lý' },
  { key: 2, desc: 'Đã xử lý' },
];

// Manage products
const PRODUCT_COLUMNS = [
  { key: 'id', name: 'Thứ tự' },
  { key: 'name', name: 'Tên sản phẩm ' },
  { key: 'price', name: 'Giá bán' },
  { key: 'status', name: 'Trạng thái' },
  { key: 'createdDate', name: 'Thời gian tạo sản phẩm' },
];

const PRODUCT_STATUS = [
  { key: 1, desc: 'Đang mở bán' },
  { key: 2, desc: 'Tạm hết hàng' },
];

// Manage categories
const CATEGORY_COLUMNS = [
  { key: 'id', name: 'Thứ tự' },
  { key: 'name', name: 'Tên danh mục' },
  { key: 'description', name: 'Mô tả' },
  { key: 'createdDate', name: 'Thời gian tạo danh mục' },
  { key: 'actions', name: 'Thao tác' },
];

// Manage promotions
const PROMOTION_COLUMNS = [
  { key: 'id', name: 'Thứ tự' },
  { key: 'title', name: 'Tên khuyến mãi' },
  { key: 'type', name: 'Loại áp dụng' },
  { key: 'startDate', name: 'Ngày bắt đầu' },
  { key: 'endDate', name: 'Ngày kết thúc' },
  { key: 'numberOfUsed', name: 'Số lượng đã dùng' },
  { key: 'usageLimit', name: 'Số lượng tối đa' },
  { key: 'status', name: 'Trạng thái' },
  { key: 'actions', name: 'Thao tác' },
];

const PROMOTION_TYPE = [
  { key: 1, desc: 'Giảm bằng tiền' },
  { key: 2, desc: 'Giảm bằng %' },
];

const PROMOTION_STATUS = [
  { key: 1, desc: 'Đang khuyến mãi' },
  { key: 2, desc: 'Đã hết hạn' },
];

// Manage staffs
const STAFF_COLUMNS = [
  { key: 'id', name: 'Thứ tự' },
  { key: 'name', name: 'Tên nhân viên' },
  { key: 'status', name: 'Trạng thái' },
  { key: 'createdDate', name: 'Thời gian tạo tài khoản' },
  { key: 'actions', name: 'Thao tác' },
];

const STAFF_STATUS = [
  { key: 1, desc: 'Đang rảnh' },
  { key: 2, desc: 'Đang giao hàng' },
  { key: 3, desc: 'Không hoạt động' },
];

export {
  INCOMING_ORDER_COLUMNS,
  CONFIRMED_ORDER_COLUMNS,
  DELIVERING_ORDER_COLUMNS,
  HISTORY_ORDER_COLUMNS,
  DELIVERY_STATUS,
  ORDER_STATUS,
  REPORT_COLUMNS,
  REPORT_STATUS,
  PRODUCT_COLUMNS,
  PRODUCT_STATUS,
  CATEGORY_COLUMNS,
  PROMOTION_COLUMNS,
  PROMOTION_TYPE,
  PROMOTION_STATUS,
  STAFF_COLUMNS,
  STAFF_STATUS,
};
