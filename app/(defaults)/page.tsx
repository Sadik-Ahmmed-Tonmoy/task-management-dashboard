
import ActiveUserStatisticsChart from '@/components/components/ActiveUserStatisticsChart/ActiveUserStatisticsChart';
import PointDistributionChart from '@/components/components/PointDistributionChart';
import StatisticsChart from '@/components/components/StatisticsChart/StatisticsChart';

import React, { useEffect } from 'react';



const Sales = () => {

    return (
        <>
            <ActiveUserStatisticsChart />
            <StatisticsChart />
            <PointDistributionChart />
            {/* <ComponentsDashboardSales /> */}
        </>
    );
};

export default Sales;
