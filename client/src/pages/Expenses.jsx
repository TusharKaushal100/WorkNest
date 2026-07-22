import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { BaseUrl } from "../assets/config.jsx"
import { SideBar } from "../components/Sidebar"
import { Button } from "../components/ui/Button"

export const Expenses = () => {

    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const amountRef = useRef(null);
    const descriptionRef = useRef(null);
    const categoryRef = useRef(null);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    useEffect(() => {
        if (!token) { navigate('/signin'); return; }
        fetchExpenses();
        fetchCategories();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get(`${BaseUrl}/api/expenses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExpenses(response.data.expenses);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to fetch expenses");
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${BaseUrl}/api/categories`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(response.data.result);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to fetch categories");
        }
    }

    const handleSubmit = async () => {
        try {
            const amount = amountRef.current.value;
            const description = descriptionRef.current.value;
            const categoryId = categoryRef.current.value;

            await axios.post(`${BaseUrl}/api/expenses`, { amount, description, categoryId }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Expense submitted successfully");
            setShowForm(false);
            fetchExpenses();

        } catch (error) {
            alert(error.response?.data?.message || "Failed to submit expense");
        }
    }

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.patch(`${BaseUrl}/api/expenses/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`Expense ${status.toLowerCase()} successfully`);
            fetchExpenses();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update status");
        }
    }

    return <div className="w-full h-screen flex">
        <SideBar></SideBar>

        <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold">Expenses</h1>
                <Button text={showForm ? "Cancel" : "+ New Expense"} Variant="primary" size="sm" textSize="sm"
                    onClick={() => setShowForm(!showForm)}></Button>
            </div>

            {/* submit form */}
            {showForm && (
                <div className="bg-white rounded-md shadow-sm p-5 mb-6">
                    <p className="text-sm font-semibold mb-4">Submit New Expense</p>

                    <div className="flex flex-col gap-3">
                        <input ref={amountRef} type="number" placeholder="Amount (₹)"
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 w-full" />

                        <input ref={descriptionRef} type="text" placeholder="Description"
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 w-full" />

                        <select ref={categoryRef}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 w-full">
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        <Button text="Submit Expense" Variant="primary" size="sm" textSize="sm"
                            className="w-full mt-1" onClick={handleSubmit}></Button>
                    </div>
                </div>
            )}

            {/* expenses table */}
            <div className="bg-white rounded-md shadow-sm p-5">
                <p className="text-sm font-semibold mb-4">
                    {role === "ADMIN" ? "All Expenses" : "My Expenses"}
                </p>

                {expenses.length === 0
                    ? <p className="text-sm text-gray-400">No expenses found</p>
                    : <div className="flex flex-col">
                        {expenses.map((expense) => (
                            <div key={expense.id} className="flex justify-between items-center py-3 border-b last:border-0">

                                <div>
                                    <p className="text-sm">{expense.description}</p>
                                    <p className="text-xs text-gray-400">
                                        {expense.user.name} · {expense.category.name}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium">₹{expense.amount}</span>

                                    <span className={`text-xs px-3 py-1 rounded-full
                                        ${expense.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : ''}
                                        ${expense.status === 'APPROVED' ? 'bg-green-50 text-green-600' : ''}
                                        ${expense.status === 'REJECTED' ? 'bg-red-50 text-red-600' : ''}
                                    `}>
                                        {expense.status}
                                    </span>

                                    {/* approve/reject buttons — admin only, pending only */}
                                    {role === "ADMIN" && expense.status === "PENDING" && (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleStatusUpdate(expense.id, "APPROVED")}
                                                className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 cursor-pointer">
                                                Approve
                                            </button>
                                            <button onClick={() => handleStatusUpdate(expense.id, "REJECTED")}
                                                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 cursor-pointer">
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                }
            </div>

        </div>
    </div>
}