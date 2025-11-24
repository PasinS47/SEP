import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, ListTodo } from "lucide-react";

export default function Home() {
  const features = [
    {
      title: "Smart Scheduling",
      description: "Easily check availability and plan events without conflicts",
      icon: Calendar,
    },
    {
      title: "Team Collaboration",
      description: "Share events and keep everyone on the same page.",
      icon: Users,
    },
    {
      title: "Automatic Reminders",
      description: "Get notified before deadlines and important dates.",
      icon: Clock,
    },
    {
      title: "Clear Overview",
      description: "Track all your events and tasks in one simple dashboard.",
      icon: ListTodo,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background calendar pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-slate-700/25 bg-repeat"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="px-6 py-20 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Plan your student events in
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              just a few clicks
            </span>
          </h1>

          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            An event planner designed for students to organize schedules, set meetings,
            collaborate with ease, and never miss an important date again.
          </p>

          <Link to="/login">
            <Button size="lg" className="bg-transparent border border-gray-400 hover:border-gray-200 text-gray-200 hover:text-white rounded-lg px-8">
              Start Planning Event →
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="px-6 pb-20 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-lg p-8 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-center mb-4">
                    <Icon className="w-10 h-10 text-gray-800" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
