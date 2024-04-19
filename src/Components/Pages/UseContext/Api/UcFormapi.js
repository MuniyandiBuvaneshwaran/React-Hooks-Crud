import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../../../Hooks/Reducer/Globalcontext";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import "../../UseReducer/Api/css/Form.css";
import { Link } from "react-router-dom";
import { FaAngleDoubleLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { Password } from 'primereact/password';
import Loader from "../../../../Layout/Loader";


const UcFormapi = () => {
  const { stateEmp, addEmployee, updateEmployees, getidEmployee } = useGlobalContext();
  const navigate = useNavigate();
  const { id } = useParams();
const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    cpass: "",
    language: "",
    gender: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const getid = async () => {
    await getidEmployee(id)
  }
  useEffect(() => {
    if (id) {
      getid();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (stateEmp.employeeId) {
      setFormData({
        name: stateEmp.employeeId.name,
        email: stateEmp.employeeId.email,
        phone: stateEmp.employeeId.phone,
        dob: stateEmp.employeeId.dob,
        password: stateEmp.employeeId.password,
        cpass: stateEmp.employeeId.cpass,
        language: stateEmp.employeeId.language,
        gender: stateEmp.employeeId.gender,
        id: stateEmp.employeeId.id
      });
    }
    console.log(stateEmp.employeeId)
  }, [stateEmp.employeeId])



  const nameRegex = /^[a-zA-Z ]{3,30}$/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneRegex = /^\d{10}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/;
  const dobRegex = /^\d{4}-\d{2}-\d{2}/;

  const validateForm = () => {
    const errors = {};

    // Validation logic for each field
    if (!formData.name) {
      errors.name = "Name is required*";
    } else if (!nameRegex.test(formData.name)) {
      errors.name = "Invalid name format*";
    }

    if (!formData.email) {
      errors.email = "Email is required*";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format*";
    }

    if (!formData.phone) {
      errors.phone = "Phone number is required*";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Invalid phone number format*";
    }

    if (!formData.password) {
      errors.password = "Password is required*";
    } else if (!passwordRegex.test(formData.password)) {
      errors.password = "Invalid password format*";
    }

    if (!formData.cpass) {
      errors.cpass = "Confirm Password is required*";
    } else if (formData.cpass !== formData.password) {
      errors.cpass = "Passwords do not match*";
    }

    if (!formData.language) {
      errors.language = "Language is required*";
    }

    if (!formData.gender) {
      errors.gender = "Gender is required*";
    }

    if (!formData.dob) {
      errors.dob = "Date of Birth is required*";
    } else if (!dobRegex.test(formData.dob)) {
      errors.dob = "Invalid Date of Birth format*";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0; // Form is valid if there are no errors
  };

  const handleFieldChange = (event, regex, fieldName) => {
    const value = event.target.value;

    // If a regex is provided, test the value against it
    if (regex && !regex.test(value)) {
      setFormErrors({
        ...formErrors,
        [fieldName]: `Invalid ${fieldName} format*`,
      });
    } else {
      setFormErrors({
        ...formErrors,
        [fieldName]: "", // Clear any previous errors for this field
      });
    }

    setFormData({
      ...formData,
      [fieldName]: value, // Update the form data with the new value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      try {
        if (id) {
          setLoading(true);
          await updateEmployees(formData);
          setLoading(false);
          toast.success("User Data Updated successfully", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          setLoading(true);
          await addEmployee(formData);
          setLoading(false);
          toast.success("User Data created successfully", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        navigate("/UcListapi");
      } catch (error) {
        toast.error(`Error in the ${id ? "UPDATE" : "POST"} API`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  return (
    <div>
      
      <div className="main-container w-75 mx-auto">
      {loading ? (
       <Loader/>
      ) : (
        <section className="ftco-section">
          <div className="row justify-content-center">
            <div className="d-flex justify-content-start">
              <Link to="/UcListapi">
                <Button className="rounded-pill" variant="primary">
                  <FaAngleDoubleLeft className="me-2 mb-1" />
                  Table
                </Button>
              </Link>
            </div>
            <div className="col-md-6 text-center mb-5">
              <h2 className="heading-section">USECONTEXT FORM API</h2>
            </div>
          </div>
          <div className="col-md-12">
            <div className="wrapper">
              <div className="row no-gutters">
                <div className="col-md-7">
                  <div className="contact-wrap w-100 p-md-5 p-4">
                    <form onSubmit={handleSubmit}>
                      <div className="col-md-6 mb-3 mx-auto">
                        <label htmlFor="name" className="fw-bold text-dark">
                          Name:
                        </label>
                        <input
                          className={`form-control ${formErrors.name ? "is-invalid" : ""
                            }`}
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={(event) => {
                            handleFieldChange(event, nameRegex, "name");
                          }}
                          placeholder="Enter your Name"
                        />
                        {formErrors.name && (
                          <div className="text-danger">{formErrors.name}</div>
                        )}
                      </div>
                      <div className="col-md-6 mb-3 mx-auto">
                        <label htmlFor="email" className="fw-bold text-dark">
                          Email:
                        </label>
                        <input
                          className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={(event) => {
                            handleFieldChange(event, emailRegex, "email");
                          }}
                          placeholder="Enter your Email"
                        />
                        {formErrors.email && (
                          <div className="text-danger">{formErrors.email}</div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3 mx-auto">
                        <label htmlFor="phone" className="fw-bold text-dark">
                          Phone:
                        </label>
                        <input
                          className={`form-control ${formErrors.phone ? "is-invalid" : ""}`}
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={(event) => {
                            handleFieldChange(event, phoneRegex, "phone");
                          }}
                          placeholder="Enter your Phone Number"
                        />
                        {formErrors.phone && (
                          <div className="text-danger">{formErrors.phone}</div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3 mx-auto">
                        <label htmlFor="dob" className="fw-bold text-dark">
                          Date of Birth:
                        </label>
                        <input
                          className={`form-control ${formErrors.dob ? "is-invalid" : ""}`}
                          type="date"
                          id="dob"
                          name="dob"
                          value={formData.dob}
                          onChange={(event) => {
                            handleFieldChange(event, dobRegex, "dob");
                          }}
                          placeholder="Enter your Date of Birth (yyyy-mm-dd)"
                        />
                        {formErrors.dob && (
                          <div className="text-danger">{formErrors.dob}</div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3 mx-auto">
                        <label htmlFor="password" className="fw-bold text-dark">
                          Password:
                        </label>
                        <Password
                          className={` ${formErrors.password ? "is-invalid" : ""}`}
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={(event) => {
                            handleFieldChange(event, passwordRegex, "password");
                          }}
                          placeholder="Enter your Password"
                          toggleMask
                        />
                        {formErrors.password && (
                          <div className="text-danger">{formErrors.password}</div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3 mx-auto">
                        <label htmlFor="cpass" className="fw-bold text-dark">
                          Confirm Password:
                        </label>
                        <Password
                          className={` ${formErrors.cpass ? "is-invalid" : ""}`}
                          type="password"
                          id="cpass"
                          name="cpass"
                          value={formData.cpass}
                          onChange={(event) => {
                            handleFieldChange(event, passwordRegex, "cpass");
                          }}
                          placeholder="Confirm your Password"
                          toggleMask
                        />
                        {formErrors.cpass && (
                          <div className="text-danger">{formErrors.cpass}</div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3 mx-auto">
                        <label htmlFor="language" className="fw-bold text-dark">
                          Language:
                        </label>
                        <select
                          className={`form-select ${formErrors.language ? "is-invalid" : ""}`}
                          id="language"
                          name="language"
                          value={formData.language}
                          onChange={(event) => {
                            handleFieldChange(event, null, "language");
                          }}
                        >
                          <option value="">Select your Language</option>
                          <option value="english">English</option>
                          <option value="spanish">Spanish</option>
                          <option value="french">French</option>
                        </select>
                        {formErrors.language && (
                          <div className="text-danger">{formErrors.language}</div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3 mx-auto">
                        <label className="fw-bold text-dark">Gender:</label>
                        <div className="form-check">
                          <input
                            className={`form-check-input ${formErrors.gender ? "is-invalid" : ""}`}
                            type="radio"
                            id="male"
                            name="gender"
                            value="male"
                            checked={formData.gender === "male"}
                            onChange={(event) => {
                              handleFieldChange(event, null, "gender");
                            }}
                          />
                          <label className="form-check-label" htmlFor="male">
                            Male 
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className={`form-check-input ${formErrors.gender ? "is-invalid" : ""}`}
                            type="radio"
                            id="female"
                            name="gender"
                            value="female"
                            checked={formData.gender === "female"}
                            onChange={(event) => {
                              handleFieldChange(event, null, "gender");
                            }}
                          />
                          <label className="form-check-label" htmlFor="female">
                            Female
                          </label>
                        </div>
                        {formErrors.gender && (
                          <div className="text-danger">{formErrors.gender}</div>
                        )}
                      </div>
                      <div className="col-md-2 container">
                        <button
                          type="submit"
                          className="btn btn-warning"
                          onClick={handleSubmit}
                        // disabled={Object.keys(formErrors).length > 0}
                        >
                          {id ? "Update" : "Submit"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-md-5 d-flex align-items-stretch">
                  <div className="lion info-wrap w-100 p-5 img"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      </div>
    </div>
  );
};

export default UcFormapi;
