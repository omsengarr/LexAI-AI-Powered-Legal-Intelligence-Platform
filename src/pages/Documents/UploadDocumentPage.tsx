import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import UploadZone from "../../components/documents/UploadZone";

function UploadDocumentPage() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        <Topbar />

        <main className="p-8">
          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white">
              Upload Legal Document
            </h1>

            <p className="text-slate-400 mt-2">
              Upload contracts, agreements, judgments or other legal documents
              for AI-powered analysis.
            </p>
          </div>

          {/* Upload Area */}
          <UploadZone />
        </main>
      </div>
    </div>
  );
}

export default UploadDocumentPage;