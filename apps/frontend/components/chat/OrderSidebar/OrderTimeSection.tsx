// components/chat/OrderSidebar/OrderTimeSection.tsx
import { Calendar, Clock } from "lucide-react";

interface OrderTimeSectionProps {
  meetupTime: string;
}

export default function OrderTimeSection({ meetupTime }: OrderTimeSectionProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-eco-200">
      <h4 className="font-medium text-gray-700 flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4" />
        Meetup Time
      </h4>
      <div className="flex items-center gap-3 p-3 bg-white border border-eco-200 rounded-lg">
        <Clock className="w-5 h-5 text-eco-500" />
        <div>
          <p className="font-medium text-gray-900">{formatDate(meetupTime)}</p>
          <p className="text-sm text-gray-500">
            {new Date(meetupTime) > new Date() ? 'Upcoming' : 'Past'}
          </p>
        </div>
      </div>
    </div>
  );
}