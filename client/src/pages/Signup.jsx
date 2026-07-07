import { useRef } from "react"
import { useNavigate,Link } from "react-router-dom"
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import axios from "axios";
import {BaseUrl} from "../assets/config.jsx"

export const Signup = ()=>{

    const orgNameRef = useRef(null);
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    
    const navigate = useNavigate();

    const handleSignup = async ()=>{

      try{
      const orgname = orgNameRef.current.value;
      const name = nameRef.current.value;
      const email = emailRef.current.value;
      const password = passwordRef.current.value;

      console.log("backend request sent");

      const response = await axios.post(`${BaseUrl}/api/auth/register`,{orgname,name,email,password});

      console.log("backend request succesfull");

      const token = response.data.token;

      localStorage.setItem("token",token);

      const payload = JSON.parse(atob(token.split('.')[1]));

      localStorage.setItem("name",payload.name);
      localStorage.setItem("role",payload.role);

      alert("organisation creation is successfull");

      navigate('/dashboard');
      
    }catch(error){
     
      alert(error.response?.data?.message || "Signup Failed!")
    }
       



    }

    return <div className="h-screen w-screen bg-white flex items-center justify-center">
          <div className="w-100 px-4 bg-blue-900 h-screen flex justify-center items-center">
            <div >
             <h1 className={"text-4xl text-white mb-6"}><b>Create your organisation</b></h1> 
            <Input ref={orgNameRef} placeholder={"organisation name"} ></Input>
            <Input ref={nameRef} placeholder={"Admins name"} ></Input>
            <Input ref={emailRef} placeholder={"email"} ></Input>
            <Input ref={passwordRef} placeholder={"password"} ></Input>
            
            <Button className={"w-full mt-5"} size={"sm"} variant={"primary"} textSize={"lg"} text={"SignUp"} onClick={()=>{handleSignup()}}></Button>

            <p className = {"text-white mt-2"}>Already have an account?
              <Link to="/signin" className = {"text-blue-600"}>Sign In</Link>
            </p>
            </div>
           
          </div>
    </div>


}

export const Signin = ()=>{
   
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    
    const navigate = useNavigate();

    const handleSignin = async ()=>{

      try{
     
      const email = emailRef.current.value;
      const password = passwordRef.current.value;

      console.log("backend request sent");

      const response = await axios.post(`${BaseUrl}/api/auth/login`,{email,password});

      console.log("backend request succesfull");

      const token = response.data.token;

      localStorage.setItem("token",token);

      const payload = JSON.parse(atob(token.split('.')[1]));

      localStorage.setItem("name",payload.name);
      localStorage.setItem("role",payload.role);

      alert("Login successfull");

      navigate('/dashboard');
      
    }catch(error){
     
      alert(error.response?.data?.message || "Signin Failed!")
    }
       



    }

    return <div className="h-screen w-screen bg-white flex items-center justify-center">
          <div className="w-100 px-4 bg-blue-900 h-screen flex justify-center items-center">
            <div >
             <h1 className={"text-4xl text-white mb-6"}><b>WorkNest Signup</b></h1> 
            <Input ref={emailRef} placeholder={"email"} ></Input>
            <Input ref={passwordRef} placeholder={"password"} ></Input>
            
            <Button className={"w-full mt-5"} size={"sm"} variant={"primary"} textSize={"lg"} text={"SignIn"} onClick={()=>{handleSignin()}}></Button>

            <p className = {"text-white mt-2"}>Doesn't have an account?
              <Link to="/signup" className = {"text-blue-600"}>Sign up</Link>
            </p>
            </div>
           
          </div>
    </div>

}