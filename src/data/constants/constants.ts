// Manage orders
const INCOMING_ORDER_COLUMNS = [
  { key: 'id', name: 'Mã đơn hàng' },
  { key: 'customerName', name: 'Tên khách hàng' },
  { key: 'phoneNumber', name: 'Số điện thoại' },
  { key: 'buildingName', name: 'Địa chỉ nhận hàng' },
  { key: 'totalPrice', name: 'Tổng hóa đơn' },
  { key: 'frame', name: 'Khung giờ nhận hàng' },
  { key: 'orderDate', name: 'Thời gian đặt đơn' },
  { key: 'actions', name: 'Thao tác' },
];

const CONFIRMED_ORDER_COLUMNS = [
  { key: 'id', name: 'Mã đơn hàng' },
  { key: 'customerName', name: 'Tên khách hàng' },
  { key: 'phoneNumber', name: 'Số điện thoại' },
  { key: 'buildingName', name: 'Địa chỉ nhận hàng' },
  { key: 'totalPrice', name: 'Tổng hóa đơn' },
  { key: 'frame', name: 'Khung giờ nhận hàng' },
  { key: 'actions', name: 'Thao tác' },
];

const PREPARING_ORDER_COLUMNS = [
  { key: 'id', name: 'Mã đơn hàng' },
  { key: 'customerName', name: 'Tên khách hàng' },
  { key: 'phoneNumber', name: 'Số điện thoại' },
  { key: 'buildingName', name: 'Địa chỉ nhận hàng' },
  { key: 'totalPrice', name: 'Tổng hóa đơn' },
  { key: 'staff', name: 'Người giao hàng' },
  { key: 'actions', name: 'Thao tác' },
];

const ALL_PACKAGES_COLUMNS = [
  { key: 'id', name: 'Mã gói hàng' },
  { key: 'shopDeliveryStaff', name: 'Người giao hàng' },
  { key: 'frame', name: 'Khung giờ giao hàng' },
  { key: 'numberOfOrders', name: 'Số lượng đơn hàng' },
  { key: 'buildingName', name: 'Địa chỉ nhận hàng' },
  { key: 'intendedReceiveDate', name: 'Ngày giao hàng' },
  { key: 'actions', name: 'Thao tác' },
];

const OWN_PACKAGES_COLUMNS = [
  { key: 'id', name: 'Mã gói hàng' },
  { key: 'frame', name: 'Khung giờ giao hàng' },
  { key: 'numberOfOrders', name: 'Số lượng đơn hàng' },
  { key: 'buildingName', name: 'Địa chỉ nhận hàng' },
  { key: 'intendedReceiveDate', name: 'Ngày giao hàng' },
  { key: 'actions', name: 'Thao tác' },
];

const DELIVERING_ORDER_COLUMNS = [
  { key: 'id', name: 'Mã đơn hàng' },
  { key: 'customerName', name: 'Tên khách hàng' },
  { key: 'staffName', name: 'Tên nhân viên giao hàng' },
  { key: 'status', name: 'Trạng thái giao hàng' },
  { key: 'totalPrice', name: 'Tổng hóa đơn' },
  { key: 'orderDate', name: 'Thời gian đặt hàng' },
];

const HISTORY_ORDER_COLUMNS = [
  { key: 'id', name: 'Mã đơn hàng' },
  { key: 'customerName', name: 'Tên khách hàng' },
  { key: 'phoneNumber', name: 'Số điện thoại' },
  { key: 'status', name: 'Trạng thái đơn hàng' },
  { key: 'totalPrice', name: 'Tổng hóa đơn' },
  { key: 'intendedReceiveDate', name: 'Ngày dự kiến nhận hàng' },
];

const DELIVERY_STATUS = [
  { key: 6, desc: 'Đang giao' },
  { key: 7, desc: 'Giao thành công' },
  { key: 8, desc: 'Giao thất bại' },
];

const ORDER_STATUS = [
  { key: 2, desc: 'Từ chối' },
  { key: 4, desc: 'Đã hủy' },
  { key: 9, desc: 'Hoàn thành' },
  { key: 10, desc: 'Bị báo cáo' },
  { key: 11, desc: 'Đang giải quyết' },
  { key: 12, desc: 'Đã giải quyết' },
];

// Manage reports
const REPORT_COLUMNS = [
  { key: 'id', name: 'Mã báo cáo' },
  { key: 'orderId', name: 'Mã đơn hàng' },
  { key: 'customerName', name: 'Tên người báo cáo' },
  { key: 'title', name: 'Loại báo cáo' },
  { key: 'content', name: 'Lý do cụ thể' },
  { key: 'status', name: 'Trạng thái' },
  { key: 'createdDate', name: 'Thời gian báo cáo' },
];

const REPORT_STATUS = [
  { key: 1, desc: 'Đang xử lý' },
  { key: 3, desc: 'Đã phê duyệt' },
  { key: 2, desc: 'Đã từ chối' },
];

// Manage products
const PRODUCT_COLUMNS = [
  { key: 'id', name: 'Mã sản phẩm' },
  { key: 'name', name: 'Tên sản phẩm' },
  { key: 'price', name: 'Giá bán' },
  { key: 'status', name: 'Trạng thái' },
  { key: 'slot', name: 'Khung giờ mở bán' },
  { key: 'shopCategory', name: 'Danh mục liên kết' },
  { key: 'numberOfOptionGroupLinked', name: 'Số nhóm lựa chọn' },
  { key: 'actions', name: 'Thao tác' },
];

const PRODUCT_STATUS = [
  { key: 1, desc: 'Đang mở bán' },
  { key: 2, desc: 'Tạm hết hàng' },
  { key: 3, desc: 'Tạm ẩn' },
];

// Manage option groups
const OPTION_GROUP_COLUMNS = [
  { key: 'id', name: 'Mã nhóm lựa chọn' },
  { key: 'title', name: 'Tên nhóm' },
  { key: 'numOfItemLinked', name: 'Số sản phẩm liên kết' },
  { key: 'status', name: 'Trạng thái' },
  { key: 'createdDate', name: 'Thời gian tạo lựa chọn' },
  { key: 'actions', name: 'Thao tác' },
];

const OPTION_GROUP_STATUS = [
  { key: 1, desc: 'Đang hoạt động' },
  { key: 2, desc: 'Đã tạm ẩn' },
];

// Manage categories
const CATEGORY_COLUMNS = [
  { key: 'id', name: 'Mã danh mục' },
  { key: 'name', name: 'Tên danh mục' },
  { key: 'description', name: 'Mô tả' },
  { key: 'numberFoodLinked', name: 'Số sản phẩm liên kết' },
  { key: 'createdDate', name: 'Thời gian tạo danh mục' },
  { key: 'actions', name: 'Thao tác' },
];

// Manage promotions
const PROMOTION_COLUMNS = [
  { key: 'id', name: 'Mã khuyến mãi' },
  { key: 'title', name: 'Tên khuyến mãi' },
  { key: 'applyType', name: 'Loại áp dụng' },
  { key: 'startDate', name: 'Ngày bắt đầu' },
  { key: 'endDate', name: 'Ngày kết thúc' },
  { key: 'numberOfUsed', name: 'Số lượng đã dùng' },
  { key: 'usageLimit', name: 'Số lượng tối đa' },
  { key: 'status', name: 'Trạng thái' },
  { key: 'actions', name: 'Thao tác' },
];

const PROMOTION_TYPE = [
  { key: 1, desc: 'Giảm theo %' },
  { key: 2, desc: 'Giảm tiền trực tiếp' },
];

const PROMOTION_STATUS = [
  { key: 1, desc: 'Khả dụng' },
  { key: 2, desc: 'Đã tạm ẩn' },
];

// Manage staffs
const STAFF_COLUMNS = [
  { key: 'id', name: 'Thứ tự' },
  { key: 'fullName', name: 'Tên nhân viên' },
  { key: 'email', name: 'Email' },
  { key: 'phoneNumber', name: 'Số điện thoại' },
  { key: 'shopDeliveryStaffStatus', name: 'Trạng thái' },
  { key: 'createdDate', name: 'Thời gian tạo tài khoản' },
  { key: 'actions', name: 'Thao tác' },
];

const STAFF_STATUS = [
  { key: 1, desc: 'Đang hoạt động' },
  { key: 2, desc: 'Nghỉ phép' },
  { key: 3, desc: 'Đã khóa' },
];

const WITHDRAWAL_COLUMNS = [
  { key: 'id', name: 'Mã yêu cầu' },
  { key: 'bankShortName', name: 'Ngân hàng thụ hưởng' },
  { key: 'bankAccountNumber', name: 'Số tài khoản' },
  { key: 'amount', name: 'Số tiền muốn rút' },
  { key: 'status', name: 'Trạng thái' },
  { key: 'createdDate', name: 'Thời gian tạo yêu cầu' },
  { key: 'actions', name: 'Thao tác' },
];

const WITHDRAWAL_STATUS = [
  { key: 1, desc: 'Đang chờ duyệt' },
  { key: 2, desc: 'Đã hủy' },
  { key: 3, desc: 'Đang xử lý' },
  { key: 4, desc: 'Đã phê duyệt' },
  { key: 5, desc: 'Đã từ chối' },
];

// Manage review
const REVIEW_COLUMNS = [
  { key: 'id', name: 'Mã đánh giá' },
  { key: 'orderId', name: 'Mã đơn hàng' },
  { key: 'customerName', name: 'Tên khách hàng đánh giá' },
  { key: 'comment', name: 'Nội dung đánh giá' },
  { key: 'status', name: 'Trạng thái' },
  { key: 'createdDate', name: 'Thời gian đánh giá' },
  { key: 'actions', name: 'Thao tác' },
];

const REVIEW_STATUS = [
  { key: 1, desc: 'Chưa phản hồi' },
  { key: 2, desc: 'Đã phản hồi' },
];

// Manage history delivery package
const HISTORY_ASSIGN_COLUMNS = [
  { key: 'id', name: 'Mã gói hàng' },
  { key: 'shopDeliveryStaff', name: 'Người giao hàng' },
  { key: 'numberOfOrders', name: 'Số lượng đơn hàng' },
  { key: 'buildingName', name: 'Địa chỉ nhận hàng' },
  { key: 'timeFrameFormat', name: 'Khung giờ giao hàng' },
  { key: 'intenededReceiveDate', name: 'Ngày giao hàng' },
  { key: 'status', name: 'Trạng thái' },
  { key: 'actions', name: 'Thao tác' },
];

const HISTORY_ASSIGN_STATUS = [
  { key: 1, desc: 'Đang xử lý' },
  { key: 2, desc: 'Đã xử lý' },
];

export {
  ALL_PACKAGES_COLUMNS,
  CATEGORY_COLUMNS,
  CONFIRMED_ORDER_COLUMNS,
  DELIVERING_ORDER_COLUMNS,
  DELIVERY_STATUS,
  HISTORY_ORDER_COLUMNS,
  INCOMING_ORDER_COLUMNS,
  OPTION_GROUP_COLUMNS,
  OPTION_GROUP_STATUS,
  ORDER_STATUS,
  OWN_PACKAGES_COLUMNS,
  PREPARING_ORDER_COLUMNS,
  PRODUCT_COLUMNS,
  PRODUCT_STATUS,
  PROMOTION_COLUMNS,
  PROMOTION_STATUS,
  PROMOTION_TYPE,
  REPORT_COLUMNS,
  REPORT_STATUS,
  STAFF_COLUMNS,
  STAFF_STATUS,
  WITHDRAWAL_COLUMNS,
  WITHDRAWAL_STATUS,
  REVIEW_COLUMNS,
  REVIEW_STATUS,
  HISTORY_ASSIGN_COLUMNS,
  HISTORY_ASSIGN_STATUS,
};
