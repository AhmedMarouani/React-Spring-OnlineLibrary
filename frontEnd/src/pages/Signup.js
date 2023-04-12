import React from 'react';
import { useFormik } from 'formik';
import Header from '../components/Header';

const bodyStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};

const formStyle = {
  backgroundColor: '#fff',
  padding: '40px',
  borderRadius: '10px',
  boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
  width:'750px',
  marginTop: '100px',
};

const inputStyle = {
  width: '100%',
  height: '40px',
  padding: '10px',
  margin: '10px 0',
  border: '1px solid #ccc',
  borderRadius: '5px',
  boxSizing: 'border-box',
  fontSize: '16px',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
};

const labelStyle = {
  display: 'block',
  margin: '10px 0',
};

const Signup = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      lastname: '',
      email: '',
      password: '',
      role: '',
    },
    validate,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        console.log(response);
        if (response.ok) {
          resetForm();
          alert('Registration successful');
        } else {
          alert('Registration failed');
        }
      } catch (error) {
        alert('Registration failed');
      }
    },
  });

  function validate(values) {
    const errors = {};
    if (!values.name) {
      errors.name = 'Required';
    } else if (values.name.length > 15) {
      errors.name = 'Must be 15 characters or less';
    }

    if (!values.lastname) {
      errors.lastname = 'Required';
    } else if (values.lastname.length > 10) {
      errors.lastname = 'Must be 10 characters or less';
    }

    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    if (!values.password) {
      errors.password = 'Required';
    } else if (values.password.length > 20) {
      errors.password = 'Invalid Password';
    }
    if (values.role !== 'ADMIN' && values.role !== 'CLIENT') {
      errors.role = 'Invalid Role';
    }

    return errors;
  }

  return (
    <>
        <div style={bodyStyle}>
        <div style={formStyle}>
            <h2 style={{ textAlign: 'center', color:'#0066cc' }}>Signup</h2>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="name" style={labelStyle}>
                    First Name:
                </label>
                <input
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                style={inputStyle}
                />
                {formik.touched.name && formik.errors.name ? (
                <div style={{ color: 'red' }}>{formik.errors.name}</div>
                ) : null}

                <label htmlFor="lastname" style={labelStyle}>
                Last Name:
                </label>
                <input
                id="lastname"
                name="lastname"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.lastname}
                style={inputStyle}
                />
                {formik.touched.lastname && formik.errors.lastname ? (
                <div style={{ color: 'red' }}>{formik.errors.lastname}</div>
                ) : null}

                <label htmlFor="email" style={labelStyle}>
                Email Address:
                </label>
                <input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                style={inputStyle}
                />
                {formik.touched.email && formik.errors.email ? (
                <div style={{ color: 'red' }}>{formik.errors.email}</div>
                ) : null}

                <label htmlFor="password" style={labelStyle}>
                  Password:
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  style={inputStyle}
                />
                {formik.touched.password && formik.errors.password ? (
                <div style={{ color: 'red' }}>{formik.errors.password}</div>
                ) : null}

                <label htmlFor="role" style={labelStyle}>
                  Role:
                </label>
                <select
                  id="role"
                  name="role"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.role}
                  style={inputStyle}
                >
                  <option value="CLIENT">CLIENT</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                {formik.touched.role && formik.errors.role ? (
                <div style={{ color: 'red' }}>{formik.errors.role}</div>
                ) : null}

                <button type="submit" style={buttonStyle}>
                Register
                </button>
            </form>
        </div>
        </div>
    </>
  )
}

export default Signup

