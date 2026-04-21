import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
}