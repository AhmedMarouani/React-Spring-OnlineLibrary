import React, { useState, useContext  } from 'react';
import AuthContext from '../context/AuthProvider';
import {Link, useNavigate} from 'react-router-dom';
import { useFormik } from 'formik';
import jwt_decode from "jwt-decode";


const linkStyle = {
    margin: "1rem",
    textDecoration: "none",
    color: 'black'
  };
  const bodyy = {
    marginTop : "50px",
    marginLeft : "350px",
    width:"600px"
};

  const loginLinkStyle = {
    margin: "1rem",
    textDecoration: "none",
    color: 'white'
  };

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    if (!values.password) {
        errors.password = 'Required';
      } else if (values.password.length > 20) {
        errors.password = 'Invalid email address';
      }
  
    return errors;
  };





  const Login =() => {
    const {setAuth} = useContext(AuthContext);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    
    const formik = useFormik({
      initialValues: {
        email: '',
        password: '',
      },
      validate,
      onSubmit: async (values) => {
        const response = await fetch('http://localhost:8080/api/v1/auth/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
  
        if (response.ok) {
          const data = await response.json();
          const decodedToken = jwt_decode(data.token);
          setAuth({
            jwt: data.token,
            email: decodedToken.sub,
            role: decodedToken.role,
            isAuthenticated:true,
          });
          console.log(decodedToken);

          alert('Login successful!');
          
          navigate('/'); // redirect to ViewBooks component

        } else {
          setError('Invalid email or password');
        }
      },
    });
  

        return (
                <>
                <div style={bodyy}>
                <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                    <li className="nav-item" role="presentation">
                        <Link to="/login" className="nav-link active" style={loginLinkStyle}>Login</Link>
                    </li>
                    <li className="nav-item" role="presentation">
                        <Link to="/signup" className="nav-link" style={linkStyle}>SignUp</Link>

                    </li>
                </ul>

                    <div className="tab-content">
                    <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                        <form onSubmit={formik.handleSubmit}>
                        <div className="text-center mb-3">
                            <p>Sign in with:</p>
                            <button type="button" className="btn btn-link btn-floating mx-1">
                            <i className="fab fa-facebook-f"></i>
                            </button>

                            <button type="button" className="btn btn-link btn-floating mx-1">
                            <i className="fab fa-google"></i>
                            </button>

                            <button type="button" className="btn btn-link btn-floating mx-1">
                            <i className="fab fa-twitter"></i>
                            </button>

                            <button type="button" className="btn btn-link btn-floating mx-1">
                            <i className="fab fa-github"></i>
                            </button>
                        </div>

                        <p className="text-center">or:</p>

                        <div className="form-outline mb-4">
                            <input type="email" id="email" name="email" className="form-control" onChange={formik.handleChange} value={formik.values.email}/>
                            <label className="form-label" htmlFor="email">Email</label>
                        </div>

                        <div className="form-outline mb-4">
                            <input type="password" id="password" name="password" className="form-control" onChange={formik.handleChange} value={formik.values.password}/>
                            <label className="form-label" htmlFor="password">Password</label>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block mb-4">Sign in</button>

                        <div className="text-center">
                            <p>Not a member?<Link to="/signup" className="nav-link" style={linkStyle}>SignUp</Link>
</p>
                        </div>
                        </form>
                    </div>
                    </div>
                    </div>
                </>
        )
    }
    
export default Login


