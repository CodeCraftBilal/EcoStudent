// components/chat/OrderSidebar/OrderTimeline.tsx
import { TrendingUp, Check } from "lucide-react";

interface OrderTimelineProps {
  status: string;
}

export default function OrderTimeline({ status }: OrderTimelineProps) {
  const steps = ['created', 'pending', 'accepted', 'completed'];
  const currentStepIndex = steps.indexOf(status);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-eco-200">
      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        Order Timeline
      </h4>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step} className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              index <= currentStepIndex
                ? 'bg-eco-500 text-white'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 capitalize">{step}</p>
              <p className="text-sm text-gray-500">
                {step === 'created' && 'Order was created'}
                {step === 'pending' && 'Waiting for acceptance'}
                {step === 'accepted' && 'Order accepted by both parties'}
                {step === 'completed' && 'Exchange completed successfully'}
              </p>
            </div>
            {index <= currentStepIndex && (
              <Check className="w-4 h-4 text-eco-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}