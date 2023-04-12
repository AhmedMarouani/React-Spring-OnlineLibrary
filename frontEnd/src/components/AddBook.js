import React, { useContext, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import AuthContext from '../context/AuthProvider';

const bodyy = {
  marginTop: "50px",
  marginLeft: "300px",
  width: "800px"
};

const validate = (values) => {
  const errors = {};
  if (!values.title) {
    errors.title = 'Required';
  } else if (values.title.length > 50) {
    errors.title = 'Invalid title (maximum 10 characters)';
  }

  if (!values.author) {
    errors.author = 'Required';
  } else if (values.author.length > 50) {
    errors.author = 'Invalid author (maximum 10 characters)';
  }

  if (!values.description) {
    errors.description = 'Required';
  } else if (values.description.length > 200) {
    errors.description = 'Invalid description (maximum 200 characters)';
  }


  return errors;
};


const AddBook = () => {
  const { auth } = useContext(AuthContext); // Access the auth object from the AuthContext
  const token = auth.jwt;
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/Category/getCategories', {
          headers: {
            'Authorization': `Bearer ${token}` // Add the Authorization header with the JWT token
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data); // Update the state with the fetched categories
        } else {
          alert('Something went wrong');
        }
      } catch (error) {
        alert('Something went wrong');
      }
    };
  
    fetchCategories(); // Call the fetchCategories function when the component mounts
  }, []); // Pass an empty array as the second argument to useEffect to run it only on mount

  const formik = useFormik({
    initialValues: {
      title: '',
      author: '',
      description: '',
      file: '',
      category_id: '',
    },
    validate,
    onSubmit: async (values, { resetForm }) => {

      console.log(values); // Add this line to check if the form submission is working
      try {
        const response = await fetch('http://localhost:8080/api/v1/Book/addBook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(values),
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          alert('Book added successfully');
          resetForm();
        } else {
          alert('Something went wrong');
        }
      } catch (error) {
        alert('Something went wrong');
      }
    }

  });

  const handleFileChange = async (event) => {
    const file = event.currentTarget.files[0];
    try {
      formik.setFieldValue('file', file);

      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('http://localhost:8080/api/v1/files/uploadFile', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}` // Add the Authorization header with the JWT token
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        formik.setFieldValue('file', data.fileName);
        formik.validateField('file');
      } else {
        alert('Something went wrong');
      }
    } catch (error) {
      alert('Something went wrong');
    }
  };

  return (
    <>
      <div style={bodyy}>
        <h1 className="text-dark text-center">Add Book</h1>
        <div className="tab-content">
          <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
            <form onSubmit={formik.handleSubmit}>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="title">Title</label>
                <input type="text" id="title" name="title" className="form-control" onChange={formik.handleChange} value={formik.values.title} />
                {formik.errors.title ? <div className="text-danger">{formik.errors.title}</div> : null}
              </div>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="author">Author</label>
                <input type="text" id="author" name="author" className="form-control" onChange={formik.handleChange} value={formik.values.author} />
                {formik.errors.author ? <div className="text-danger">{formik.errors.author}</div> : null}
              </div>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea id="description" name="description" className="form-control" onChange={formik.handleChange} value={formik.values.description}></textarea>
                {formik.errors.description ? <div className="text-danger">{formik.errors.description}</div> : null}
              </div>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="file">File</label>
                <input type="file" id="file" name="file" className="form-control" onChange={handleFileChange} />
                {formik.errors.file ? <div className="text-danger">{formik.errors.file}</div> : null}
              </div>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="category_id">Category</label>
                  <select id="category_id" name="category_id" className="form-control" onChange={formik.handleChange} value={formik.values.category_id}>
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                {formik.errors.category_id ? <div className="text-danger">{formik.errors.category_id}</div> : null}
              </div>
              <button type="submit" className="btn btn-primary btn-block mb-3">Add Book</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBook;

