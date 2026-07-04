'use client';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const baseChart = (type) => ({
  chart: {
    type,
    background: 'transparent',
    toolbar: { show: false },
    zoom: { enabled: false },
    foreColor: '#94A3B8',
    animations: { enabled: true, speed: 800 },
  },
  theme: { mode: 'dark' },
  grid: { borderColor: '#1e293b', strokeDashArray: 4 },
  tooltip: { theme: 'dark' },
});

const buildOptions = (chartData) => {
  const type = chartData.chartType || 'area';

  if (type === 'radialBar') {
    return {
      ...baseChart('radialBar'),
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          hollow: { size: '65%', background: 'transparent' },
          track: { background: '#1e293b', strokeWidth: '97%' },
          dataLabels: {
            name: { fontSize: '14px', color: '#94A3B8', offsetY: -10 },
            value: { fontSize: '28px', fontWeight: 700, color: '#fff', offsetY: 5 },
          },
        },
      },
      colors: chartData.colors || ['#8B5CF6'],
      labels: chartData.labels || ['Progress'],
      stroke: { lineCap: 'round' },
    };
  }

  if (type === 'donut' || type === 'pie') {
    return {
      ...baseChart(type),
      colors: chartData.colors || ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899'],
      labels: chartData.labels || [],
      legend: { position: 'bottom', labels: { colors: '#94A3B8' } },
      dataLabels: { style: { colors: ['#fff'] } },
      stroke: { colors: ['#0f172a'] },
    };
  }

  return {
    ...baseChart(type),
    colors: chartData.colors || ['#8B5CF6', '#3B82F6', '#10B981'],
    stroke: { curve: 'smooth', width: type === 'bar' ? 0 : 3 },
    fill:
      type === 'area'
        ? {
            type: 'gradient',
            gradient: { shade: 'dark', type: 'vertical', opacityFrom: 0.5, opacityTo: 0.05 },
          }
        : { opacity: 0.9 },
    plotOptions:
      type === 'bar'
        ? {
            bar: {
              borderRadius: 6,
              columnWidth: '50%',
              distributed: chartData.distributed || false,
            },
          }
        : {},
    dataLabels: { enabled: false },
    markers: { size: 0, hover: { size: 5 } },
    xaxis: {
      categories: chartData.categories || [],
      labels: { style: { colors: '#64748b' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: '#64748b' } } },
    legend: { show: !!chartData.showLegend, labels: { colors: '#94A3B8' } },
  };
};

const buildSeries = (chartData) => {
  const type = chartData.chartType;
  if (type === 'donut' || type === 'pie') return chartData.data || [];
  if (type === 'radialBar') return chartData.radialData || [75];
  if (chartData.multipleSeries) return chartData.multipleSeries;
  return [{ name: chartData.seriesName || 'Value', data: chartData.data || [] }];
};

const DashboardChart = ({ chartData, height = 320 }) => {
  if (!chartData) return null;

  return (
    <ReactApexChart
      options={buildOptions(chartData)}
      series={buildSeries(chartData)}
      type={chartData.chartType || 'area'}
      height={chartData.height || height}
    />
  );
};

export default DashboardChart;
