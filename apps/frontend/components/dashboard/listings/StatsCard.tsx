interface StatsCardProps {
  title: string;
  value: number;
  color?: string;
}

export default function StatsCard({ title, value, color = "text-gray-900" }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-gray-600 text-sm">{title}</div>
    </div>
  );
}