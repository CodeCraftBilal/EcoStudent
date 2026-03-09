import { ArrowRight, BookOpen, MapPin, MessageCircle, Play, Search, Shield, Users } from "lucide-react";
import Link from "next/link";
import { FeatureShowcase } from "./FeatureShowcase";

export function Home() {

  const stats = [
    { value: "10K+", label: "Books Exchanged" },
    { value: "5K+", label: "Happy Students" },
    { value: "50+", label: "Schools Joined" },
    { value: "95%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Exchange Books,
                  <span className="text-green-600"> Save Money,</span>
                  <br />
                  Protect Our Planet
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Join the sustainable student community. Buy, sell, exchange,
                  and donate educational resources with students in your area.
                  Affordable, eco-friendly, and secure.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={"/shop?mode=exchange"}
                  className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>Start Exchanging</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href={"how-it-works/#demo"}
                  className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Showcase */}
            <FeatureShowcase />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Sustainable Learning
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with
              community-driven sustainability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-linear-to-br from-green-50 to-blue-50 p-8 rounded-3xl space-y-4 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Nearby Exchange
              </h3>
              <p className="text-gray-600">
                Find students in your vicinity for convenient and safe meetups
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-linear-to-br from-blue-50 to-purple-50 p-8 rounded-3xl space-y-4 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Real-time Chat
              </h3>
              <p className="text-gray-600">
                Text and voice chat to discuss exchanges in real-time
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-linear-to-br from-purple-50 to-pink-50 p-8 rounded-3xl space-y-4 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                AI-Powered Search
              </h3>
              <p className="text-gray-600">
                Smart search with image recognition and personalized
                recommendations
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-linear-to-br from-pink-50 to-red-50 p-8 rounded-3xl space-y-4 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Negotiate Price
              </h3>
              <p className="text-gray-600">
                Bargain & Decide the best Price with the seller
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-linear-to-br from-yellow-50 to-orange-50 p-8 rounded-3xl space-y-4 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Multiple Modes
              </h3>
              <p className="text-gray-600">
                Buy, sell, exchange, or donate - choose what works for you
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-linear-to-br from-teal-50 to-green-50 p-8 rounded-3xl space-y-4 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Trust System
              </h3>
              <p className="text-gray-600">
                User ratings and feedback ensure a reliable community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Join the Sustainable Student Community?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Start exchanging books and uniforms today. Save money, make friends,
            and help the environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={"/auth/signup"}
              className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Account
            </Link>
            <Link
              href={"/how-it-works"}
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
