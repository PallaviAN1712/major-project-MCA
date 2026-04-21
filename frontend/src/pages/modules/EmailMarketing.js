import { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function EmailMarketing() {
  const API = "http://127.0.0.1:8000";

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  const data = [
    { name: "Sent", value: emails.length },
    { name: "Opened", value: Math.floor(emails.length * 0.7) },
    { name: "Clicked", value: Math.floor(emails.length * 0.4) },
  ];

  // ✅ Email validation
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ➕ Add Email
  const addEmail = () => {
    const email = prompt("Enter email");

    if (!email || !isValidEmail(email)) {
      alert("Invalid email ❌");
      return;
    }

    if (emailList.includes(email)) {
      alert("Email already added ⚠️");
      return;
    }

    setEmailList((prev) => [...prev, email]);
  };

  // ❌ Remove email
  const removeEmail = (index) => {
    setEmailList((prev) => prev.filter((_, i) => i !== index));
  };

  // 🤖 AI Email
  const generateEmail = () => {
    setSubject("🔥 Special Offer Just for You!");
    setMessage(
      "Hi there! We have an exclusive offer waiting for you. Don’t miss out!"
    );
  };

  // 📥 Fetch emails (useCallback fix)
  const fetchEmails = useCallback(async () => {
    try {
      const res = await fetch(`${API}/emails`);
      const data = await res.json();
      setEmails(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  // 🚀 SEND EMAIL
  const sendEmail = async () => {
    if (!subject.trim() || !message.trim() || emailList.length === 0) {
      alert("Fill all fields ❌");
      return;
    }

    try {
      setLoading(true);

      // ⏱️ Timeout protection
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${API}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: emailList,
          subject,
          message,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await res.json();

      if (!res.ok || data.error) {
        alert("❌ Failed:\n" + (data.error || "Server error"));
        return;
      }

      alert("✅ " + data.message);

      // Reset form
      setSubject("");
      setMessage("");
      setEmailList([]);

      fetchEmails();

    } catch (err) {
      console.error(err);

      if (err.name === "AbortError") {
        alert("⏱️ Request timed out (Backend slow or blocked)");
      } else {
        alert("❌ Backend not connected");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Email Marketing 📧
      </h1>

      {/* ✉️ Compose */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Compose Email</h2>

        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="border p-2 w-full mb-3 rounded"
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your email..."
          className="border p-3 w-full rounded mb-3"
        />

        <div className="flex gap-3">
          <button
            onClick={sendEmail}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Sending..." : "Send Email"}
          </button>

          <button
            onClick={generateEmail}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            AI Generate
          </button>
        </div>
      </div>

      {/* 👥 Email List */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Email List</h2>

        <button
          onClick={addEmail}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Add Email
        </button>

        <ul className="mt-3 space-y-1">
          {emailList.map((e, i) => (
            <li
              key={i}
              className="border p-2 rounded flex justify-between items-center"
            >
              {e}
              <button
                onClick={() => removeEmail(i)}
                className="text-red-500"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 📥 Inbox */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Inbox</h2>

        {emails.length === 0 ? (
          <p className="text-gray-500">No emails yet</p>
        ) : (
          <ul className="space-y-2">
            {emails.map((mail, index) => (
              <li
                key={index}
                className="p-3 border rounded flex justify-between"
              >
                <div>
                  <p className="font-semibold">{mail.subject}</p>
                  <p className="text-sm text-gray-500">
                    {mail.to?.join(", ") || "Unknown"}
                  </p>
                </div>

                <span className="px-2 py-1 bg-green-500 text-white rounded">
                  Sent
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 📊 Analytics */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          Campaign Analytics 📊
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}