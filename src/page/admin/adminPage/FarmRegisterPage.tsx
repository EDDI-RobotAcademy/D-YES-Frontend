import React from 'react';
import FarmRegister from './farm/FarmRegister';
import FarmList from './farm/FarmList';

const FarmRegisterPage = () => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, marginRight: '20px' }}>
        <FarmRegister />
      </div>
      <div style={{ flex: 1, marginLeft: '20px' }}>
        <FarmList />
      </div>
    </div>
  );
};

export default FarmRegisterPage;