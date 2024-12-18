'use client';
import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import OrderStatisticModel from '@/types/models/OrderStatisticModel';

interface OrderStatisticProps {
  data: OrderStatisticModel[];
}

const OrderStatistic: React.FC<OrderStatisticProps> = ({ data }) => {
  useEffect(() => {
    const options = {
      series: [
        {
          name: 'Tổng',
          data: data.map((item) => item.orderStatisticDetail.total),
        },
        {
          name: 'Thành công',
          data: data.map((item) => item.orderStatisticDetail.totalSuccess),
        },
        {
          name: 'Đang xử lý',
          data: data.map((item) => item.orderStatisticDetail.totalOrderInProcess),
        },
        {
          name: 'Thất bại/ hoàn tiền',
          data: data.map((item) => item.orderStatisticDetail.totalFailOrRefund),
        },
        {
          name: 'Đã hủy',
          data: data.map((item) => item.orderStatisticDetail.totalCancelOrReject),
        },
      ],
      chart: {
        height: 400,
        width: 500,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [2, 2, 2, 2, 2],
        curve: 'smooth',
      },
      title: {
        align: 'left',
        style: {
          fontFamily: 'Arial',
          fontWeight: 'bold',
        },
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 1,
        },
      },
      xaxis: {
        categories: data.map((item) => item.month),
        title: {
          text: 'Tháng',
          align: 'up',
        },
      },
      yaxis: {
        title: {
          text: 'Tổng số đơn',
        },
      },
      grid: {
        borderColor: '#f1f1f1',
      },
    };
    const chart = new ApexCharts(document.querySelector('#orderStatus'), options);
    if (!chart) {
      return;
    } else {
      chart.render();
    }

    return () => {
      chart.destroy();
    };
  }, [data]);
  return <div id="orderStatus"></div>;
};

export default OrderStatistic;
