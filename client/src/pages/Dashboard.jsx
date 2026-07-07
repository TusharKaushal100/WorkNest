import { SideBar } from "../components/Sidebar"
import { useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import {BaseUrl} from "../assets/config.jsx"
import axios from "axios";

export const DashBoard = ()=>{
    
    const navigate = useNavigate();

    const [data,setData] = useState(null);

     const token = localStorage.getItem("token");

    useEffect(()=>{
    

        if(!token){
            navigate('/signin');
        }

        fetchDashboard();
    },[])

    const fetchDashboard = async ()=>{

        try{
        const response = await axios.get(`${BaseUrl}/api/dashboard/`,{headers:{Authorization:`Bearer ${token}`}});
        
        setData(response.data.data);
        }catch(error){
            aler(error.response?.data?.message || "Failed to fetch dashboard data");
        }
         
      
    }

    if(!data){
        return <div className="flex h-screen w-screen justify-center items-center text-gray-300 text-md">Loading....</div>
    }
    
    return <div className="w-full h-screen  flex">
         <SideBar></SideBar>
         <div className="flex-1 bg-gray-50 p-8">
           <h1 className="text-xl font-semibold mb-3">Dashboard</h1>
           <div className ="grid grid-cols-4 gap-4">
              
              <div className="bg-white p-2 rounded-md shadow-lg flex flex-col items-center justify-center gap-2">
                <p className="text-sm text-gray-500 mb-1">Total Spent</p>
                <p  className="text-2xl font-semibold">₹{data.totalSpent}</p>
              </div>

              <div className="bg-amber-50 rounded-md shadow-sm p-4">
                    <p className="text-sm text-amber-600 mb-1">Pending</p>
                    <p className="text-2xl font-semibold text-amber-600">{data.pendingCount}</p>
                </div>

                <div className="bg-green-50 rounded-md shadow-sm p-4">
                    <p className="text-sm text-green-600 mb-1">Approved</p>
                    <p className="text-2xl font-semibold text-green-600">{data.approvedCount}</p>
                </div> 

                <div className="bg-red-50 rounded-md shadow-sm p-4">
                    <p className="text-sm text-red-600 mb-1">Rejected</p>
                    <p className="text-2xl font-semibold text-red-600">{data.rejectedCount}</p>
                </div>
           </div>

            {/* budget bars */}
            <div className="bg-white rounded-md shadow-sm p-5 mt-3 mb-6">
                <p className="text-sm font-semibold mb-4">Budget usage by category</p>

                <div className="flex flex-col gap-4">
                    {data.spendingByCategory.map((item) => (
                        <div key={item.category}>
                            <div className="flex justify-between text-sm mb-1">
                                <span>{item.category}</span>
                                <span className="text-gray-400">₹{item.spent} / ₹{item.budget}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${item.percentageUsed >= 100 ? 'bg-red-500' : item.percentageUsed >= 80 ? 'bg-amber-400' : 'bg-green-500'}`}
                                    style={{ width: `${Math.min(item.percentageUsed, 100)}%` }}>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        
         {/* recent expenses */}
            <div className="bg-white rounded-md shadow-sm p-5">
                <p className="text-sm font-semibold mb-4">Recent expenses</p>

                <div className="flex flex-col">
                    {data.recentExpense.map((expense) => (
                        <div key={expense.id} className="flex justify-between items-center py-3 border-b last:border-0">

                            <div>
                                <p className="text-sm">{expense.description}</p>
                                <p className="text-xs text-gray-400">{expense.user.name} · {expense.category.name}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium">₹{expense.amount}</span>
                                <span className={`text-xs px-3 py-1 rounded-full 
                                    ${expense.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : ''}
                                    ${expense.status === 'APPROVED' ? 'bg-green-50 text-green-600' : ''}
                                    ${expense.status === 'REJECTED' ? 'bg-red-50 text-red-600' : ''}
                                `}>
                                    {expense.status}
                                </span>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
            

            
         </div>

         

         

    </div>
}