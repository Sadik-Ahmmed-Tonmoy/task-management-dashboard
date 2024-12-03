'use client';
import { useGetDailyStatisticsQuery, useGetMonthlyStatisticsQuery, useGetWeeklyStatisticsQuery } from '@/redux/features/statistics/statisticsApi';
import { TQueryParam } from '@/types/types';
import React, { useEffect, useState } from 'react';
import Dropdown from '@/components/dropdown';
import { useSelector } from 'react-redux';
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots';
import { IRootState } from '@/store';
import ReactApexChart from 'react-apexcharts';
import ReactLoading from 'react-loading';
import dayjs from 'dayjs';
import { ConfigProvider, Select } from 'antd';

const StatisticsChart = () => {
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const [queryObj, setQueryObj] = useState<TQueryParam[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>(dayjs().year().toString());
    const [selectedMonth, setSelectedMonth] = useState<string>('01');
    const [fetchOption, setFetchOption] = useState<string>('Daily'); // State for dropdown selection

    const monthOptions = [
        { label: 'January', value: '01' },
        { label: 'February', value: '02' },
        { label: 'March', value: '03' },
        { label: 'April', value: '04' },
        { label: 'May', value: '05' },
        { label: 'June', value: '06' },
        { label: 'July', value: '07' },
        { label: 'August', value: '08' },
        { label: 'September', value: '09' },
        { label: 'October', value: '10' },
        { label: 'November', value: '11' },
        { label: 'December', value: '12' },
    ];

    const getYearOptions = () => {
        const currentYear = dayjs().year();
        const startYear = currentYear - 10;
        const yearOptions = [];
        for (let i = startYear; i <= currentYear; i++) {
            yearOptions.push({ label: i.toString(), value: i.toString() });
        }
        return yearOptions;
    };

    const mapDataToChartSeries = (data: any) => {
        // const days = data?.map((item: any) => `Day ${item?.date}`);
        // const months = data?.map((item: any) => `Month ${item?.date}`);
        // const years = data?.map((item: any) => `Year ${item?.date}`);

        const logins = data?.map((item: any) => item?.logins || 0);
        const loginDiff = data?.map((item: any) => item?.login_diff || 0);
        const previousLogins = data?.map((item: any) => (item.previous_logins !== null ? item.previous_logins : 0));
        const labels = data?.map((item: any) => (fetchOption === 'Daily' ? dayjs(item?.date).format('DD')  : fetchOption === 'Weekly' ? `${item?.week}` : ` ${item?.month}`));
        return {
            labels,
            series: [
                {
                    name: 'Logins',
                    data: logins,
                },
                {
                    name: 'Login Difference',
                    data: loginDiff,
                },
                {
                    name: 'Previous Logins',
                    data: previousLogins,
                },
            ],
        };
    };

    // Conditionally fetch data based on selected fetch option
    const { data: dailyData, isLoading: dailyIsLoading, isSuccess: dailyIsSuccess } = useGetDailyStatisticsQuery(queryObj, { skip: fetchOption !== 'Daily' });
    const { data: weeklyData, isLoading: weeklyIsLoading, isSuccess: weeklyIsSuccess } = useGetWeeklyStatisticsQuery(queryObj, { skip: fetchOption !== 'Weekly' });
    const { data: monthlyData, isLoading: monthlyIsLoading, isSuccess: monthlyIsSuccess } = useGetMonthlyStatisticsQuery(queryObj, { skip: fetchOption !== 'Monthly' });

    const chartData = dailyIsSuccess
        ? mapDataToChartSeries(dailyData?.data)
        : weeklyIsSuccess
        ? mapDataToChartSeries(weeklyData?.data)
        : monthlyIsSuccess
        ? mapDataToChartSeries(monthlyData?.data)
        : { labels: [], series: [] };

    const revenueChart: any = {
        series: chartData.series,
        options: {
            chart: {
                height: 325,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                zoom: { enabled: false },
                toolbar: { show: false },
            },
            dataLabels: { enabled: false },
            stroke: { show: true, curve: 'smooth', width: 2, lineCap: 'square' },
            dropShadow: { enabled: true, opacity: 0.2, blur: 10, left: -7, top: 22 },
            colors: isDark ? ['#2196F3', '#E7515A', '#F7C948'] : ['#1B55E2', '#E7515A', '#F7C948'],
            markers: { size: 5 },
            labels: chartData.labels,
            xaxis: {
                axisBorder: { show: false },
                axisTicks: { show: false },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: { fontSize: '12px', cssClass: 'apexcharts-xaxis-title' },
                },
            },
            yaxis: {
                labels: {
                    formatter: (value: number) => value.toString(),
                    offsetX: isRtl ? -30 : -10,
                    offsetY: 0,
                    style: { fontSize: '12px', cssClass: 'apexcharts-yaxis-title' },
                },
                opposite: isRtl,
            },
            grid: {
                borderColor: isDark ? '#191E3A' : '#E0E6ED',
                strokeDashArray: 5,
            },
            legend: { position: 'top', horizontalAlign: 'right', fontSize: '16px' },
            tooltip: { marker: { show: true } },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: isDark ? 0.19 : 0.28,
                    opacityTo: 0.05,
                    stops: isDark ? [100, 100] : [45, 100],
                },
            },
        },
    };

    const handleYearChange = (value: string) => {
        setSelectedYear(value);
    };

    const handleMonthChange = (value: string) => {
        setSelectedMonth(value);
    };

    const handleFetchOptionChange = (option: string) => {
        setFetchOption(option);
    };

    useEffect(() => {
        setQueryObj([
            { name: 'year', value: selectedYear },
            { name: 'month', value: selectedMonth },
        ]);
    }, [selectedYear, selectedMonth, fetchOption]);

    const isLoading = dailyIsLoading || weeklyIsLoading || monthlyIsLoading;

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <ReactLoading type={'bars'} color={'#4361ee'} height={'5%'} width={'5%'} className="mx-auto" />
            </div>
        );
    }

    return (
        <>
            <div className="panel h-full xl:col-span-2 mb-4">
                <div className="mb-5 flex items-center justify-between dark:text-white-light">
                    <h5 className="text-lg font-semibold">Login Statistics</h5>
                    <div className="flex items-center">
                        <ConfigProvider
                            theme={{
                                components: {
                                    Select: {
                                        colorBgElevated: isDark ? ' #191E3A' : '#F5F5F5',
                                        colorText: isDark ? 'white' : '#212121',

                                        selectorBg: isDark ? '#191E3A' : '#F5F5F5',
                                        optionSelectedBg: isDark ? '#3697d8' : '#e6f4ff',
                                    },
                                },
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <Select className="w-32 rounded-lg !bg-black" options={getYearOptions()} onChange={handleYearChange} placeholder="Select Year" value={selectedYear} />

                                {fetchOption == 'Monthly' ? (
                                    ''
                                ) : (
                                    <Select className="w-32 rounded-lg !bg-black" options={monthOptions} onChange={handleMonthChange} placeholder="Select Month" value={selectedMonth} />
                                )}
                            </div>
                        </ConfigProvider>
                        <div className="dropdown ml-4">
                            <Dropdown
                                offset={[0, 1]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                button={<IconHorizontalDots className="text-black/70 hover:!text-primary dark:text-white/70" />}
                            >
                                <ul>
                                    <li>
                                        <button className={`${fetchOption == 'Daily' ? 'bg-[#191E3A] text-white' : ''}`} type="button" onClick={() => handleFetchOptionChange('Daily')}>
                                            Daily
                                        </button>
                                    </li>
                                    <li>
                                        <button className={`${fetchOption == 'Weekly' ? 'bg-[#191E3A] text-white' : ''}`} type="button" onClick={() => handleFetchOptionChange('Weekly')}>
                                            Weekly
                                        </button>
                                    </li>
                                    <li>
                                        <button className={`${fetchOption == 'Monthly' ? 'bg-[#191E3A] text-white' : ''}`} type="button" onClick={() => handleFetchOptionChange('Monthly')}>
                                            Monthly
                                        </button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <ReactApexChart options={revenueChart.options} series={revenueChart.series} type="area" height={350} />
            </div>
        </>
    );
};

export default StatisticsChart;
