import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface ComplianceItemProps {
  title: string;
  status: boolean;
}

function ComplianceItem({
  title,
  status,
}: ComplianceItemProps) {
  return (
    <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-5">

      <span className="text-white">
        {title}
      </span>

      {status ? (
        <FaCheckCircle className="text-green-400 text-xl" />
      ) : (
        <FaTimesCircle className="text-red-400 text-xl" />
      )}

    </div>
  );
}

export default ComplianceItem;