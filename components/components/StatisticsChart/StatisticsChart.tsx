'use client';
import { useGetDailyStatisticsQuery } from '@/redux/features/statistics/statisticsApi';
import { TQueryParam } from '@/types/types';
import React, { useEffect, useState } from 'react';
import Dropdown from '@/components/dropdown';
import { useSelector } from 'react-redux';
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots';
import { IRootState } from '@/store';
import ReactApexChart from 'react-apexcharts';

import dayjs from 'dayjs'; // To dynamically get the current year
import { ConfigProvider, Select } from 'antd';

const StatisticsChart = () => {
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const [queryObj, setQueryObj] = useState<TQueryParam[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>(dayjs().year().toString()); // Set the current year as default

    // Function to generate an array of years (e.g., last 10 years)
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
        const days = data.map((item: any) => `Day ${item._id.day}`);
        const logins = data.map((item: any) => item.logins || 0);
        const loginDiff = data.map((item: any) => item.login_diff || 0);
        const previousLogins = data.map((item: any) => (item.previous_logins !== null ? item.previous_logins : 0));

        return {
            days,
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
                    name: 'Previous Day Logins',
                    data: previousLogins,
                },
            ],
        };
    };

    const { data, error, isLoading, isSuccess, isFetching } = useGetDailyStatisticsQuery(queryObj);
    const chartData = isSuccess ? mapDataToChartSeries(data.data) : { days: [], series: [] };

    // Chart configuration
    const revenueChart: any = {
        series: chartData.series,
        options: {
            chart: {
                height: 325,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                lineCap: 'square',
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            colors: isDark ? ['#2196F3', '#E7515A', '#F7C948'] : ['#1B55E2', '#E7515A', '#F7C948'],
            markers: {
                size: 5,
            },
            labels: chartData.days,
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },
            },
            yaxis: {
                labels: {
                    formatter: (value: number) => value.toString(),
                    offsetX: isRtl ? -30 : -10,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                opposite: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191E3A' : '#E0E6ED',
                strokeDashArray: 5,
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '16px',
            },
            tooltip: {
                marker: {
                    show: true,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
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

    console.log(queryObj);
    useEffect(() => {
        setQueryObj([{ name: 'year', value: selectedYear }]);
    }, [selectedYear]);

    return (
        <>
            <div className="panel h-full xl:col-span-2">
                <div className="mb-5 flex items-center justify-between dark:text-white-light">
                    <h5 className="text-lg font-semibold">Login Statistics</h5>
                    <div className="flex items-center">
                    <ConfigProvider
      theme={{
        components: {
          Select: {
            selectorBg: `${isDark?  '#191E3A' : '#F5F5F5'}`,
            optionSelectedBg: `${isDark?  '#3697d8' : '#e6f4ff'}`,
            optionActiveBg: `${isDark?  '' : ''}`,
            colorBgElevated: `${isDark?  ' #191E3A' : '#F5F5F5'}`,
            colorText: `${isDark?  'white' : '#212121'}`,
            // activeBorderColor: "#7F56D9",
          },
        },
      }}
    >

                        <Select
                            className="w-32  rounded-lg  !bg-black"
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                            }
                            options={getYearOptions()} // Set options to the list of years
                            onChange={handleYearChange} // Trigger year change
                            placeholder="Select Year"
                            value={selectedYear}
                            />
                            </ConfigProvider>

{/* <Select className='dark:!bg-black' placeholder="Select year" options={getYearOptions()} /> */}
                        <div className="dropdown ml-4">
                            <Dropdown
                                offset={[0, 1]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                button={<IconHorizontalDots className="text-black/70 hover:!text-primary dark:text-white/70" />}
                            >
                                <ul>
                                    <li>
                                        <button type="button">Weekly</button>
                                    </li>
                                    <li>
                                        <button type="button">Monthly</button>
                                    </li>
                                    <li>
                                        <button type="button">Yearly</button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div className="rounded-lg bg-white dark:bg-black">
                        {isSuccess ? (
                            <ReactApexChart series={revenueChart.series} options={revenueChart.options} type="area" height={325} width={'100%'} />
                        ) : (
                            <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white"></span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default StatisticsChart;
