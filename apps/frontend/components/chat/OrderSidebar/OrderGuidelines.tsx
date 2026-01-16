// components/chat/OrderSidebar/OrderGuidelines.tsx
import { Shield } from "lucide-react";

export default function OrderGuidelines() {
  return (
    <div className="mt-6">
      <div className="bg-eco-blue-50 border border-eco-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-eco-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Safe Exchange Guidelines</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Meet in public, well-lit areas</li>
              <li>• Verify item condition before payment</li>
              <li>• Bring exact change if paying cash</li>
              <li>• Report any suspicious activity</li>
              <li>• Only meet during daylight hours</li>
              <li>• Bring a friend if possible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}