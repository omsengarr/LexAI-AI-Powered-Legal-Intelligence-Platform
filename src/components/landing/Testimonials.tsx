import Container from "../ui/Container";

function Testimonials() {
  const testimonials = [
    {
      name: "Aarav Sharma",
      role: "Law Student",
      review:
        "LexAI reduced my legal research time dramatically. The AI summaries are incredibly useful.",
    },
    {
      name: "Priya Mehta",
      role: "Advocate",
      review:
        "The document analysis feature helps me prepare cases much faster than before.",
    },
    {
      name: "Rahul Verma",
      role: "Legal Consultant",
      review:
        "A fantastic platform. Clean interface and very powerful AI tools.",
    },
  ];

  return (
    <section className="bg-slate-900 py-24">
      <Container>
        <h2 className="text-4xl font-bold text-white text-center">
          What Our Users Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-2xl p-8"
            >
              <p className="text-slate-300 italic">
                "{item.review}"
              </p>

              <h3 className="text-white font-semibold mt-6">
                {item.name}
              </h3>

              <p className="text-cyan-400">
                {item.role}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Testimonials;