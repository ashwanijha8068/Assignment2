import React, { useState, useEffect } from 'react';
import TableComponent from './table';

const App = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then(response => response.json())
      .then(data => setTableData(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className="App">
      <TableComponent data={tableData} setData={setTableData} />
    </div>
  );
};

export default App;
