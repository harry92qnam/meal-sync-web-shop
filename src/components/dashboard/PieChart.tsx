'use client';
import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import FoodStatisticModel from '@/types/models/FoodStatisticModel';

interface PieChartProps {
  data: FoodStatisticModel[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  useEffect(() => {
    const options = {
      series: data.map((item) => item.percent),
      chart: {
        width: 500,
        type: 'pie',
      },
      labels: data.map((item) => item.foodName),
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
};

export default PieChart;
