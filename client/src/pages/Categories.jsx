import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { BaseUrl } from "../assets/config.jsx"
import { SideBar } from "../components/Sidebar"
import { Button } from "../components/ui/Button"

export const Categories = () => {

    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const nameRef = useRef(null);
    const budgetRef = useRef(null);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    useEffect(() => {
        if (!token) { navigate('/signin'); return; }
        if (role !== "ADMIN") { navigate('/dashboard'); return; }
        fetchCategories();
    }, []);

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

    const handleCreate = async () => {
        try {
            const name = nameRef.current.value;
            const budgetLimit = budgetRef.current.value;

            await axios.post(`${BaseUrl}/api/categories`, { name, budgetLimit }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Category created successfully");
            setShowForm(false);
            fetchCategories();

        } catch (error) {
            alert(error.response?.data?.message || "Failed to create category");
        }
    }

    return <div className="w-full h-screen flex">
        <SideBar></SideBar>

        <div className="flex-1 bg-gray-50 p-8">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold">Categories</h1>
                <Button text={showForm ? "Cancel" : "+ New Category"} Variant="primary" size="sm" textSize="sm"
                    onClick={() => setShowForm(!showForm)}></Button>
            </div>

            {showForm && (
                <div className="bg-white rounded-md shadow-sm p-5 mb-6">
                    <p className="text-sm font-semibold mb-4">Create Category</p>
                    <div className="flex flex-col gap-3">
                        <input ref={nameRef} type="text" placeholder="Category name"
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 w-full" />
                        <input ref={budgetRef} type="number" placeholder="Budget limit (₹)"
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 w-full" />
                        <Button text="Create" Variant="primary" size="sm" textSize="sm"
                            className="w-full mt-1" onClick={handleCreate}></Button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-md shadow-sm p-5">
                <p className="text-sm font-semibold mb-4">All Categories</p>

                {categories.length === 0
                    ? <p className="text-sm text-gray-400">No categories yet</p>
                    : <div className="flex flex-col">
                        {categories.map((cat) => (
                            <div key={cat.id} className="flex justify-between items-center py-3 border-b last:border-0">
                                <p className="text-sm font-medium">{cat.name}</p>
                                <p className="text-sm text-gray-500">Budget: ₹{cat.budget}</p>
                            </div>
                        ))}
                    </div>
                }
            </div>

        </div>
    </div>
}
