export default function StatCard({ title, value, color }) {
  return (
    <div
      className={`p-5 rounded-xl text-white shadow-lg ${color} hover:scale-105 transition`}
    >
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}