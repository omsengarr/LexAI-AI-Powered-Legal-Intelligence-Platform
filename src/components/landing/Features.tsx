import {
  FaBalanceScale,
  FaFileAlt,
  FaSearch,
  FaRobot,
  FaShieldAlt,
  FaGavel,
} from "react-icons/fa";

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
    <section className="bg-slate-900 py-24 px-6">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-4xl font-bold text-center text-white">
          Powerful Features
        </h2>

        <p className="text-center text-slate-400 mt-4 mb-16">
          Everything you need for intelligent legal research.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-2xl p-8 hover:scale-105 transition duration-300"
            >
              <div className="text-cyan-400 mb-5">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-semibold text-white mb-4">
                {feature.title}
              </h3>

              <p className="text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Features;