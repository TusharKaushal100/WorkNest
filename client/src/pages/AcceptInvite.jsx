import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { BaseUrl } from "../assets/config.jsx"
import { Button } from "../components/ui/Button"

export const AcceptInvite = () => {

    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const navigate = useNavigate();

    // grab token from URL — /accept-invite?token=abc123
    const token = new URLSearchParams(window.location.search).get("token");

    const handleAccept = async () => {
        try {
            const password = passwordRef.current.value;
            const confirmPassword = confirmPasswordRef.current.value;

            if (!password || !confirmPassword) {
                alert("Please fill in both fields");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }

            if (password.length < 6) {
                alert("Password must be at least 6 characters");
                return;
            }

            if (!token) {
                alert("Invalid invite link");
                return;
            }

            await axios.post(`${BaseUrl}/api/member/accept-invite`, { token, password });

            alert("Password set successfully! You can now sign in.");
            navigate('/signin');

        } catch (error) {
            alert(error.response?.data?.message || "Failed to accept invite");
        }
    }

    return <div className="h-screen w-screen bg-white flex items-center justify-center">
        <div className="w-100 px-4 bg-blue-900 h-screen flex justify-center items-center">
            <div>
                <h1 className="text-4xl text-white mb-2"><b>Welcome to WorkNest</b></h1>
                <p className="text-blue-300 text-sm mb-6">Set your password to activate your account</p>

                <input ref={passwordRef} type="password" placeholder="Set a password"
                    className="rounded-md px-4 py-2 mt-2 border w-full focus:outline-none focus:border-blue-500 text-sm" />

                <input ref={confirmPasswordRef} type="password" placeholder="Confirm password"
                    className="rounded-md px-4 py-2 mt-2 border w-full focus:outline-none focus:border-blue-500 text-sm" />

                <Button className={"w-full mt-5"} size={"sm"} Variant="primary" textSize={"lg"}
                    text={"Activate Account"} onClick={() => { handleAccept() }}></Button>
            </div>
        </div>
    </div>
}