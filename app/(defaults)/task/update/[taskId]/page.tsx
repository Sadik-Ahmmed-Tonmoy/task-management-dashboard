import ComponentsDashboardUpdateTask from '@/components/dashboard/components-dashboard-update-task';
import React from 'react';

interface TaskId {
    params: {
        taskId: string;
    };
}

const updateTaskPage = ({ params }: TaskId) => {
    
    return (
        <div>
            <ComponentsDashboardUpdateTask id={params?.taskId} />
        </div>
    );
};

export default updateTaskPage;
