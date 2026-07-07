import { useNavigate } from "react-router-dom";


export const SideBar = ()=>{

    const navigate = useNavigate();
   
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");

    const handleLogout = ()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("role");
        navigate('/signin');
    }

    return <div className="w-56  py-2 bg-white h-screen shadow-lg  flex flex-col  items-center">
        <div className="font-bold w-full px-3  py-2 text-3xl mt-5 text-black mb-4">WorkNest</div>

        <div onClick={()=>{navigate('/dashboard') }} className="w-full px-3 py-2 rounded-lg font-medium text-md text-black cursor-pointer hover:bg-gray-300 border-none">Dashboard</div>
        <div onClick={()=>{navigate('/expense') }} className="w-full px-3 py-2 rounded-lg font-medium text-md text-black cursor-pointer hover:bg-gray-300 border-none">Expense</div>
        {role === "ADMIN" && (
            <div onClick={()=>{navigate('/admin')}} className="w-full px-3 py-2 rounded-lg font-medium text-md text-black cursor-pointer hover:bg-gray-300 border-none">Admin</div>
        )}
        {role === "ADMIN" && (
            <div onClick={()=>{navigate('/categories')}} className="w-full px-3 py-2 rounded-lg font-medium text-md text-black cursor-pointer hover:bg-gray-300 border-none">Categories</div>
        )}

        <div className="w-full py-2 font-sm text-md text-gray-500 border-none mt-95">
            <div className="flex px-3 py-2">
                 <p >{role} :</p>
                <p className="ml-2">{name}</p>
            </div>

            <div onClick={handleLogout} className="w-full px-3 py-2 rounded-lg font-medium text-md text-black cursor-pointer hover:bg-red-500 border-none duration-400 transition-all">
                Logout
            </div>
        </div>
    </div>
    

}