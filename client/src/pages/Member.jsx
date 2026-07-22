import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { BaseUrl } from "../assets/config.jsx"
import { SideBar } from "../components/Sidebar"
import { Button } from "../components/ui/Button"

export const Members = () => {

    const [members, setMembers] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const nameRef = useRef(null);
    const emailRef = useRef(null);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    useEffect(() => {
        if (!token) { navigate('/signin'); return; }
        if (role !== "ADMIN") { navigate('/dashboard'); return; }
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await axios.get(`${BaseUrl}/api/member`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMembers(response.data.members);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to fetch members");
        }
    }

    const handleInvite = async () => {
        try {
            const name = nameRef.current.value;
            const email = emailRef.current.value;

            await axios.post(`${BaseUrl}/api/member/invite`, { name, email }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Invite sent successfully");
            setShowForm(false);
            fetchMembers();

        } catch (error) {
            alert(error.response?.data?.message || "Failed to send invite");
        }
    }

    return <div className="w-full h-screen flex">
        <SideBar></SideBar>

        <div className="flex-1 bg-gray-50 p-8">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold">Members</h1>
                <Button text={showForm ? "Cancel" : "+ Invite Member"} Variant="primary" size="sm" textSize="sm"
                    onClick={() => setShowForm(!showForm)}></Button>
            </div>

            {showForm && (
                <div className="bg-white rounded-md shadow-sm p-5 mb-6">
                    <p className="text-sm font-semibold mb-4">Invite a Member</p>
                    <div className="flex flex-col gap-3">
                        <input ref={nameRef} type="text" placeholder="Member name"
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 w-full" />
                        <input ref={emailRef} type="email" placeholder="Member email"
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 w-full" />
                        <Button text="Send Invite" Variant="primary" size="sm" textSize="sm"
                            className="w-full mt-1" onClick={handleInvite}></Button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-md shadow-sm p-5">
                <p className="text-sm font-semibold mb-4">All Members</p>

                {members.length === 0
                    ? <p className="text-sm text-gray-400">No members yet</p>
                    : <div className="flex flex-col">
                        {members.map((member) => (
                            <div key={member.id} className="flex justify-between items-center py-3 border-b last:border-0">

                                <div>
                                    <p className="text-sm font-medium">{member.name}</p>
                                    <p className="text-xs text-gray-400">{member.email}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                                        {member.role}
                                    </span>
                                    <span className={`text-xs px-3 py-1 rounded-full
                                        ${member.isVerified ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}
                                    `}>
                                        {member.isVerified ? "Active" : "Invite Pending"}
                                    </span>
                                </div>

                            </div>
                        ))}
                    </div>
                }
            </div>

        </div>
    </div>
}