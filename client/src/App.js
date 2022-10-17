import logo from './logo.svg';
import './App.css';
import Nav from './Components/Nav/Nav';
import Other from './Components/Other/Other';
import Footer from './Components/Footer/Footer';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './Components/Login/Login';
import Main from './Components/Main/Main';
import User from './Components/User.jsx/User';
import Password from './Components/Password/Password';

function App() {
  return (
    <div className='App'>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login />}/>
      <Route path='/main' element={<Main />}>
        <Route path='/main/users' element={<User />} />
        <Route index element={<Password />} />
      </Route>
    </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
