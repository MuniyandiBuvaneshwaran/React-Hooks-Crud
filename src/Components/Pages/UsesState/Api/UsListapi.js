import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressBar } from "primereact/progressbar";
import { deleteEmployee, fetchEmployeeData } from "../../../../Services/Api";
import { Link } from "react-router-dom";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Dialog } from "primereact/dialog";
import {  FaTrashAlt } from "react-icons/fa";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "primereact/tooltip";


function UseStateList() {
  const [apiData, setAPIData] = useState([]);
  const [loading, setLoading] = useState(false);
  const dt = useRef(null);
  const [rowClick] = useState(true);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteSelectedDialogVisible, setDeleteSelectedDialogVisible] =
    useState(false);

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default();

        const tableData = apiData.map((pdf) => [
          pdf.id,
          pdf.name,
          pdf.email,
          pdf.phone,
          pdf.password,
          pdf.cpass,
          pdf.language,
          pdf.gender,
          pdf.dob,
        ]);

        const tableColumns = [
          "ID",
          "Name",
          "E-mail",
          "Phone",
          "Password",
          "Confirm Password",
          "Language",
          "Gender",
          "Date of Birth",
        ];

        doc.autoTable({
          head: [tableColumns],
          body: tableData,
        });

        doc.save("apiData.pdf");
      });
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(apiData);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "products");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "export" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  const ClearFilter = () => {
    dt.current.reset();
  };

 

  const navigate = useNavigate();
  const routeChange = () => {
    let path = "/UsFormapi";
    navigate(path);
  };

  const callGetAPI = async () => {
    try {
      setLoading(true);
      const employeeData = await fetchEmployeeData();
      setLoading(false);
      setAPIData(employeeData);
      console.log("Employee Data:", employeeData);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    callGetAPI();
  }, []);

  const deleteUserHandler = (user) => {
    setDeleteTarget(user);
    setDeleteDialogVisible(true);
  };

  // const confirmDelete = async () => {
  //   if (deleteTarget) {
  //     try {
  //       const res = await deleteEmployee(deleteTarget.id);
  //       console.log(res);

  //       callGetAPI();
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setDeleteTarget(null);
  //       setDeleteDialogVisible(false);
  //     }
  //   }
  // };

  const confirmDelete = async () => {
  
    if (deleteTarget) {
      try {
        const res = await deleteEmployee(deleteTarget.id);
        console.log(res);
        console.log(res.status);
        console.log(selectedProducts);
        if (res.status === 200 || res.status === 201) {
          console.log(selectedProducts);
          setSelectedProducts(
            selectedProducts.filter((res) => res.id !== deleteTarget.id)
          );
        }
        console.log(selectedProducts);
        toast.error("User Data Deleted Successfully !!!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        callGetAPI();
      } catch (error) {
        console.error(error);
      } finally {
        setDeleteTarget(null);
        setDeleteDialogVisible(false);
      }
    }
  };

  const deleteSelectedUsers = async () => {
    if (selectedProducts && selectedProducts.length > 0) {
      setDeleteSelectedDialogVisible(true);
    }
  };

  const confirmDeleteSelected = async () => {
    setDeleteSelectedDialogVisible(false);

    if (selectedProducts && selectedProducts.length > 0) {
      const selectedUserIds = selectedProducts.map((user) => user.id);
      try {
        const res = await Promise.all(selectedUserIds.map(deleteEmployee));
        console.log(res);

        callGetAPI();
        setSelectedProducts([]);
      } catch (error) {}
    }
  };

  const renderHeader = () => {
    return (
      <div className="d-md-flex justify-content-between">
        <div>
          <h3>User Details</h3>
        </div>
        <div>
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            className="me-4"
            outlined
            onClick={ClearFilter}
          />
          <span className="p-input-icon-left hs">
            <i className="pi pi-search" />
            <InputText
              type="search"
              onInput={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
            />
          </span>
        </div>
      </div>
    );
  };
  const header = renderHeader();

  return (
    <div className="text-center pt-2 col-10 mx-auto">
       
      <div className="container mt-5 datatable-responsive">
        {loading && <ProgressBar mode="indeterminate" />}
        <Tooltip target=".export-buttons>button" position="bottom" />
        <div className="border p-2 p-md-4 shadow d-md-flex justify-content-between">
          <div className="d-flex justify-content-between ">
            <div>
              <Button
                label="+ New"
                severity="success"
                className="ms-0"
                onClick={routeChange}
              />
            </div>
            <div className="flex flex-wrap gap-2 ms-2">
              <div>
                <Button
                  onClick={deleteSelectedUsers}
                  className="p-button p-button-danger"
                  disabled={!selectedProducts || selectedProducts.length === 0}
                >
                  <FaTrashAlt />
                  <span className="ms-1">Delete </span>
                </Button>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center mt-2 mt-md-0">
            <Button
              type="button"
              icon="pi pi-file"
              className="me-2"
              rounded
              onClick={() => exportCSV(false)}
              data-pr-tooltip="CSV"
            />
            <Button
              type="button"
              icon="pi pi-file-excel"
              className="me-2"
              severity="success"
              rounded
              onClick={exportExcel}
              data-pr-tooltip="XLS"
            />
            <Button
              type="button"
              icon="pi pi-file-pdf"
              severity="warning"
              rounded
              onClick={exportPdf}
              data-pr-tooltip="PDF"
            />
          </div>
        </div>

        <DataTable
          ref={dt}
          className="mt-3 card shadow"
          value={apiData.data}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          columnResizeMode="expand"
          resizableColumns
          showGridlines
          header={header}
          dataKey="id"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          tableStyle={{ minWidth: "50rem" }}
          selectionMode={rowClick ? null : "checkbox"}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          globalFilter={globalFilter}
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          <Column
            field="name"
            header="Name"
            sortable
            filter
            filterPlaceholder="Search by name"
            style={{ width: "25%" }}
          />
          <Column
            field="email"
            header="E-mail"
            sortable
            filter
            filterPlaceholder="Search by email"
            style={{ width: "25%" }}
          />
          <Column
            field="phone"
            header="Phone"
            sortable
            filter
            filterPlaceholder="Search by Phone"
            style={{ width: "25%" }}
          />
          <Column
            field="password"
            header="Password"
            sortable
            filter
            filterPlaceholder="Search by Password"
            style={{ width: "25%" }}
          />
          <Column
            field="cpass"
            header="Confirm Password"
            sortable
            filter
            filterPlaceholder="Search by Confirm Password"
            style={{ width: "25%" }}
          />
          <Column
            field="language"
            header="Language"
            sortable
            filter
            filterPlaceholder="Search by Language"
            style={{ width: "25%" }}
          />
          <Column
            field="gender"
            header="Gender"
            sortable
            filter
            filterPlaceholder="Search by gender"
            style={{ width: "25%" }}
          />
          <Column
            field="dob"
            header="Date of Birth"
            sortable
            filter
            filterPlaceholder="Search by dob"
            style={{ width: "25%" }}
          />
          <Column
            body={(rowData) => (
              <>
                <Link to={`/UsFormapi/${rowData.id}`}>
                <Button icon="pi pi-pencil" rounded aria-label="Filter" >
                    
                  </Button>
                </Link>
                <Button
                  onClick={() => deleteUserHandler(rowData)}
                  icon="pi pi-times" className="p-button-rounded p-button-danger mx-2" aria-label="Cancel"              >
                </Button>
              </>
            )}
            header="Actions"
            sortable
            style={{ width: "25%" }}
          />
        </DataTable>
      </div>
      <Dialog
        visible={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        header="Confirm Deletion"
        footer={
          <div>
            <Button
              label="No"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setDeleteDialogVisible(false)}
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              className="p-button-danger"
              onClick={confirmDelete}
            />
          </div>
        }
      >
        {deleteTarget && (
          <p>
            Are you sure you want to delete the user{" "}
            <strong>{deleteTarget.name}</strong>?
          </p>
        )}
      </Dialog>
      <Dialog
        visible={deleteSelectedDialogVisible}
        onHide={() => setDeleteSelectedDialogVisible(false)}
        header="Confirm Deletion"
        footer={
          <div>
            <Button
              label="No"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setDeleteSelectedDialogVisible(false)}
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              className="p-button-danger"
              onClick={confirmDeleteSelected}
            />
          </div>
        }
      >
        <p>
          Are you sure.Do you want to delete the selected User's Information?
        </p>
      </Dialog>
    </div>
  );
}

export default UseStateList;