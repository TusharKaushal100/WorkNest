import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import { Signup } from './pages/Signup';
import { DashBoard } from './pages/Dashboard';
import { Signin } from './pages/Signup';
import { AcceptInvite } from './pages/AcceptInvite';

function App() {
  
  return (
    <>
     <BrowserRouter>
        <Routes>
           <Route path='/signup' element={<Signup></Signup>}></Route>
           <Route path='/dashboard' element={<DashBoard></DashBoard>}></Route>
           <Route path='/signin' element={<Signin></Signin>}></Route>
           <Route path='/accept-invite' element={<AcceptInvite />}></Route>
        </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
