import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';import './App.css';
import React, {Component} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AddBook from './components/AddBook';
import ViewBooks from './components/ViewBooks';
import AddUser from './components/AddUser';
import AddCategory from './components/AddCategory';
import { AuthProvider } from './context/AuthProvider';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      role: ''
    };
  }

  
  render(){
    const { email, role } = this.state;

    return (
      <>
      <AuthProvider>
        <Router>
          <div className="App">
          <Header />
            <Routes>
              <Route path='/signup' element={<Signup />} />
              <Route path='/login' element={<Login />} />
              <Route path='/addbook' element={<AddBook />} />
              <Route path='/' element={<ViewBooks />} />
              <Route path='/addUser' element={<AddUser />} />
              <Route path='/addCategory' element={<AddCategory />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
      </>
    );
  }
}

