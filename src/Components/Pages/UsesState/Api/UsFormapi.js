
import React, { useState, useEffect } from "react";
import {
  createEmployee,
  fetchEmployeeById,
  updateEmployee,
} from "../../../../Services/Api";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
// import { Dna } from "react-loader-spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Mainanimation/styles.css"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { InputText } from "primereact/inputtext";
import Loader from "../../../../Layout/Loader";

function UseStateForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [cpass, setCpass] = useState("");
  const [language, setLanguage] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const router = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showcpass, setShowCpass] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [cpassError, setCpassError] = useState("");
  const [languageError, setLanguageError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [dobError, setDobError] = useState("");

  const routeChange = () => {
    let path = `/Uslistapi`;
    navigate(path);
  };

  const nameRegex = /^[a-zA-Z ]{2,30}$/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneRegex = /^\d{10}$/;
  const passwordRegex =
    /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/;
  const dobRegex = /^\d{4}-\d{2}-\d{2}/;

  const handleFieldChange = (event, regex, errorSetter) => {
    const value = event.target.value;
    if (!value) {
      errorSetter(`${event.target.name} is Required*`);
    } else if (typeof regex === "function" && !regex(value)) {
      errorSetter(`Invalid ${event.target.names} format*`);
    } else if (regex instanceof RegExp && !regex.test(value)) {
      errorSetter(`Invalid ${event.target.name} format*`);
    } else {
      errorSetter("");
    }
  };

  const validateForm = () => {
    let valid = true;

    handleFieldChange(
      { target: { name: "Name", value: name } },
      nameRegex,
      setNameError
    );
    handleFieldChange(
      { target: { names: "Email", value: email } },
      emailRegex,
      setEmailError
    );
    handleFieldChange(
      { target: { name: "Phone Number", value: phone } },
      phoneRegex,
      setPhoneError
    );
    handleFieldChange(
      { target: { name: "Password", value: password } },
      passwordRegex,
      setPasswordError
    );

    if (!cpass) {
      setCpassError("Confirm password is Required*");
      valid = false;
    } else if (cpass !== password) {
      setCpassError("Passwords do not match*");
      valid = false;
    } else {
      setCpassError("");
    }

    if (!language) {
      setLanguageError("Please select a language*");
      valid = false;
    } else {
      setLanguageError("");
    }

    if (!gender) {
      setGenderError("Please select a gender*");
      valid = false;
    } else {
      setGenderError("");
    }

    handleFieldChange(
      { target: { name: "Date of Birth", value: dob } },
      dobRegex,
      setDobError
    );

    return valid;
  };
  const postData = async () => {
    const isValid = validateForm();

    if (!isValid) {
      toast.error("Please give the Required* information.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    const employeeData = {
      name,
      email,
      phone,
      password,
      cpass,
      language,
      gender,
      dob,
    };
    try {
      setLoading(true);
      const newEmployee = await createEmployee(employeeData);
      setLoading(false);
      console.log("New Employee Created:", newEmployee);
      toast.success("UserData Submitted Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      navigate("/UsListapi");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const getId = async (id) => {
    try {
      const employeeData = await fetchEmployeeById(id);
      setId(employeeData.id);
      setName(employeeData.name);
      setEmail(employeeData.email);
      setPhone(employeeData.phone);
      setPassword(employeeData.password);
      setCpass(employeeData.cpass);
      setLanguage(employeeData.language);
      setGender(employeeData.gender);
      setDob(employeeData.dob);
    } catch (error) {
      console.error("Error fetching employee by ID:", error);
    }
  };
  const updateUser = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        const updatedEmployee = await updateEmployee(id, {
          name,
          email,
          phone,
          password,
          cpass,
          language,
          gender,
          dob,
        });
        setLoading(false);
        console.log("Updated Employee:", updatedEmployee);
        toast.success("UserData Updated Successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/UsListapi");
      } catch (error) {
        console.error("Error updating employee:", error);
      }
    }
  };

  useEffect(() => {
    console.log(router.id);
    if (router.id) {
      getId(router.id);
      setIsEditing(true);
    } 
  }, [router.id]);

  const handleClick = () => {
    if (isEditing) {
      updateUser();
    } else {
      postData();
    }
  };

  return (
    <div className="spinner-wrapper">
      {loading ? (
       <Loader/>
      ) : (
        <div className=" down  d-flex justify-content-center flex-column bgs mx-auto ">
          <div className=" mb-5 d-none d-lg-flex ">.</div>
            <div className=" mb-5 d-none d-lg-flex ">.</div>
          <div className=" down justify-content-start d-flex">
            
            <button onClick={routeChange} className="pt-5 down">
              <span className="box"> Table</span>
            </button>
          </div>
          <div className=" buvi container mb-5 col-md-8   p-5 mt-5 shadow">
          <div class="contact-image">
          <img src="https://image.ibb.co/kUagtU/rocket_contact.png" alt="rocket_contact" />
        </div>
            <div className="row mt-3">
              <div className="col-md-6 mx-auto">
             
                <label htmlFor="in" className="fw-bold text-dark">Name :</label>
                <InputText
                placeholder="Name"
                  className={`mt-2 form-control ${
                    nameError ? "is-invalid" : name ? "is-valid" : ""
                  }`}
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    handleFieldChange(e, nameRegex, setNameError);
                  }}
                />

                <p className="error text-danger fw-bold">{nameError}</p>
              </div>
              <div className="col-md-6">
                <label className="fw-bold mb-2 text-dark">E-mail :</label>
                <InputText
                  type="email"
                  className={`form-control ${
                    emailError ? "is-invalid" : email ? "is-valid" : ""
                  }`}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    handleFieldChange(e, emailRegex, setEmailError);
                  }}
                />

                <p className="error text-danger fw-bold  ">{emailError}</p>
              </div>
              <div className="col-md-6">
                <label className="fw-bold mb-2 text-dark"> Phone Number :</label>
                <InputText
                  type="number"
                  className={`form-control ${
                    phoneError ? "is-invalid" : phone ? "is-valid" : ""
                  }`}
                  placeholder="PhoneNumber"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    handleFieldChange(e, phoneRegex, setPhoneError);
                  }}
                />
                <p className="error text-danger fw-bold">{phoneError}</p>
              </div>

              <div className="col-md-6">
                <label className="fw-bold mb-2 text-dark">Password :</label>
                <div className="input-with-icon d-flex">
                 
                <InputText
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${
                      passwordError ? "is-invalid" : password ? "is-valid" : ""
                    }`}
                    placeholder="Password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      handleFieldChange(e, passwordRegex, setPasswordError);
                    }}
                  />
                  <button
                    className="btn p-1 border-0 show-hide-password-btn2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>

                </div>

                <p className="error text-danger fw-bold ">{passwordError}</p>
              </div>

              <div className="col-md-6">
                <label className="fw-bold mb-2 text-dark">Confirm-password :</label>
                <div className="input-with-icon">
                  <input
                    type={showcpass ? "text" : "password"}
                    className={`form-control ${
                      cpassError ? "is-invalid" : cpass ? "is-valid" : ""
                    }`}
                    placeholder="Confirm-Password"
                    autoComplete="new-password"
                    value={cpass}
                    onChange={(e) => {
                      setCpass(e.target.value);
                      handleFieldChange(
                        e,
                        (value) => value === password,
                        setCpassError
                      );
                    }}
                  />
                 
                  <button
                    className="btn p-1 border-0 show-hide-password-btn"
                    onClick={() => setShowCpass(!showcpass)}
                  >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>

                <p className="error text-danger fw-bold ">{cpassError}</p>
              </div>

              <div className="col-md-4">
                <label className="fw-bold mb-2 text-dark">Gender :</label>
                <div>
                  <label>
                    <input
                      type="radio"
                      value="Male"
                      className=""
                      checked={gender === "Male"}
                      onChange={(e) => {
                        setGender(e.target.value);
                      }}
                    />
                    <span className="ms-2 text-dark">Male</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="Female"
                      className="ms-2"
                      checked={gender === "Female"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <span className="ms-2 text-dark">Female</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="Transgender"
                      className="ms-2 "
                      checked={gender === "Transgender"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <span className="ms-2 text-dark">Others</span>
                  </label>
                </div>

                <p className="error text-danger fw-bold">{genderError}</p>
              </div>
              <div className="col-md-6">
                <label className="fw-bold mb-2 text-dark">Languages :</label>
                <select
                  value={language}
                  className={`form-control ${
                    languageError ? "is-invalid" : language ? "is-valid" : ""
                  }`}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                  }}
                >
                  <option value="">Select a language</option>
                  <option value="Tamil">Tamil</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Arabic">Arabic</option>
                  <option value="French">French</option>
                  <option value="Telungu">Telungu</option>
                </select>

                <p className="error text-danger fw-bold">{languageError}</p>
              </div>
              <div className="col-md-6">
                <label className="fw-bold mb-2 text-dark">Date of Birth :</label>
                <InputText
                  type="date"
                  className={`form-control ${
                    dobError ? "is-invalid" : dob ? "is-valid" : ""
                  }`}
                  placeholder="Date of Birth"
                  value={dob}
                  onChange={(e) => {
                    setDob(e.target.value);
                    handleFieldChange(e, dobRegex, setDobError);
                  }}
                />
                <p className="error text-danger fw-bold">{dobError}</p>
              </div>
            </div>
            <div>
            <button type="button" class="btn btn-warning" onClick={handleClick}>
              {isEditing ? "Update" : "Submit"}
            </button>
            </div>
           
          </div>
        </div>
      )}
    </div>
  );
}

export default UseStateForm;