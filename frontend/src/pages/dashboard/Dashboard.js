import StatCard from "../../components/cards/StatCard";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Dashboard 🚀
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <StatCard
          title="Users"
          value="1200"
          color="bg-gradient-to-r from-blue-500 to-blue-700"
        />
        <StatCard
          title="Revenue"
          value="₹50K"
          color="bg-gradient-to-r from-green-500 to-green-700"
        />
        <StatCard
          title="Tasks"
          value="35"
          color="bg-gradient-to-r from-purple-500 to-purple-700"
        />
      </div>
    </div>
  );
}