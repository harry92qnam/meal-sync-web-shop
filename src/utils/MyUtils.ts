import axios from 'axios';
import Swal from 'sweetalert2';

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const formatTimeToSeconds = (dateString: string) => {
  const d = new Date(dateString);
  return `${d.toTimeString().slice(0, 8)} - ${d.toLocaleDateString('en-GB')}`;
};

export const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-GB');

export const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInMinutes < 1440) {
    // 60 minutes * 24 hours
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours} giờ trước`;
  } else if (diffInMinutes < 43200) {
    // 60 minutes * 24 hours * 30 days
    const diffInDays = Math.floor(diffInMinutes / 1440);
    return `${diffInDays} ngày trước`;
  } else if (diffInMinutes < 525600) {
    // 60 minutes * 24 hours * 365 days
    const diffInMonths = Math.floor(diffInMinutes / 43200); // 30 days
    return `${diffInMonths} tháng trước`;
  } else {
    const diffInYears = Math.floor(diffInMinutes / 525600); // 60 * 24 * 365
    return `${diffInYears} năm trước`;
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VI', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const formatNumber = (value: number | string | undefined | null) =>
  Number(value || 0).toLocaleString('en-US');

export const formatPhoneNumber = (phone: string) => {
  if (!phone) return null;
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

// calculate coordinates base on address
export const getCoordinates = async (address: string) => {
  const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your Google Maps API key
  const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
    params: {
      address: address,
      key: apiKey,
    },
  });

  if (response.data.status === 'OK') {
    const location = response.data.results[0].geometry.location;
    return { latitude: location.lat, longitude: location.lng };
  } else {
    throw new Error('Unable to get coordinates');
  }
};
