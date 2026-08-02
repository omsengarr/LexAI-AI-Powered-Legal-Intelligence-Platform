function FAQ() {
  return (
    <section className="bg-slate-950 py-24 px-6">
      <div className="max-w-4xl mx-auto">

        <h2 className="text-4xl font-bold text-center text-white mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-8">

          <div>
            <h3 className="text-xl text-cyan-400 font-semibold">
              Is LexAI free?
            </h3>

            <p className="text-slate-400 mt-2">
              Yes. Students can start with a free plan.
            </p>
          </div>

          <div>
            <h3 className="text-xl text-cyan-400 font-semibold">
              Does LexAI replace legal advice?
            </h3>

            <p className="text-slate-400 mt-2">
              No. It assists legal research but does not replace professional legal advice.
            </p>
          </div>

          <div>
            <h3 className="text-xl text-cyan-400 font-semibold">
              Which legal documents are supported?
            </h3>

            <p className="text-slate-400 mt-2">
              Judgments, contracts, petitions, and many other legal documents.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default FAQ;