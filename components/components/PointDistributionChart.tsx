'use client'
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ReactApexChart from 'react-apexcharts';
import { IRootState } from '@/store';
import { ApexOptions } from 'apexcharts';
import { useGetPointsDistributionQuery } from '@/redux/features/pointsDistribution/pointsDistributionApi';
import ReactLoading from 'react-loading';
import Swal from 'sweetalert2';



const PointsDistributionChart = () => {
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const [isMounted, setIsMounted] = useState(false);
    const { data, isLoading, isSuccess, error, isError} = useGetPointsDistributionQuery(undefined)
    

  
    useEffect(() => {
        if (isError) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                // title: '',
                text: (error as any)?.data?.success === false && (error as any)?.data?.errorSources[0]?.message,
                showConfirmButton: true,
                // timer: 1500,
            });
        }
    }, [isError, error]);

    

    const pointsDistributionChart = {
        series: [data?.data.totalPointAwarded, data?.data.totalRedeemed, data?.data.averagePointsPerUser],
        options: {
            chart: {
                type: 'donut' as const, // Explicitly set type as "donut"
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: [isDark ? '#0e1726' : '#fff'], // Ensure colors is an array
            },
            colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => val.toLocaleString(),
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0);
                                },
                            },
                        },
                    },
                },
            },
            labels: ['Total Points Awarded', 'Total Redeemed', 'Average Points per User'],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
        } as ApexOptions, // Cast as ApexOptions
    };

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <ReactLoading type={'bars'} color={'#4361ee'} height={'5%'} width={'5%'} className="mx-auto" />
            </div>
        );
    }

    return (
        <div className="panel h-full w-96">
            <div className="mb-5 flex items-center">
                <h5 className="text-lg font-semibold dark:text-white-light">Points Distribution</h5>
            </div>
            <div className="rounded-lg bg-white dark:bg-black">
                {isSuccess && (
                    <ReactApexChart series={pointsDistributionChart.series} options={pointsDistributionChart.options} type="donut" height={460} width={'100%'} />
                )}
            </div>
        </div>
    );
};

export default PointsDistributionChart;
