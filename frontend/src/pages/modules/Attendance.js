import { useState, useEffect } from "react";

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [newName, setNewName] = useState("");
  const [newTime, setNewTime] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "http://127.0.0.1:8000";

  function getStatus(time) {
    if (time < "09:00") return "Early";
    if (time === "09:00") return "On Time";
    return "Late";
  }

  async function checkBackend() {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error();
      return true;
    } catch {
      return false;
    }
  }

  async function fetchEmployees() {
    try {
      setLoading(true);

      const backendOk = await checkBackend();
      if (!backendOk) {
        alert("⚠️ Backend not running!\nStart backend first.");
        return;
      }

      const res = await fetch(`${API}/employees`);
      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setEmployees(data);

    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Backend connection failed ❌");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function addEmployee() {
    if (!newName || !newTime) {
      alert("Enter all fields");
      return;
    }

    const status = getStatus(newTime);

    try {
      const res = await fetch(`${API}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          time: newTime,
          status,
        }),
      });

      if (!res.ok) throw new Error();

      setNewName("");
      setNewTime("");
      fetchEmployees();

    } catch (err) {
      console.error("Add Error:", err);
      alert("Failed to add employee ❌");
    }
  }

  async function deleteEmployee(index) {
    try {
      const res = await fetch(`${API}/employees/${index}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();
      fetchEmployees();

    } catch (err) {
      console.error("Delete Error:", err);
      alert("Delete failed ❌");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Attendance Management 👥
      </h1>

      {/* ➕ Add Employee */}
      <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300 border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Add Employee
        </h2>

        <div className="flex gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Employee Name"
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button
            onClick={addEmployee}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition duration-300"
          >
            Add
          </button>
        </div>
      </div>

      {/* 📋 Table */}
      <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300 border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Employee Attendance
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border rounded overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Name</th>
                <th className="p-2">Time</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 transition">
                  <td className="p-2">{emp.name}</td>
                  <td className="p-2">{emp.time}</td>

                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-white rounded ${
                        emp.status === "Early"
                          ? "bg-green-500"
                          : emp.status === "On Time"
                          ? "bg-blue-500"
                          : "bg-red-500"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>

                  <td className="p-2">
                    <button
                      onClick={() => deleteEmployee(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {employees.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-3 text-gray-500">
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}