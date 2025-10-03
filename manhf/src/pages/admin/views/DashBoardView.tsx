import React from 'react';
import ApiTester from '../../../components/ApiTester';
const DashboardView: React.FC = () => {
  return (
    <div className="dashboard-view">
      <h1>Dashboard Principal</h1>
<div className="mt-8">
  <ApiTester />
</div>
    </div>
  );
};

export default DashboardView;