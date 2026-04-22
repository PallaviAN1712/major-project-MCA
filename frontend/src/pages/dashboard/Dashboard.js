import { useEffect, useState } from "react";
import StatCard from "../../components/cards/StatCard";

export default function Dashboard() {

  const API = "http://127.0.0.1:8000";

  const [emails, setEmails] = useState([]);
  const [posts, setPosts] = useState([]);
  const [employees, setEmployees] = useState([]);

  // ✅ Fetch data from backend
  useEffect(() => {
    fetch(`${API}/emails`)
      .then(res => res.json())
      .then(data => setEmails(data || []));

    fetch(`${API}/social-posts`)
      .then(res => res.json())
      .then(data => setPosts(data || []));

    fetch(`${API}/employees`)
      .then(res => res.json())
      .then(data => setEmployees(data || []));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Dashboard 🚀
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <StatCard
          title="Users"
          value={employees.length}
          color="bg-gradient-to-r from-blue-500 to-blue-700"
        />

        <StatCard
          title="Emails Sent"
          value={emails.length}
          color="bg-gradient-to-r from-green-500 to-green-700"
        />

        <StatCard
          title="Posts"
          value={posts.length}
          color="bg-gradient-to-r from-purple-500 to-purple-700"
        />
      </div>
    </div>
  );
}