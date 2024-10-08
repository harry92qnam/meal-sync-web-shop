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

// Manage shops
const shopColumns = [
  { name: 'Thứ tự cửa hàng', uid: 'id', sortable: true },
  { name: 'Tên cửa hàng', uid: 'shopName', sortable: true },
  { name: 'Tên chủ cửa hàng', uid: 'shopOwnerName', sortable: true },
  { name: 'Số điện thoại', uid: 'phoneNumber' },
  { name: 'Tổng đơn hàng', uid: 'totalOrder', sortable: true },
  { name: 'Tổng sản phẩm', uid: 'totalProduct', sortable: true },
  { name: 'Tổng doanh thu', uid: 'balance', sortable: true },
  { name: 'Trạng thái cửa hàng', uid: 'status', sortable: true },
  { name: 'Ngày đăng ký', uid: 'createdDate', sortable: true },
  { name: 'Thao tác', uid: 'actions' },
];

const shopStatus = [
  { name: 'Đang hoạt động', uid: 'Đang hoạt động' },
  { name: 'Đang đóng cửa', uid: 'Đang đóng cửa' },
  { name: 'Chưa phê duyệt', uid: 'Chưa phê duyệt' },
  { name: 'Đã bị cấm', uid: 'Đã bị cấm' },
];

// Manage accounts
const accountColumns = [
  { name: 'Thứ tự', uid: 'id', sortable: true },
  { name: 'Tên tài khoản', uid: 'fullName', sortable: true },
  { name: 'Số điện thoại', uid: 'phoneNumber' },
  { name: 'Email', uid: 'email' },
  { name: 'Loại tài khoản', uid: 'role', sortable: true },
  { name: 'Trạng thái', uid: 'status', sortable: true },
  { name: 'Ngày đăng ký', uid: 'createdDate', sortable: true },
  { name: 'Thao tác', uid: 'actions' },
];

const accountStatus = [
  { name: 'Đang hoạt động', uid: 'Đang hoạt động' },
  { name: 'Đã bị cấm', uid: 'Đã bị cấm' },
  { name: 'Chưa xác thực', uid: 'Chưa xác thực' },
];

const accountType = [
  { name: 'Khách hàng', uid: 'Khách hàng' },
  { name: 'Chủ cửa hàng', uid: 'Chủ cửa hàng' },
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
  shopColumns,
  shopStatus,
  accountColumns,
  accountStatus,
  accountType,
};
