'use client';
import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

const data = [
  {
    name: 'Tháng 1',
    revenue: 10,
  },
  {
    name: 'Tháng 2',
    revenue: 15,
  },
  {
    name: 'Tháng 3',
    revenue: 20,
  },
  {
    name: 'Tháng 4',
    revenue: 12,
  },
  {
    name: 'Tháng 5',
    revenue: 30,
  },
  {
    name: 'Tháng 6',
    revenue: 8,
  },
  {
    name: 'Tháng 7',
    revenue: 12,
  },
  {
    name: 'Tháng 8',
    revenue: 10,
  },
  {
    name: 'Tháng 9',
    revenue: 24,
  },
  {
    name: 'Tháng 10',
    revenue: 15,
  },
  {
    name: 'Tháng 11',
    revenue: 10,
  },
  {
    name: 'Tháng 12',
    revenue: 20,
  },
];

export default function RevenueChart() {
  useEffect(() => {
    const options = {
      series: [
        {
          name: 'Triệu đồng',
          data: data.map((item) => item.revenue),
        },
      ],
      chart: {
        height: 350,
        width: 520,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '50%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 0,
      },
      grid: {
        row: {
          colors: ['#fff', '#f2f2f2'],
        },
      },
      xaxis: {
        labels: {
          rotate: -45,
        },
        categories: data.map((item) => item.name),
        tickPlacement: 'on',
      },
      yaxis: {
        title: {
          text: 'Doanh thu (triệu đồng)',
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100],
        },
      },
    };

    var chart = new ApexCharts(document.querySelector('#revenueChart'), options);
    chart.render();
  });
  return <div id="revenueChart"></div>;
}
