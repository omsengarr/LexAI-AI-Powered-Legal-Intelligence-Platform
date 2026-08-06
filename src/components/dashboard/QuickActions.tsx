import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        Quick Actions
      </h2>

      <div className="space-y-4">
        <Button
          className="w-full"
          onClick={() => navigate("/documents/upload")}
        >
          Upload Document
        </Button>

        <Button
          variant="secondary"
          className="w-full"
          onClick={() => navigate("/chat")}
        >
          Start AI Chat
        </Button>

        <Button
          variant="secondary"
          className="w-full"
          onClick={() => navigate("/cases")}
        >
          Search Cases
        </Button>
      </div>
    </div>
  );
}

export default QuickActions;