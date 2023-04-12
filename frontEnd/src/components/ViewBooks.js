import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthProvider';

const bodyy = {
  marginLeft:'100px',
  marginRight:'100px',
};

const ViewBooks = () => {
  const { auth } = useContext(AuthContext); // Access the auth object from the AuthContext
  const { role, email } = auth;
  const token = auth.jwt
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/Book/getbooks', {
        headers: {
          'Authorization': `Bearer ${token}` // Set the authorization header with the JWT token from context
        }
      });
      const data = await response.json();
      setBooks(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDownload = async (fileName) => {
    try {
      // Fetch user object using findByEmail endpoint
      const userResponse = await fetch(`http://localhost:8080/api/v1/User/findByEmail?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      console.log(userResponse)
      if (userResponse.ok) {
        const userData = await userResponse.json();
        const userId = userData.id;
  
        // Call decreaseDownloadsRemaining endpoint with retrieved user's id
        const decreaseDownloadsResponse = await fetch(`http://localhost:8080/api/v1/User/${userId}/decreaseDownloadsRemaining`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (decreaseDownloadsResponse.ok) {
          // Continue with file download logic
          const response = await fetch(`http://localhost:8080/api/v1/files/downloadFile/${fileName}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log(response)

          if (response.ok) {
            const blob = await response.blob();
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = fileName;
            downloadLink.click();
            URL.revokeObjectURL(downloadLink.href);
          } else {
            console.error('Failed to download file:', fileName);
          }
        } else {
          console.error('Failed to decrease downloads remaining');
        }
      } else {
        console.error('Failed to fetch user object');
      }
    } catch (error) {
      console.error('Failed to download file:', fileName, error);
    }
  };
  
  const handleDownloadBooksExcel = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/files/downloadBooksExcel', {
        headers: {
          'Authorization': `Bearer ${auth.jwt}` // Set the authorization header with the JWT token from context
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'books.xlsx';
        downloadLink.click();
        URL.revokeObjectURL(downloadLink.href);
      } else {
        console.error('Failed to download books Excel');
      }
    } catch (error) {
      console.error('Failed to download books Excel', error);
    }
  };



  const fetchAllUsers = async () => {

    try {
      const response = await fetch('http://localhost:8080/api/v1/User/getAllUsers',{
        headers: {
          'Authorization': `Bearer ${auth.jwt}` // Set the authorization header with the JWT token from context
        }
      });
      if(response.ok){
        const data = await response.json();
        setUsers(data);
      }

    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  return (
    <>
      <div style={bodyy}>
        <h1 className="text-dark text-center my-5">View Books</h1>
        {role === 'ADMIN' && (
          <>
            <button onClick={() => setShowTable(true)} className="btn btn-primary my-5 mx-3" >
            View Download Statistics
            </button>

            <button onClick={handleDownloadBooksExcel} className="btn btn-primary my-5" style={{ }}>
              Download All Books 
            </button>

            {users.length > 0 && showTable && (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Last Name</th>
                    <th>Number of books Downloaded</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name }</td>
                      <td>{user.lastname }</td>
                      <td>{ 5 - (user.downloadsRemaining || 5) }</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </>
        )}
        <div className="row">
          {books.map((book) => (
            <div key={book.id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
                  <p className="card-text">{book.description}</p>
                  <p className="card-text">{book.category_id.name}</p>

                  {role === 'CLIENTA' && (
                    <a href="#" onClick={() => handleDownload(book.file)} className="card-link">
                      Download
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </>
  );
};

export default ViewBooks;
