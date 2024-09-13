import Swal from 'sweetalert2';

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const formatTimeToSeconds = (dateString: string) => {
  const d = new Date(dateString);
  return `${d.toTimeString().slice(0, 8)} - ${d.toLocaleDateString('en-GB')}`;
};

export const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-GB');

export const formatCurrency = (value: number | string | undefined | null) =>
  Number(value || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

export const formatNumber = (value: number | string | undefined | null) =>
  Number(value || 0).toLocaleString('en-US');

export const formatPhoneNumber = (phone: string) => {
  const match = phone.replace(/\D/g, '').match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : null;
};

export const toast = (icon: 'success' | 'error', content: string) =>
  Swal.fire({
    position: 'center',
    icon,
    text: content,
    showConfirmButton: true,
    timer: 2000,
  });
