import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-5 shadow-lg">
      <h2 className="text-2xl font-bold mb-8 text-blue-400">
        SaaS Panel
      </h2>

      <ul className="space-y-4">
        <li>
          <Link to="/dashboard" className="hover:text-blue-400">
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/attendance" className="hover:text-green-400">
            Attendance
          </Link>
        </li>
        <li>
  <Link to="/social" className="hover:text-purple-400">
    Social Marketing
  </Link>
</li>
<li>
  <Link to="/email" className="hover:text-blue-400">
    Email Marketing
  </Link>
</li>

      </ul>
    </div>
  );
}