'use client';
import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import RevenueStatisticModel from '@/types/models/RevenueStatisticModel';

interface RevenueChartProps {
  data: RevenueStatisticModel[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  useEffect(() => {
    const options = {
      series: [
        {
          name: 'Nghìn đồng (VND)',
          data: data.map((item) => item.revenue),
        },
      ],
      chart: {
        height: 400,
        width: 500,
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
        categories: data.map((item) => item.month),
        tickPlacement: 'on',
        title: {
          text: 'Tháng',
        },
      },
      yaxis: {
        title: {
          text: 'Doanh thu (VND)',
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

    const chart = new ApexCharts(document.querySelector('#revenueChart'), options);
    chart.render();
  });
  return <div id="revenueChart"></div>;
};

export default RevenueChart;
