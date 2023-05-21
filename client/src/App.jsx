import {Route, Routes} from 'react-router-dom'
import IndexPage from './Pages/IndexPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:4001/"
axios.defaults.withCredentials = true;
//vKyW6mvMtyU7B2q4

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<IndexPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
      </Routes>
    </>
  );
}

export default App;
