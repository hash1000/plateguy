import { FileText, CreditCard, Car, CheckCircle } from "lucide-react";

const docs = [
  {
    icon: CreditCard,
    title: "Proof of Identity",
    description: "We require one of the following to verify your identity:",
    items: [
      "Valid UK Driving Licence (full or provisional)",
      "Valid Passport",
      "National Identity Card (EU citizens)",
    ],
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  {
    icon: Car,
    title: "Proof of Entitlement",
    description: "We require one of the following to confirm your right to the registration:",
    items: [
      "V5C Logbook (vehicle registration certificate)",
      "V5C/2 New Keeper Supplement",
      "Certificate of Entitlement for a cherished mark",
      "Retention Certificate",
    ],
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
  },
];

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-brand-black">
      <section className="bg-brand-dark border-b border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-brand-yellow text-xs font-semibold tracking-[0.3em] uppercase mb-2">
            Legal Requirements
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl text-white leading-none">
            REQUIRED DOCUMENTS
          </h1>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-brand-yellow/5 border border-brand-yellow/10 rounded-2xl p-6 mb-10">
            <div className="flex items-start gap-3">
              <FileText size={20} className="text-brand-yellow flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white mb-1">Why do we require documents?</p>
                <p className="text-sm text-white/60 leading-relaxed">
                  As a DVLA-registered number plate supplier, we are legally required to verify
                  the identity of all customers purchasing road legal number plates, and confirm
                  their right to use the registration number. This is to prevent plate fraud and
                  ensure the safety of all road users. Show plates do not require any documents.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {docs.map(({ icon: Icon, title, description, items, color, bg, border }) => (
              <div key={title} className={`bg-brand-dark border ${border} rounded-2xl p-6`}>
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={22} className={color} />
                </div>
                <h2 className={`font-heading text-2xl text-white mb-2`}>{title}</h2>
                <p className="text-sm text-white/50 mb-4">{description}</p>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-white/70">
                      <CheckCircle size={14} className={`${color} flex-shrink-0 mt-0.5`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-brand-gray border border-white/5 rounded-2xl p-6">
            <h2 className="font-heading text-2xl text-white mb-4">HOW TO SUBMIT DOCUMENTS</h2>
            <div className="space-y-3 text-sm text-white/60 leading-relaxed">
              <p>
                Documents can be submitted securely during the checkout process. You can upload
                clear photos or scans of your documents directly through our secure order portal.
              </p>
              <p>
                Alternatively, you can email your documents to{" "}
                <a href="mailto:info@plateguy.co.uk" className="text-brand-yellow hover:underline">
                  info@plateguy.co.uk
                </a>{" "}
                with your order number in the subject line.
              </p>
              <p>
                All documents are handled securely and in accordance with our privacy policy.
                We do not store your documents longer than necessary.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
