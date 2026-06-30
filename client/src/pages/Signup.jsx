import { useRef } from "react"
import { useNavigate,Link } from "react-router-dom"
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export const Signup = ()=>{

    const orgNameRef = useRef(null);
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    
    const handleSignup = ()=>{

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
            </div>
           
          </div>
    </div>


}