import ActiveUserStatisticsChart from '@/components/components/ActiveUserStatisticsChart/ActiveUserStatisticsChart';
import StatisticsChart from '@/components/components/StatisticsChart/StatisticsChart';
import ComponentsDashboardSales from '@/components/dashboard/components-dashboard-sales';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Sales Admin',
};

const Sales = () => {
    return (
        <>
            <ActiveUserStatisticsChart />
            <StatisticsChart />
            <ComponentsDashboardSales />
        </>
    );
};

export default Sales;
