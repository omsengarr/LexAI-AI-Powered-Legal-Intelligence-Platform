import {
  FaBalanceScale,
  FaFileAlt,
  FaSearch,
  FaRobot,
  FaShieldAlt,
  FaGavel,
} from "react-icons/fa";

import { motion } from "framer-motion";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

function Features() {
  const features = [
    {
      icon: <FaBalanceScale size={35} />,
      title: "AI Case Research",
      description:
        "Quickly search legal cases with intelligent AI-powered recommendations.",
    },
    {
      icon: <FaFileAlt size={35} />,
      title: "Document Summaries",
      description:
        "Generate concise summaries of lengthy legal judgments in seconds.",
    },
    {
      icon: <FaSearch size={35} />,
      title: "Smart Search",
      description:
        "Find relevant legal information using natural language queries.",
    },
    {
      icon: <FaRobot size={35} />,
      title: "AI Assistant",
      description:
        "Ask legal questions and receive AI-generated explanations instantly.",
    },
    {
      icon: <FaShieldAlt size={35} />,
      title: "Secure Platform",
      description:
        "Your legal documents remain private and protected at all times.",
    },
    {
      icon: <FaGavel size={35} />,
      title: "Judgment Comparison",
      description:
        "Compare multiple judgments side by side with AI insights.",
    },
  ];

  return (
    <section className="bg-slate-900 py-24">
      <Container>
        <SectionTitle
          title="Powerful Features"
          subtitle="Everything you need for intelligent legal research."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                y: -12,
                scale: 1.03,
              }}
              transition={{
                duration: 0.4,
              }}
              viewport={{ once: true }}
              className="group bg-slate-800/80 border border-slate-700 rounded-3xl p-8 backdrop-blur-sm hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300"
            >
              <div className="text-cyan-400 mb-6 transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-semibold text-white mb-4">
                {feature.title}
              </h3>

              <p className="text-slate-400 leading-7">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Features;