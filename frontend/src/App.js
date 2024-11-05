import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {

  const { user } = useAuthContext()

  return (
    <div className="theme-blue flex flex-col min-h-screen">
      <BrowserRouter>
        <Navbar />
        <div className='pages flex-grow bg-light1 text-bodytext mt-14 lg:mt-12'>
          <Routes>
            <Route path='/' element={user ? <Home /> : <Navigate to='/login' />}/>
            <Route path='/register' element={!user ? <Register /> : <Navigate to='/' />}/>
            <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />}/>
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;