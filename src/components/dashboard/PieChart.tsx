'use client';
import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

const totalRevenue = 10000;
const data = [
  {
    name: 'Cơm',
    revenue: 2000,
  },
  {
    name: 'Bún',
    revenue: 3000,
  },
  {
    name: 'Bánh xèo',
    revenue: 4000,
  },
  {
    name: 'Phở',
    revenue: 1000,
  },
];

export default function PieChart() {
  useEffect(() => {
    const options = {
      series: data.map((item) => (item.revenue / totalRevenue) * 100),
      chart: {
        width: 360,
        type: 'pie',
      },
      labels: data.map((item) => item.name),
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 400,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

    const chart = new ApexCharts(document.querySelector('#pieChart'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, []);

  return <div id="pieChart"></div>;
}
