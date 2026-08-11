import { useEffect, useState } from "react";
import { FileText, Loader2, AlertCircle } from "lucide-react";
import { getDocuments } from "../../services/api";

interface Document {
  id: number;
  filename: string;
  content_type: string;
  uploaded_at: string;
}

function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      setLoading(true);
      setError("");

      const data = await getDocuments();

      setDocuments(data);
    } catch (err) {
      console.error("Failed to load documents:", err);
      setError("Unable to load documents.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading documents...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 text-red-400">
        <AlertCircle className="w-5 h-5" />
        {error}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400">
        No documents uploaded yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <div
          key={document.id}
          className="flex items-center justify-between p-4 rounded-xl bg-slate-800/60 border border-slate-700"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-cyan-500/10">
              <FileText className="w-6 h-6 text-cyan-400" />
            </div>

            <div>
              <h3 className="font-medium text-white">
                {document.filename}
              </h3>

              <p className="text-sm text-slate-400">
                {document.content_type}
              </p>
            </div>
          </div>

          <div className="text-sm text-slate-500">
            {new Date(document.uploaded_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DocumentList;