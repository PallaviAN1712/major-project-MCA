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

  // 🚀 REAL MULTI-PLATFORM POST
  async function postNow() {
    if (!post || selectedPlatforms.length === 0) {
      alert("Enter post and select platform ❌");
      return;
    }

    try {
      setLoading(true);

      // 🔗 Open selected platforms
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

      // OPTIONAL: Save to backend
      await fetch(`${API}/post-social`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: post,
        }),
      });

      // Save locally
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

  // 📅 Schedule (demo)
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
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Select Platforms</h2>

        <div className="grid grid-cols-4 gap-4">
          {platforms.map((p, i) => (
            <div
              key={i}
              onClick={() => togglePlatform(p)}
              className={`p-4 rounded text-center cursor-pointer
                ${
                  selectedPlatforms.includes(p)
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-200"
                }`}
            >
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* ✍️ Create Post */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Create Post</h2>

        <textarea
          value={post}
          onChange={(e) => setPost(e.target.value)}
          placeholder="Write your post..."
          className="border w-full p-3 rounded mb-3"
        />

        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="border p-2 rounded mb-3 w-full"
        />

        <div className="flex gap-3">
          <button
            onClick={postNow}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Posting..." : "Post Now 🚀"}
          </button>

          <button
            onClick={schedulePost}
            className="bg-indigo-500 text-white px-4 py-2 rounded"
          >
            Schedule
          </button>

          <button
            onClick={generateCaption}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            AI Caption
          </button>
        </div>
      </div>

      {/* 📜 Post History */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Post History</h2>

        <ul className="space-y-3">
          {posts.map((p, i) => (
            <li key={i} className="border p-4 rounded">
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
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
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