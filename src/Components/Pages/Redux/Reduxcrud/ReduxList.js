import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setSearchText, deletedata, getdata, addEmployeeSuccess } from '../Actions/Actions'; // Update with the correct path
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";
import { useEffect } from "react";
import { v4 as uuidv4 } from 'uuid'; // Import the uuid library

const EmployeeList = () => {
    const navigate = useNavigate();
    const dt = useRef(null);
    const  employees = useSelector((state) => state.reducer);
    const dispatch = useDispatch();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [rowClick] = useState(true);
    const [state, setState] = useState({
        deleteDialogVisible: false,
        deleteSelectedDialogVisible: false,
        deleteTarget: null,
    });
    const [globalSearchText, setGlobalSearchText] = useState("");
    const [selectindex, setSelectedIndex] = useState("");

    const Calldata = async () => { 
        await getdata();
    };
    useEffect(() => {
        Calldata();
    }, []);
    const handleEditClick = () => {
        navigate(`/ReduxForm/`);
    };

    

    const clearFilters = () => {
        dt.current.reset();
    };

    const handleSearch = (e) => {
        dispatch({ type: "SET_SEARCH_TEXT", employees: e.target.value });
        setGlobalSearchText(e.target.value);
    };

    const filteredData = employees.employees.filter((row) => {
        const searchText = globalSearchText.toLowerCase();
        return (
            row.name.toLowerCase().includes(searchText) ||
            row.email.toLowerCase().includes(searchText) ||
            row.phone.toLowerCase().includes(searchText) ||
            row.password.toLowerCase().includes(searchText) ||
            row.cpass.toLowerCase().includes(searchText) ||
            row.language.toLowerCase().includes(searchText) ||
            row.dob.toLowerCase().includes(searchText) ||
            row.gender.toLowerCase().includes(searchText)
        );
    });

    const confirmDelete = async () => {
        if (state.deleteTarget) {
            const employeeId = state.deleteTarget.id;
            try {
                dispatch(deletedata(employeeId));
                setSelectedProducts([]);
                setState({ ...state, deleteDialogVisible: false });
                toast.success("User Deleted Successfully !!!", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error("Error deleting user.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        }
    };

    const confirmDeleteSelected = () => {
        setState({ ...state, deleteSelectedDialogVisible: true });
    };

    const deleteSelectedUsers = async () => {
        const selectedEmployeeIds = selectedProducts.map((employee) => employee.id);

        if (selectedEmployeeIds.length > 0) {
            try {
                const deletePromises = selectedEmployeeIds.map(async (employeeId) => {
                    await deletedata(employeeId);
                });
                await Promise.all(deletePromises);

                const remainingProducts = selectedProducts.filter((employee) => !selectedEmployeeIds.includes(employee.id));
                setSelectedProducts(remainingProducts);

                setState({ ...state, deleteSelectedDialogVisible: false });
                toast.success("Selected Users Deleted Successfully !!!", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            } catch (error) {
                console.error("Error deleting selected users:", error);
                toast.error("Error deleting selected users.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        } else {
            toast.warning("No users selected for deletion.", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    const exportPdf = () => {
        import("jspdf").then((jsPDF) => {
            import("jspdf-autotable").then((autoTable) => {
                const doc = new jsPDF.default();
                doc.autoTable({
                    head: [
                        [
                            "Name",
                            "E-mail",
                            "Phone",
                            "Password",
                            "Confirm Password",
                            "Language",
                            "Gender",
                            "Date of Birth",
                        ],
                    ],
                    body: employees.employees.map((row) => [
                        row.name,
                        row.email,
                        row.phone,
                        row.password,
                        row.cpass,
                        row.language,
                        row.gender,
                        row.dob,
                    ]),
                });

                doc.save("Student Details.pdf");
            });
        });
    };

    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(employees.employees);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "User Data");
        XLSX.writeFile(workbook, "UserDetails.xlsx");
    };

    const header = (
        <div className="d-md-flex justify-content-between gap-2">
            <div>
                <h3>User Details</h3>
            </div>
            <div className="d-md-flex">
                <div className="my-auto">
                    <Button
                        onClick={clearFilters}
                        className="pi pi-filter-slash p-button-outlined me-3 p-2"
                    >
                        <span className="ms-2">Clear</span>
                    </Button>
                </div>
                <div className="me-2">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText
                            value={employees.searchText}
                            onChange={handleSearch}
                            placeholder="Keyword Search"
                        />
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="text-center col-10 mx-auto  mt-5">
            <h1 className="mb-5">Employee List</h1>
            <div className="d-md-flex border shadow justify-content-between p-3 my-3">
                <div className="d-flex justify-content-center">
                    <div>
                        <Link to="/ReduxForm">
                            <Button className="p-button p-button-success  me-2">
                                <span>New</span>
                            </Button>
                        </Link>
                    </div>
                    <div>
                        <Button
                            onClick={confirmDeleteSelected}
                            className="p-button p-button-danger"
                            disabled={!selectedProducts || selectedProducts.length === 0}
                        >
                            <FaTrashAlt className="me-2" />
                            <span>Delete</span>
                        </Button>
                    </div>
                </div>

                <div className="d-flex justify-content-center mt-2 mt-md-0">
                    <Button
                        label=""
                        type="button"
                        className="mx-1 export-buttons"
                        icon="pi pi-file-pdf "
                        rounded
                        severity="warning"
                        onClick={() => exportPdf(false)}
                        data-pr-tooltip="Export to PDF"
                    />
                    <Button
                        label=""
                        type="button"
                        className="mx-1 export-buttons"
                        icon="pi pi-file-excel"
                        rounded
                        onClick={exportExcel}
                        data-pr-tooltip="Export to Excel"
                    />
                </div>
            </div>
            <Tooltip target=".export-buttons>button" position="bottom" />

            <div className="datatable">
                <DataTable
                    ref={dt}
                    value={filteredData}
                    paginator
                    header={header}
                    rows={5}
                    className="card shadow mb-5"
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    columnResizeMode="expand"
                    resizableColumns
                    showGridlines
                    selectionMode={rowClick ? null : "checkbox"}
                    selection={selectedProducts}
                    onSelectionChange={(e) => setSelectedProducts(e.value)}
                    dataKey="id"
                    tableStyle={{ minWidth: "50rem" }}
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
                        header="Email"
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
                        filterPlaceholder="Search by phone"
                        style={{ width: "25%" }}
                    />
                    <Column
                        field="password"
                        header="Password"
                        sortable
                        filter
                        filterPlaceholder="Search by password"
                        style={{ width: "25%" }}
                    />
                    <Column
                        field="cpass"
                        header="Confirm Password"
                        sortable
                        filter
                        filterPlaceholder="Search by cpass"
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
                        field="language"
                        header="Language"
                        sortable
                        filter
                        filterPlaceholder="Search by language"
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
                        body={(rowData) => (
                            <>
                                <div key={rowData.id}></div>
                                <Link to={`/ReduxForm/${rowData.id}`}>
                                    <Button
                                        onClick={() => handleEditClick(rowData.id)}
                                        icon={<FaPencilAlt />}
                                        className="p-button p-button-warning mx-2"
                                        rounded
                                    />
                                </Link>
                                <Button
                                    onClick={() =>
                                        setState({
                                            ...state,
                                            deleteDialogVisible: true,
                                            deleteTarget: rowData,
                                        })
                                    }
                                    icon={<FaTrashAlt />}
                                    rounded
                                    className="p-button p-button-danger"
                                />
                            </>
                        )}
                        header="Actions"
                    />
                </DataTable>
            </div>

            <Dialog
                visible={state.deleteDialogVisible}
                onHide={() =>
                    setState({ ...state, deleteDialogVisible: false, deleteTarget: null })
                }
                header="Confirm Deletion"
                footer={
                    <div>
                        <Button
                            label="No"
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() =>
                                setState({
                                    ...state,
                                    deleteDialogVisible: false,
                                    deleteTarget: null,
                                })
                            }
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
                {state.deleteTarget && (
                    <p>
                        Are you sure you want to delete the user{" "}
                        <strong>{state.deleteTarget.name}</strong>?
                    </p>
                )}
            </Dialog>

            <Dialog
                visible={state.deleteSelectedDialogVisible}
                onHide={() =>
                    setState({ ...state, deleteSelectedDialogVisible: false })
                }
                header="Confirm Deletion"
                footer={
                    <div>
                        <Button
                            label="No"
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() =>
                                setState({ ...state, deleteSelectedDialogVisible: false })
                            }
                        />
                        <Button
                            label="Yes"
                            icon="pi pi-check"
                            className="p-button-danger"
                            onClick={deleteSelectedUsers}
                        />
                    </div>
                }
            >
                <p>Are you sure you want to delete the selected users?</p>
            </Dialog>
        </div>
    );
};

export default EmployeeList;
