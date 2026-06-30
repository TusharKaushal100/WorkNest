import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import { Signup } from './pages/Signup';


function App() {
  
  return (
    <>
     <BrowserRouter>
        <Routes>
           <Route path='/signup' element={<Signup></Signup>}></Route>
        </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
