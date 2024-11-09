// Manage orders
const INCOMING_ORDER_COLUMNS = [
  { key: 'id', name: 'Mã đơn hàng' },
  { key: 'customerName', name: 'Tên khách hàng' },
  { key: 'phoneNumber', name: 'Số điện thoại' },
  { key: 'buildingName', name: 'Địa chỉ nhận hàng' },
  { key: 'totalPrice', name: 'Tổng hóa đơn' },
  { key: 'frame', name: 'Khung giờ nhận hàng' },
  { key: 'createdDate', name: 'Thời gian đặt đơn' },
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
  // { key: 'frame', name: 'Khung giờ nhận hàng' },
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
  { key: 'createdDate', name: 'Thời gian giao hàng' },
];

const HISTORY_ORDER_COLUMNS = [
  { key: 'id', name: 'Mã đơn hàng' },
  { key: 'customerName', name: 'Tên khách hàng' },
  { key: 'phoneNumber', name: 'Số điện thoại' },
  { key: 'status', name: 'Trạng thái đơn hàng' },
  { key: 'totalPrice', name: 'Tổng hóa đơn' },
  { key: 'createdDate', name: 'Thời gian giao dịch' },
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
  { key: 'id', name: 'Mã sản phẩm' },
  { key: 'name', name: 'Tên sản phẩm' },
  { key: 'price', name: 'Giá bán' },
  { key: 'status', name: 'Trạng thái' },
  { key: 'slot', name: 'Khung giờ mở bán' },
  { key: 'shopCategory', name: 'Danh mục liên kết' },
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
  { key: 'active', name: 'Hoạt động' },
  { key: 'createdDate', name: 'Thời gian tạo tài khoản' },
  { key: 'actions', name: 'Thao tác' },
];

const STAFF_STATUS = [
  { key: 1, desc: 'Đang hoạt động' },
  { key: 2, desc: 'Không hoạt động' },
];

const STAFF_ACTIVE_STATUS = [
  { key: 1, desc: 'Đang rảnh' },
  { key: 2, desc: 'Đang giao hàng' },
  { key: 3, desc: 'Không hoạt động' },
];

export {
  INCOMING_ORDER_COLUMNS,
  CONFIRMED_ORDER_COLUMNS,
  PREPARING_ORDER_COLUMNS,
  ALL_PACKAGES_COLUMNS,
  OWN_PACKAGES_COLUMNS,
  DELIVERING_ORDER_COLUMNS,
  HISTORY_ORDER_COLUMNS,
  DELIVERY_STATUS,
  ORDER_STATUS,
  REPORT_COLUMNS,
  REPORT_STATUS,
  PRODUCT_COLUMNS,
  PRODUCT_STATUS,
  OPTION_GROUP_COLUMNS,
  OPTION_GROUP_STATUS,
  CATEGORY_COLUMNS,
  PROMOTION_COLUMNS,
  PROMOTION_TYPE,
  PROMOTION_STATUS,
  STAFF_COLUMNS,
  STAFF_STATUS,
  STAFF_ACTIVE_STATUS,
};
