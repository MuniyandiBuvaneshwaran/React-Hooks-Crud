import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom"; // Import the Link component

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState({
    name: "",
    position: "",
  });

  useEffect(() => {
    // Fetch employee data by ID when the component mounts
    axios
      .get(`https://650bf18d47af3fd22f66c04e.mockapi.io/apitask/${id}`)
      .then((response) => {
        setEmployeeData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Make an Axios PUT request to update the employee data
    axios
      .put(`https://650bf18d47af3fd22f66c04e.mockapi.io/apitask/${id}`, employeeData)
      .then(() => {
        navigate("/UcLIstapi"); // Redirect to the employee list page after successful update
      })
      .catch((error) => {
        console.error("Error updating employee data:", error);
      });
  };

  return (
    <div>
      <h1>Edit Employee</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={employeeData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Position:</label>
          <input
            type="text"
            name="position"
            value={employeeData.position}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Update Employee</button>
      </form>

      {/* Add a link to the list page */}
      <Link to="/UcLIstapi">Back to Employee List</Link>
    </div>
  );
};

export default Edit;
