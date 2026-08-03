import { motion } from "framer-motion";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

function Stats() {
  const stats = [
    {
      number: "10,000+",
      label: "Cases Indexed",
    },
    {
      number: "98%",
      label: "AI Accuracy",
    },
    {
      number: "50+",
      label: "Legal Domains",
    },
    {
      number: "24/7",
      label: "AI Assistance",
    },
  ];

  return (
    <section className="bg-slate-950 py-24">
      <Container>
        <SectionTitle
          title="Trusted by Legal Professionals"
          subtitle="Our platform helps students, advocates, and professionals perform legal research faster than ever."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="text-center bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-cyan-400 transition-all duration-300"
            >
              <h2 className="text-5xl font-bold text-cyan-400">
                {stat.number}
              </h2>

              <p className="mt-4 text-slate-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Stats;