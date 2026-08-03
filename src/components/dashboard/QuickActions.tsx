import Button from "../ui/Button";

function QuickActions() {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        Quick Actions
      </h2>

      <div className="space-y-4">

        <Button className="w-full">
          Upload Document
        </Button>

        <Button
          variant="secondary"
          className="w-full"
        >
          Start AI Chat
        </Button>

        <Button
          variant="secondary"
          className="w-full"
        >
          Search Cases
        </Button>

      </div>

    </div>
  );
}

export default QuickActions;