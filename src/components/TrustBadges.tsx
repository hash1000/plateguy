import { Shield, Truck, Star, Zap, Wrench, Sun } from "lucide-react";

const badges = [
  { icon: Truck, label: "Free Delivery", sub: "On All Orders" },
  { icon: Wrench, label: "Free Fixing Kit", sub: "Included" },
  { icon: Shield, label: "3-Year Warranty", sub: "Guaranteed" },
  { icon: Star, label: "Road Legal", sub: "100% Compliant" },
  { icon: Zap, label: "Laser Cut", sub: "Precision Made" },
  { icon: Sun, label: "UV Resistant", sub: "Won't Fade" },
];

export default function TrustBadges() {
  return (
    <section className="bg-brand-gray-mid border-y border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center gap-2 group"
            >
              <div className="w-12 h-12 bg-brand-yellow/10 rounded-xl flex items-center justify-center group-hover:bg-brand-yellow/20 transition-colors duration-200">
                <Icon size={22} className="text-brand-yellow" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{label}</p>
                <p className="text-[10px] text-white/40">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
