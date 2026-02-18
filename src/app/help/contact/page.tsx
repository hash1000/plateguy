import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-brand-black">
      <section className="bg-brand-dark border-b border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-brand-yellow text-xs font-semibold tracking-[0.3em] uppercase mb-2">
            Get in Touch
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl text-white leading-none">
            CONTACT US
          </h1>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="font-heading text-3xl text-white mb-6">SEND US A MESSAGE</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/40 tracking-widest uppercase mb-2 block">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-yellow/50 placeholder-white/20 transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 tracking-widest uppercase mb-2 block">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-yellow/50 placeholder-white/20 transition-colors"
                      placeholder="Smith"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/40 tracking-widest uppercase mb-2 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-yellow/50 placeholder-white/20 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 tracking-widest uppercase mb-2 block">
                    Order Number (if applicable)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-yellow/50 placeholder-white/20 transition-colors"
                    placeholder="#12345"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 tracking-widest uppercase mb-2 block">
                    Subject
                  </label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-yellow/50 transition-colors">
                    <option value="">Select a topic</option>
                    <option value="order">Order Enquiry</option>
                    <option value="delivery">Delivery</option>
                    <option value="product">Product Question</option>
                    <option value="return">Return / Refund</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 tracking-widest uppercase mb-2 block">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-yellow/50 placeholder-white/20 transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button className="w-full btn-shimmer text-brand-black font-bold py-4 rounded-xl tracking-wide hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-shadow">
                  SEND MESSAGE
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <h2 className="font-heading text-3xl text-white">GET IN TOUCH</h2>
              <p className="text-white/50 text-sm leading-relaxed">
                Have a question about your order or our plates? We&apos;d love to hear
                from you. Send us a message and we&apos;ll get back to you as soon as possible.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Phone, label: "Phone", value: "07387 575050", href: "tel:07387575050" },
                  { icon: Mail, label: "Email", value: "info@plateguy.co.uk", href: "mailto:info@plateguy.co.uk" },
                  { icon: MapPin, label: "Location", value: "Leeds, Yorkshire, UK", href: null },
                  { icon: Clock, label: "Hours", value: "Mon–Fri: 9:00am – 5:00pm", href: null },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-yellow/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-brand-yellow" />
                    </div>
                    <div>
                      <p className="text-xs text-white/30 uppercase tracking-widest">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm text-white hover:text-brand-yellow transition-colors font-medium">
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm text-white font-medium">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-brand-yellow/5 border border-brand-yellow/10 rounded-2xl p-5">
                <p className="text-sm font-semibold text-white mb-2">DVLA Registered Supplier</p>
                <p className="text-xs text-white/40 leading-relaxed">
                  PlateGuy is a DVLA-registered number plate supplier. All road legal plates
                  require proof of identity and entitlement to the registration number.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
