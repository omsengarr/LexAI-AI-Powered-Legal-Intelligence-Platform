import { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle,
  Loader2,
} from "lucide-react";

function UploadDocumentPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    const allowedExtensions = [".pdf", ".docx", ".txt"];

    const fileExtension =
      "." + file.name.split(".").pop()?.toLowerCase();

    const isValidType =
      allowedTypes.includes(file.type) ||
      allowedExtensions.includes(fileExtension);

    if (!isValidType) {
      alert("Please upload a PDF, DOCX, or TXT file.");
      return;
    }

    setSelectedFile(file);
    setAnalysisComplete(false);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setAnalysisComplete(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      return;
    }

    setIsAnalyzing(true);
    setAnalysisComplete(false);

    /*
      Temporary frontend demo.

      Later we will replace this with:
      fetch() → FastAPI backend → AI analysis
    */

    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    setIsAnalyzing(false);
    setAnalysisComplete(true);
  };

  return (
    <main className="p-8 space-y-8">
      {/* ================================= */}
      {/* Page Header */}
      {/* ================================= */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Upload Legal Document
        </h1>

        <p className="text-slate-400 mt-2">
          Upload contracts, agreements, judgments or other
          legal documents for AI-powered analysis.
        </p>
      </div>

      {/* ================================= */}
      {/* Upload Area */}
      {/* ================================= */}

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => {
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        className={`
          min-h-[330px]
          rounded-2xl
          border-2
          border-dashed
          flex
          flex-col
          items-center
          justify-center
          text-center
          transition-all
          duration-300
          ${
            isDragging
              ? "border-cyan-400 bg-cyan-500/10"
              : "border-slate-700 bg-slate-900"
          }
        `}
      >
        {/* Upload Icon */}

        <div
          className="
            w-16
            h-16
            rounded-full
            bg-cyan-500/10
            flex
            items-center
            justify-center
            mb-5
          "
        >
          <UploadCloud
            size={42}
            className="text-cyan-400"
          />
        </div>

        {/* Title */}

        <h2 className="text-2xl font-bold text-white">
          Drag & Drop Your Legal Document
        </h2>

        {/* Description */}

        <p className="text-slate-400 mt-3">
          Supports PDF, DOCX and TXT files
        </p>

        {/* Browse Button */}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="
            mt-7
            px-7
            py-3
            rounded-xl
            bg-cyan-500
            hover:bg-cyan-400
            text-white
            font-semibold
            transition-all
            duration-200
            shadow-lg
            hover:shadow-cyan-500/20
          "
        >
          Browse Files
        </button>

        {/* Hidden File Input */}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* ================================= */}
      {/* Selected File */}
      {/* ================================= */}

      {selectedFile && (
        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-5
          "
        >
          <div className="flex items-center justify-between gap-4">
            {/* File Information */}

            <div className="flex items-center gap-4 min-w-0">
              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-cyan-500/10
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <FileText
                  size={24}
                  className="text-cyan-400"
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-white
                    font-semibold
                    break-all
                  "
                >
                  {selectedFile.name}
                </p>

                <p className="text-slate-400 text-sm mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            {/* Remove Button */}

            <button
              type="button"
              onClick={removeFile}
              disabled={isAnalyzing}
              className="
                w-10
                h-10
                rounded-lg
                flex
                items-center
                justify-center
                text-slate-400
                hover:text-red-400
                hover:bg-red-500/10
                transition
                disabled:opacity-50
                shrink-0
              "
              aria-label="Remove selected file"
            >
              <X size={20} />
            </button>
          </div>

          {/* Analyze Button */}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="
              mt-5
              w-full
              px-6
              py-3
              rounded-xl
              bg-cyan-500
              hover:bg-cyan-400
              disabled:bg-slate-700
              disabled:text-slate-400
              text-white
              font-semibold
              transition
              flex
              items-center
              justify-center
              gap-2
            "
          >
            {isAnalyzing ? (
              <>
                <Loader2
                  size={20}
                  className="animate-spin"
                />

                Analyzing Document...
              </>
            ) : (
              <>
                <FileText size={20} />

                Analyze Document
              </>
            )}
          </button>

          {/* Analysis Complete */}

          {analysisComplete && (
            <div
              className="
                mt-4
                flex
                items-center
                gap-3
                rounded-xl
                bg-green-500/10
                border
                border-green-500/20
                p-4
              "
            >
              <CheckCircle
                size={22}
                className="text-green-400 shrink-0"
              />

              <div>
                <p className="text-green-400 font-semibold">
                  Analysis completed
                </p>

                <p className="text-slate-400 text-sm mt-1">
                  Your document is ready for AI-powered
                  legal analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================= */}
      {/* Information Cards */}
      {/* ================================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* PDF */}

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-xl
            p-5
          "
        >
          <h3 className="text-white font-semibold">
            PDF Documents
          </h3>

          <p className="text-slate-400 text-sm mt-2">
            Upload legal PDFs for document analysis.
          </p>
        </div>

        {/* DOCX */}

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-xl
            p-5
          "
        >
          <h3 className="text-white font-semibold">
            DOCX Documents
          </h3>

          <p className="text-slate-400 text-sm mt-2">
            Analyze contracts and agreements in DOCX format.
          </p>
        </div>

        {/* TXT */}

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-xl
            p-5
          "
        >
          <h3 className="text-white font-semibold">
            TXT Documents
          </h3>

          <p className="text-slate-400 text-sm mt-2">
            Upload plain-text legal documents for analysis.
          </p>
        </div>
      </div>
    </main>
  );
}

export default UploadDocumentPage;