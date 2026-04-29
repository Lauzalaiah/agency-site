import Link from "next/link"

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">

      {/* NAVBAR */}
      <header className="flex justify-between items-center px-10 py-6 border-b border-white/10">
        <h1 className="text-yellow-500 font-serif text-lg font-bold">
          LEO OFM ELITE
        </h1>

        <nav className="flex gap-6 text-sm text-white/80">
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#apply">Apply</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-28">
        <h2 className="text-4xl md:text-6xl font-serif text-yellow-500 mb-6">
          We Scale Creators to $10k–$50k/month
        </h2>

        <p className="max-w-xl text-white/70 mb-8">
          We help creators scale to $10k+/month on Fansly using proven marketing
          and monetization systems.
        </p>

        <a
          href="#apply"
          className="bg-yellow-500 text-black px-6 py-3 rounded-md font-medium hover:opacity-90 transition"
        >
          Apply for Private Management →
        </a>
      </section>

      {/* SERVICES */}
      <section id="services" className="text-center py-20 px-6">
        <h3 className="text-3xl font-serif text-yellow-500 mb-12">
          Our Services
        </h3>

        <div className="flex flex-wrap justify-center gap-6">
          {[
            {
              title: "Marketing",
              desc: "Growth strategy on social media platforms.",
            },
            {
              title: "Fan Messaging",
              desc: "Professional chat team managing conversations.",
            },
            {
              title: "Account Growth",
              desc: "Optimised pricing and content strategy.",
            },
            {
              title: "Traffic",
              desc: "Targeted traffic acquisition.",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="border border-yellow-500/20 p-6 w-[260px] rounded-lg hover:border-yellow-500 transition"
            >
              <h4 className="text-yellow-500 font-semibold mb-2">
                {s.title}
              </h4>
              <p className="text-white/60 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 text-center border-t border-white/10 border-b border-white/10">
        <div className="flex flex-wrap justify-center gap-16">
          <div>
            <p className="text-yellow-500 text-3xl">20+</p>
            <p className="text-white/60 text-sm">
              Creators supported worldwide
            </p>
          </div>

          <div>
            <p className="text-yellow-500 text-3xl">$500,000+</p>
            <p className="text-white/60 text-sm">
              Monthly revenue generated
            </p>
          </div>

          <div>
            <p className="text-yellow-500 text-3xl">Pro</p>
            <p className="text-white/60 text-sm">
              Professional management team
            </p>
          </div>
        </div>
      </section>

      {/* WHY JOIN */}
      <section id="process" className="py-20 text-center px-6">
        <h3 className="text-3xl font-serif text-yellow-500 mb-10">
          Why Join Our Agency
        </h3>

        <ul className="space-y-4 text-white/70">
          <li>✔ Professional marketing strategy</li>
          <li>✔ Fan messaging management</li>
          <li>✔ Revenue optimization</li>
          <li>✔ Audience growth</li>
        </ul>
      </section>

      {/* APPLY */}
      <section id="apply" className="py-20 text-center px-6">
        <h3 className="text-3xl font-serif text-yellow-500 mb-10">
          Apply for Private Management →
        </h3>

        <form
          action="/api/apply"
          method="POST"
          className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="name"
            placeholder="Name"
            required
            className="bg-black border border-white/10 p-3"
          />
          <input
            name="instagram"
            placeholder="Instagram / Social Media"
            required
            className="bg-black border border-white/10 p-3"
          />
          <input
            name="country"
            placeholder="Country"
            required
            className="bg-black border border-white/10 p-3"
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            required
            className="bg-black border border-white/10 p-3"
          />

          <div className="md:col-span-2">
            <button className="bg-yellow-500 text-black px-6 py-3 mt-4">
              Submit Application
            </button>
          </div>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-white/40 text-sm py-10 border-t border-white/10">
        © 2026 Leo OFM Elite
      </footer>
    </div>
  )
}
