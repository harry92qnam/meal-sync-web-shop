'use client';
import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

const data = [
  {
    name: 'Tháng 1',
    processing: Math.floor(Math.random() * 20),
    success: Math.floor(Math.random() * 20),
    fail: Math.floor(Math.random() * 20),
    cancel: Math.floor(Math.random() * 20),
    report: Math.floor(Math.random() * 50),
  },
  {
    name: 'Tháng 2',
    processing: Math.floor(Math.random() * 20),
    success: Math.floor(Math.random() * 20),
    fail: Math.floor(Math.random() * 20),
    cancel: Math.floor(Math.random() * 20),
    report: Math.floor(Math.random() * 50),
  },
  {
    name: 'Tháng 3',
    processing: Math.floor(Math.random() * 20),
    success: Math.floor(Math.random() * 20),
    fail: Math.floor(Math.random() * 20),
    cancel: Math.floor(Math.random() * 20),
    report: Math.floor(Math.random() * 50),
  },
  {
    name: 'Tháng 4',
    processing: Math.floor(Math.random() * 20),
    success: Math.floor(Math.random() * 20),
    fail: Math.floor(Math.random() * 20),
    cancel: Math.floor(Math.random() * 20),
    report: Math.floor(Math.random() * 50),
  },
  {
    name: 'Tháng 5',
    processing: Math.floor(Math.random() * 20),
    success: Math.floor(Math.random() * 20),
    fail: Math.floor(Math.random() * 20),
    cancel: Math.floor(Math.random() * 20),
    report: Math.floor(Math.random() * 50),
  },
  {
    name: 'Tháng 6',
    processing: Math.floor(Math.random() * 20),
    success: Math.floor(Math.random() * 20),
    fail: Math.floor(Math.random() * 20),
    cancel: Math.floor(Math.random() * 20),
    report: Math.floor(Math.random() * 50),
  },
  {
    name: 'Tháng 7',
    processing: Math.floor(Math.random() * 20),
    success: Math.floor(Math.random() * 20),
    fail: Math.floor(Math.random() * 20),
    cancel: Math.floor(Math.random() * 20),
    report: Math.floor(Math.random() * 50),
  },
  {
    name: 'Tháng 8',
    processing: Math.floor(Math.random() * 20),
    success: Math.floor(Math.random() * 20),
    fail: Math.floor(Math.random() * 20),
    cancel: Math.floor(Math.random() * 20),
    report: Math.floor(Math.random() * 50),
  },
  {
    name: 'Tháng 9',
    processing: Math.floor(Math.random() * 20),
    success: Math.floor(Math.random() * 20),
    fail: Math.floor(Math.random() * 20),
    cancel: Math.floor(Math.random() * 20),
    report: Math.floor(Math.random() * 50),
  },
  {
    name: 'Tháng 10',
    processing: Math.floor(Math.random() * 20),
    success: Math.floor(Math.random() * 20),
    fail: Math.floor(Math.random() * 20),
    cancel: Math.floor(Math.random() * 20),
    report: Math.floor(Math.random() * 50),
  },
  {
    name: 'Tháng 11',
    processing: Math.floor(Math.random() * 20),
    success: Math.floor(Math.random() * 20),
    fail: Math.floor(Math.random() * 20),
    cancel: Math.floor(Math.random() * 20),
    report: Math.floor(Math.random() * 50),
  },
  {
    name: 'Tháng 12',
    processing: Math.floor(Math.random() * 20),
    success: Math.floor(Math.random() * 20),
    fail: Math.floor(Math.random() * 20),
    cancel: Math.floor(Math.random() * 20),
    report: Math.floor(Math.random() * 50),
  },
];
export default function OrderStatusChart() {
  useEffect(() => {
    const options = {
      series: [
        {
          name: 'Tổng',
          data: data.map((item) => item.processing),
        },
        {
          name: 'Thành công',
          data: data.map((item) => item.success),
        },
        {
          name: 'Đang xử lý',
          data: data.map((item) => item.fail),
        },
        {
          name: 'Thất bại/ hoàn tiền',
          data: data.map((item) => item.cancel),
        },
        {
          name: 'Đã hủy',
          data: data.map((item) => item.report),
        },
      ],
      chart: {
        height: 350,
        width: 540,
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
        text: 'Tổng số đơn',
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
        categories: data.map((item) => item.name),
      },
      grid: {
        borderColor: '#f1f1f1',
      },
    };

    var chart = new ApexCharts(document.querySelector('#orderStatus'), options);
    chart.render();
  });
  return <div id="orderStatus"></div>;
}
