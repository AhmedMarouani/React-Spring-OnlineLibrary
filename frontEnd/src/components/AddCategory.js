import React, { useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import { useFormik } from 'formik';

const AddCategory = () => {
    const { auth } = useContext(AuthContext); // Access the auth object from the AuthContext
    const token = auth.jwt;

    
  

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Required';
    } else if (values.name.length > 10) {
      errors.name = 'Invalid name (maximum 10 characters)';
    }
  
    return errors;
  };

  const formik = useFormik({
    initialValues: {
        name: '',
    },
    validate,
    onSubmit: async (values, { resetForm }) => {
      console.log(values); // Add this line to check if the form submission is working
      try {
        const response = await fetch('http://localhost:8080/api/v1/Category/addCategory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(values),
        });
        if (response.ok) {
          const data = await response.json();
          alert('category added successfully');
          resetForm();
        } else {
          alert('Something went wrong');
        }
      } catch (error) {
        alert('Something went wrong2');
      }
    }

  });

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="col-md-6">
        <h1 className="text-center mb-3 text-primary">Add Category</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="my-2" >Name</label>
            <input type="text" className="form-control" id="name" name="name" onChange={formik.handleChange} value={formik.values.name} />
          </div>
          <button type="submit" className="btn btn-primary mt-3">Add Category</button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;