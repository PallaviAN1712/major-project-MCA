import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="shadow-lg">
        <Sidebar />
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <div className="shadow bg-white">
          <Navbar />
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-100 to-gray-200">

          {/* 🔥 Added Wrapper Card Effect */}
          <div className="bg-white rounded-xl shadow-md p-6 min-h-full">
            <Outlet />
          </div>

        </div>
      </div>
    </div>
  );
}