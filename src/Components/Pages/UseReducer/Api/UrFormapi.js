


import React, { useReducer, useEffect } from "react";
import { Button } from "react-bootstrap";
import { createEmployee, fetchEmployeeById, updateEmployee } from "../../../../Services/Api";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaAngleDoubleLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { actionTypes } from "../../../../Hooks/Action/Action";
import { initialState, reducer } from "../../../../Hooks/Reducer/ApiReducer";
import { Password } from 'primereact/password';
import "./css/Form.css"
import Loader from "../../../../Layout/Loader";

function Usereducercreate() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const router = useParams();

  const nameRegex = /^[a-zA-Z ]{3,30}$/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneRegex = /^\d{10}$/;
  const passwordRegex =
    /^(?=[a-zA-Z0-9#@$?]{8,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*/;
  const dobRegex = /^\d{4}-\d{2}-\d{2}/;

  useEffect(() => {
    if (router.id) {
      getId(router.id);
      setIsEditing(true);
    }
  }, [router.id]);

  const setIsEditing = (editing) => {
    dispatch({ type: actionTypes.SET_IS_EDITING, value: editing });
  };

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "name":
        if (!value) {
          error = "Name is required*";
        } else if (!nameRegex.test(value)) {
          error = "Invalid Name format*";
        }
        break;
      case "email":
        if (!value) {
          error = "Email is required*";
        } else if (!emailRegex.test(value)) {
          error = "Invalid Email format*";
        }
        break;
      case "phone":
        if (!value) {
          error = "Phone Number is required*";
        } else if (!phoneRegex.test(value)) {
          error = "Invalid Phone Number format*";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required*";
        } else if (!passwordRegex.test(value)) {
          error = "Invalid Password format*";
        }
        break;
      case "cpass":
        if (!value) {
          error = "Confirm password is required*";
        } else if (value !== state.formData.password) {
          error = "Passwords do not match*";
        }
        break;
      case "language":
        if (!value) {
          error = "Please select a language*";
        }
        break;
      case "gender":
        if (!value) {
          error = "Please select a gender*";
        }
        break;
      case "dob":
        if (!value) {
          error = "Date of Birth is required*";
        } else if (!dobRegex.test(value)) {
          error = "Invalid Date of Birth format*";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleFieldChange = (field, value) => {
    dispatch({ type: actionTypes.SET_FIELD, field, value });
    const errors = { ...state.errors };
    errors[field] = validateField(field, value);
    dispatch({ type: actionTypes.SET_ERRORS, errors });
  };

  const validateForm = () => {
    const { formData } = state;
    const errors = {};

    for (const field in formData) {
      const value = formData[field];
      errors[field] = validateField(field, value);
    }

    const isFormValid = Object.values(errors).every((error) => !error);

    dispatch({ type: actionTypes.SET_ERRORS, errors });

    return isFormValid;
  };

  const postData = async () => {
    dispatch({ type: actionTypes.SET_LOADING, value: true });
    try {
      await createEmployee(state.formData);
      toast.success("User Data created successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log("Posted Data:", state.formData);
    } catch (error) {
      toast.error("Error in the POST API", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, value: false });
    }
    navigate("/UrListapi");
  };



  const updateuser = async () => {
    const isvalid = validateForm();
    if (!isvalid) {
      toast.error("Enter the Required Fields", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    try {
      await updateEmployee(state.formData.id, state.formData);
      toast.success("User Data Updated successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      navigate("/UrListapi");
    } catch (error) {
      toast.error("Error in the UPDATE API", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const getId = async (id) => {
    dispatch({ type: actionTypes.SET_LOADING, value: true });
    try {
      const userdata = await fetchEmployeeById(id);
      dispatch({ type: actionTypes.SET_FIELD, field: "id", value: userdata.id });
      dispatch({ type: actionTypes.SET_FIELD, field: "name", value: userdata.name });
      dispatch({ type: actionTypes.SET_FIELD, field: "email", value: userdata.email });
      dispatch({ type: actionTypes.SET_FIELD, field: "phone", value: userdata.phone });
      dispatch({ type: actionTypes.SET_FIELD, field: "password", value: userdata.password });
      dispatch({ type: actionTypes.SET_FIELD, field: "cpass", value: userdata.cpass });
      dispatch({ type: actionTypes.SET_FIELD, field: "language", value: userdata.language });
      dispatch({ type: actionTypes.SET_FIELD, field: "gender", value: userdata.gender });
      dispatch({ type: actionTypes.SET_FIELD, field: "dob", value: userdata.dob });
    } catch (error) {
      dispatch({ type: actionTypes.SET_FIELD, field: "id", value: "" });
      dispatch({ type: actionTypes.SET_FIELD, field: "name", value: "" });
      dispatch({ type: actionTypes.SET_FIELD, field: "email", value: "" });
      dispatch({ type: actionTypes.SET_FIELD, field: "phone", value: "" });
      dispatch({ type: actionTypes.SET_FIELD, field: "password", value: "" });
      dispatch({ type: actionTypes.SET_FIELD, field: "cpass", value: "" });
      dispatch({ type: actionTypes.SET_FIELD, field: "language", value: "" });
      dispatch({ type: actionTypes.SET_FIELD, field: "gender", value: "" });
      dispatch({ type: actionTypes.SET_FIELD, field: "dob", value: "" });
      toast.error("Error in the GET_ID API", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, value: false });
    }
  };

  const handleLanguageChange = (event) => {
    dispatch({
      type: actionTypes.SET_FIELD,
      field: "language",
      value: event.target.value,
    });
  };




  const handleClick = () => {
    if (state.isEditing) {
      updateuser();
    } else {
      const isvalid = validateForm();
      if (!isvalid) {
        toast.error("Enter the Required Fields", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }
      postData();
    }
  };


  return (
    <div>
      <div className="main-container w-75 mx-auto">
        {state.isLoading && (
          <Loader />
        )}
        {!state.isLoading && (
                <section className="ftco-section">
            <div className="d-flex justify-content-start">
              <Link to="/UrListapi">
                <Button className="rounded-pill" variant="primary">
                  {" "}
                  <FaAngleDoubleLeft className="me-2 mb-1" />
                  Table
                </Button>
              </Link>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-6 text-center mb-5">
                <h2 className="heading-section">USEREDUSE FORM API</h2>
              </div>
            </div>
            <div className="col-md-12">
              <div className="wrapper">

                <div className="row no-gutters">
                  <div className="col-md-7">
                    <div className="contact-wrap w-100 p-md-5 p-4">
                      <div id="form-message-warning" className="mb-4"></div>
                      <div id="form-message-success" className="mb-4">
                        Your message was sent, thank you!
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="fw-bold">
                              Name <span className="text-danger">*</span>
                            </label>
                            <input
                              className={`form-control ${state.errors.name ? "is-invalid" : state.formData.name ? "is-valid" : ""
                                }`}
                              name="name"
                              value={state.formData.name}
                              onChange={(event) => handleFieldChange("name", event.target.value)}
                              placeholder="Enter your Name"
                              required
                            />
                            <p className="error-message text-danger fw-bold text-danger fw-bold">{state.errors.name}</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="fw-bold">
                              E-Mail <span className="text-danger">*</span>
                            </label>
                            <input
                              className={`form-control ${state.errors.email ? "is-invalid" : state.formData.email ? "is-valid" : ""
                                }`}
                              name="email"
                              value={state.formData.email}
                              onChange={(event) => handleFieldChange("email", event.target.value)}
                              placeholder="Enter your Email"
                              required
                            />
                            <p className="error-message text-danger fw-bold">{state.errors.email}</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="fw-bold">
                              Phone Number <span className="text-danger">*</span>
                            </label>
                            <input
                              className={`form-control ${state.errors.phone ? "is-invalid" : state.formData.phone ? "is-valid" : ""
                                }`}
                              name="phone"
                              value={state.formData.phone}
                              onChange={(event) => handleFieldChange("phone", event.target.value)}
                              placeholder="Enter your Phone Number"
                              required
                            />
                            <p className="error-message text-danger fw-bold">{state.errors.phone}</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="fw-bold">
                              Date of Birth <span className="text-danger">*</span>
                            </label>
                            <input
                              className={`form-control ${state.errors.dob ? "is-invalid" : state.formData.dob ? "is-valid" : ""
                                }`}
                              type="date"
                              name="dob"
                              value={state.formData.dob}
                              onChange={(event) => handleFieldChange("dob", event.target.value)}
                              placeholder="Date Of Birth"
                              required
                            />
                            <p className="error-message text-danger fw-bold">{state.errors.dob}</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="fw-bold">
                              Password <span className="text-danger">*</span>
                            </label>
                            <div className="input-field-wrapper">
                              <Password
                                className={` ${state.errors.password ? "is-invalid" : state.formData.password ? "is-valid" : ""
                                  }`}
                                name="password"
                                type={state.showPassword ? "text" : "password"}
                                value={state.formData.password}
                                onChange={(event) => handleFieldChange("password", event.target.value)}
                                placeholder="Enter your Password"
                                required toggleMask
                              />
                              <p className="error-message text-danger fw-bold">{state.errors.password}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="fw-bold">
                              Confirm Password <span className="text-danger">*</span>
                            </label>
                            <div className="input-field-wrapper">
                              <Password
                                className={` ${state.errors.cpass ? "is-invalid" : state.formData.cpass ? "is-valid" : ""
                                  }`}
                                name="cpass"
                                type={state.showPassword ? "text" : "password"}
                                value={state.formData.cpass}
                                onChange={(event) => handleFieldChange("cpass", event.target.value)}
                                placeholder="Confirm your Password"
                                required toggleMask
                              />
                              <p className="error-message text-danger fw-bold">{state.errors.cpass}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 ml-2">
                          <div className="form-group">
                            <label className="fw-bold">
                              Language <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`form-control ${state.errors.language ? "is-invalid" : state.formData.language ? "is-valid" : ""
                                }`}
                              name="language"
                              value={state.formData.language}
                              onChange={handleLanguageChange}
                              required
                            >
                              <option value="">-- Select Language --</option>
                              <option value="Tamil">Tamil</option>
                              <option value="English">English</option>
                              <option value="Spanish">Spanish</option>
                              <option value="French">French</option>
                              <option value="Other">Other</option>
                            </select>
                            <p className="error-message text-danger fw-bold">{state.errors.language}</p>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label className="fw-bold mb-3">
                              Gender <span className="text-danger">*</span>
                            </label>
                            <div className="radio-group">
                              <label className="me-2">
                                <input
                                  type="radio"
                                  name="gender"
                                  value="Male"
                                  checked={state.formData.gender === "Male"}
                                  onChange={(event) => handleFieldChange("gender", event.target.value)}
                                  required
                                />{" "}
                                Male
                              </label>
                              <label className="me-2">
                                <input
                                  type="radio"
                                  name="gender"
                                  value="Female"
                                  checked={state.formData.gender === "Female"}
                                  onChange={(event) => handleFieldChange("gender", event.target.value)}
                                  required
                                />{" "}
                                Female
                              </label>
                              <label className="me-2">
                                <input
                                  type="radio"
                                  name="gender"
                                  value="Others"
                                  checked={state.formData.gender === "Others"}
                                  onChange={(event) => handleFieldChange("gender", event.target.value)}
                                  required
                                />{" "}
                                Others
                              </label>
                            </div>
                            <p className="error-message text-danger fw-bold">{state.errors.gender}</p>
                          </div>
                        </div>
                        <div className="d-flex justify-content-center">
                          <div className="">
                            <Button className="rounded-pill" onClick={handleClick}>
                              {state.isEditing ? "Update" : "Submit"}
                            </Button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                  <div className="col-md-5 d-flex align-items-stretch">
                    <div className=" lion info-wrap w-100 p-5 img" >
                    </div>

                  </div>
                </div>
              </div>

            </div>
            <div className="row mb-5 mt-5">
              <div className="col-md-3">
                <div className="dbox w-100 text-center">
                  <div className="icon d-flex align-items-center justify-content-center">
                    <span className="pi pi-map-marker "></span>
                  </div>
                  <div className="text">
                    <p><span>Address:</span> 198 West 21th Street, Suite 721 New York NY 10016</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="dbox w-100 text-center">
                  <div className="icon d-flex align-items-center justify-content-center">
                    <span className="pi pi-phone "></span>
                  </div>
                  <div className="text">
                    <p><span>Phone:</span> <a href="tel://1234567920">+ 1235 2355 98</a></p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="dbox w-100 text-center">
                  <div className="icon d-flex align-items-center justify-content-center">
                    <span className="pi pi-telegram"></span>
                  </div>
                  <div className="text">
                    <p><span>Email:</span> <a href="mailto:info@yoursite.com">info@yoursite.com</a></p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="dbox w-100 text-center">
                  <div className="icon d-flex align-items-center justify-content-center">
                    <span className="pi pi-globe "></span>
                  </div>
                  <div className="text">
                    <p><span>Website</span></p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Usereducercreate;

