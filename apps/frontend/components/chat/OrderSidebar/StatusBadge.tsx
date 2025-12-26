// components/chat/OrderSidebar/StatusBadge.tsx

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'pending': return 'text-eco-sun bg-yellow-50 border-yellow-200';
      case 'accepted': return 'text-eco-500 bg-eco-50 border-eco-200';
      case 'completed': return 'text-eco-blue-500 bg-blue-50 border-blue-200';
      case 'cancelled': return 'text-eco-coral bg-red-50 border-red-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}