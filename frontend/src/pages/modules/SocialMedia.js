import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SocialMedia() {
  const API = "http://127.0.0.1:8000";

  const [post, setPost] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [posts, setPosts] = useState([]);
  const [dateTime, setDateTime] = useState("");
  const [loading, setLoading] = useState(false);

  const platforms = [
    "Instagram 📸",
    "LinkedIn 💼",
    "Twitter 🐦",
    "Facebook 📘",
  ];

  const data = [
    { day: "Mon", engagement: 200 },
    { day: "Tue", engagement: 400 },
    { day: "Wed", engagement: 300 },
    { day: "Thu", engagement: 600 },
    { day: "Fri", engagement: 500 },
  ];

  function togglePlatform(p) {
    if (selectedPlatforms.includes(p)) {
      setSelectedPlatforms(selectedPlatforms.filter((x) => x !== p));
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  }

  async function postNow() {
    if (!post || selectedPlatforms.length === 0) {
      alert("Enter post and select platform ❌");
      return;
    }

    try {
      setLoading(true);

      if (selectedPlatforms.includes("Twitter 🐦")) {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(post)}`,
          "_blank"
        );
      }

      if (selectedPlatforms.includes("LinkedIn 💼")) {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(post)}`,
          "_blank"
        );
      }

      if (selectedPlatforms.includes("Facebook 📘")) {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post)}`,
          "_blank"
        );
      }

      if (selectedPlatforms.includes("Instagram 📸")) {
        alert("⚠️ Instagram does not support direct posting from web.");
      }

      await fetch(`${API}/post-social`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: post,
        }),
      });

      const newPost = {
        text: post,
        platforms: selectedPlatforms,
        date: "Now",
      };

      setPosts([newPost, ...posts]);

      setPost("");
      setSelectedPlatforms([]);

      alert("✅ Opened selected platforms!");
    } catch (err) {
      console.error(err);
      alert("Backend not connected ❌");
    } finally {
      setLoading(false);
    }
  }

  function schedulePost() {
    if (!post || selectedPlatforms.length === 0) return;

    const newPost = {
      text: post,
      platforms: selectedPlatforms,
      date: dateTime || "Scheduled",
    };

    setPosts([newPost, ...posts]);

    setPost("");
    setSelectedPlatforms([]);
    setDateTime("");

    alert("📅 Post scheduled (demo)");
  }

  function generateCaption() {
    setPost(
      "🔥 Grow your brand with our powerful marketing strategy! #growth #marketing"
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Social Marketing 🌐
      </h1>

      {/* 🌐 Platforms */}
      <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300 border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Select Platforms
        </h2>

        <div className="grid grid-cols-4 gap-4">
          {platforms.map((p, i) => (
            <div
              key={i}
              onClick={() => togglePlatform(p)}
              className={`p-4 rounded text-center cursor-pointer transition duration-300
                ${
                  selectedPlatforms.includes(p)
                    ? "bg-indigo-500 text-white shadow-lg scale-105"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* ✍️ Create Post */}
      <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300 border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Create Post
        </h2>

        <textarea
          value={post}
          onChange={(e) => setPost(e.target.value)}
          placeholder="Write your post..."
          className="border w-full p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="border p-2 rounded mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <div className="flex gap-3">
          <button
            onClick={postNow}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300"
          >
            {loading ? "Posting..." : "Post Now 🚀"}
          </button>

          <button
            onClick={schedulePost}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition duration-300"
          >
            Schedule
          </button>

          <button
            onClick={generateCaption}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition duration-300"
          >
            AI Caption
          </button>
        </div>
      </div>

      {/* 📜 Post History */}
      <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300 border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Post History
        </h2>

        <ul className="space-y-3">
          {posts.map((p, i) => (
            <li
              key={i}
              className="border p-4 rounded hover:bg-gray-50 transition"
            >
              <p className="font-semibold">{p.text}</p>

              <p className="text-sm text-gray-500">
                Platforms: {p.platforms.join(", ")}
              </p>

              <p className="text-sm text-gray-400">
                {p.date}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* 📊 Analytics */}
      <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300 border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Engagement Analytics 📊
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="engagement"
              stroke="#6366f1"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}