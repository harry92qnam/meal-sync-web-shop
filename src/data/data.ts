// Manage orders
const orderColumns = [
  { name: 'Thứ tự đơn hàng', uid: 'id', sortable: true },
  { name: 'Tên cửa hàng', uid: 'shopName', sortable: true },
  { name: 'Tên khách hàng', uid: 'customerName', sortable: true },
  { name: 'Trạng thái đơn hàng', uid: 'status', sortable: true },
  { name: 'Tổng hóa đơn', uid: 'price', sortable: true },
  { name: 'Thời gian giao dịch', uid: 'orderDate', sortable: true },
];

const orderStatus = [
  { name: 'Đã hoàn thành', uid: 'Đã hoàn thành' },
  { name: 'Đang thực hiện', uid: 'Đang thực hiện' },
  { name: 'Đã hủy', uid: 'Đã hủy' },
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
  orderColumns,
  orderStatus,
  shopColumns,
  shopStatus,
  accountColumns,
  accountStatus,
  accountType,
};
