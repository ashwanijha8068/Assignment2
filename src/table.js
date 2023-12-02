import React, { useState, useEffect, useRef, useCallback } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "bootstrap/dist/css/bootstrap.min.css";
import "./table.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';


const TableComponent = ({ data, setData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalSize = data.length;
  const [searchValue, setSearchValue] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const selectedRowsRef = useRef(selectedRows);
  const isEditableRef = useRef(isEditable);
  const inputRef = useRef();

  useEffect(() => {
    selectedRowsRef.current = selectedRows;
  }, [selectedRows]);

  useEffect(() => {
    isEditableRef.current = isEditable;
  }, [isEditable]);

  const handleRowChange = useCallback(
    (rowId, field, value) => {
      const newData = data.map((row) => {
        if (row.id === rowId) {
          return { ...row, [field]: value };
        }
        return row;
      });

      setData(newData);
    },
    [data]
  );

  const selectRow = {
    mode: "checkbox",
    clickToSelect: false,
    selected: selectedRows,
    onSelect: (row, isSelect) => {
      if (isSelect) {
        setSelectedRows((prevSelectedRows) => [...prevSelectedRows, row.id]);
      } else {
        setSelectedRows((prevSelectedRows) =>
          prevSelectedRows.filter((id) => id !== row.id)
        );
      }
    },
    onSelectAll: (isSelect, rows) => {
      const ids = rows.map((r) => r.id);
      if (isSelect) {
        setSelectedRows(ids);
      } else {
        setSelectedRows([]);
      }
    },
    selectionHeaderRenderer: ({ mode, checked, indeterminate }) => {
      return (
        <input
          type={mode}
          checked={checked}
          onChange={() => {}}
          className="selection-checkbox"
        />
      );
    },
    classes: (row, rowIndex) => {
      if (selectedRows.includes(row.id)) {
        console.log('fg')
        return 'selected-row';
      }
      return '';
    }
    
    
  };

  const columns = [
    {
      dataField: "name",
      text: "Name",
      formatter: (cellContent, row) => {
        if (row.id === editingRow && row.isEditable) {
          return (
            <input
              ref={inputRef}
              defaultValue={row.name}
              onBlur={(e) => {
                handleRowChange(row.id, "name", e.target.value);
              }}
              style={{
                padding: "5px",
                borderRadius: "5px",
                border: "2px solid #007BFF",
                fontSize: "16px",
                color: "#495057"
              }}
            />
          );
        }
        return cellContent;
      },
      headerStyle: () => {
        return { width: "25%" };
      },
      headerClasses: "header-column",
    },

    {
      dataField: "email",
      text: "Email",
      formatter: (cellContent, row) => {
        if (row.id === editingRow && row.isEditable) {
          return (
            <input
              ref={inputRef}
              defaultValue={row.email}
              onBlur={(e) => {
                handleRowChange(row.id, "email", e.target.value);
              }}
              style={{
                padding: "5px",
                borderRadius: "5px",
                border: "2px solid #007BFF",
                fontSize: "16px",
                color: "#495057"
              }}
            />
          );
        }
        return cellContent;
      },
      headerStyle: () => {
        return { width: "35%" };
      },
      headerClasses: "header-column",
    },
    {
      dataField: "role",
      text: "Role",
      formatter: (cellContent, row) => {
        if (row.id === editingRow && row.isEditable) {
          return (
            <input
              ref={inputRef}
              defaultValue={row.role}
              onBlur={(e) => {
                handleRowChange(row.id, "role", e.target.value);
              }}
              style={{
                padding: "5px",
                borderRadius: "5px",
                border: "2px solid #007BFF",
                fontSize: "16px",
                color: "#495057"
              }}
            />
          );
        }
        return cellContent;
      },
      headerStyle: () => {
        return { width: "15%" };
      },
      headerClasses: "header-column",
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cellContent, row) => {
        return (
          <div>
            {row.isEditable ? (
              <button
                className="custom-button save-button"
                onClick={handleSave}
              >
                Save
              </button>
            ) : (
              <button
                className="custom-button edit-button"
                onClick={() => handleEdit(row.id)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
            )}
            <button
              className="custom-button delete-button"
              onClick={() => {
                handleSingleDelete(row.id);
              }}
            >
              <FontAwesomeIcon className="delete-icon" icon={faTrash} />
            </button>
          </div>
        );
      },
      headerStyle: () => {
        return { width: "15%" };
      },
      headerClasses: "header-column",
    },
  ];

  const handleSingleDelete = (rowId) => {
    if (selectedRowsRef.current.includes(rowId)) {
      handleDelete(rowId);
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Please select the checkbox of the row to delete',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleEdit = (rowId) => {
    if (selectedRowsRef.current.includes(rowId)) {
      setData(
        data.map((row) =>
          row.id === rowId ? { ...row, isEditable: !row.isEditable } : row
        )
      );
      setEditingRow(rowId);
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Please select the checkbox of the row to edit',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  
  const handleSave = () => {
    if (selectedRowsRef.current.includes(editingRow)) {
      const newData = data.map((row) => {
        if (row.id === editingRow) {
          return { ...row, isEditable: false };
        }
        return row;
      });

      setData(newData);
      setEditingRow(null);
      setIsEditable(false);
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Please select the row to save changes',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handlePageChange = (page, sizePerPage) => {
    setCurrentPage(page);
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.role.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleDelete = (rowIds) => {
    if (!Array.isArray(rowIds)) {
      rowIds = [rowIds];
    }

    const newData = data.filter((item) => !rowIds.includes(item.id));
    setData(newData);

    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.filter((id) => !rowIds.includes(id))
    );
  };

  const totalPages = Math.ceil(totalSize / pageSize);
  const paginationOptions = {
    page: currentPage,
    sizePerPage: pageSize,
    totalSize: totalSize,
    onPageChange: handlePageChange,
     
  };
  
  console.log(selectedRows );

  const rowStyle = (row, rowIndex) => {
    
    return {
      backgroundColor:'gray !important',
      height: '60px',
    };
  };
  
   

  return (
    <>
      <input
        type="text"
        placeholder="Enter Value ..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="search-icon"
      />
      <button
        className={`global-delete ${selectedRows.length > 0 ? "active" : ""}`}
        onClick={() => handleDelete(selectedRows)}
      >
        <FontAwesomeIcon className="gdelete" icon={faTrash} />
      </button>

      <div className="pagination-container">
        <BootstrapTable
          bootstrap4
          keyField="id"
          data={filteredData}
          columns={columns}
          selectRow={selectRow}
          bordered={false}
          pagination={paginationFactory(paginationOptions)}
          rowStyle={rowStyle}
          
        />
       
        <div className="row-count">
          {selectedRows.length} of {data.length} rows(s) selected
        </div>

        <div className="page-no">
          Page {currentPage} of {totalPages}
        
        </div>
      </div>
    </>
  );
};

export default TableComponent;
