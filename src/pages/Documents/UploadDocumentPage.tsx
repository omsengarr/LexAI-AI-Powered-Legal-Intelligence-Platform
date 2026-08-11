import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileText, X } from "lucide-react";
import { uploadDocument } from "../../services/api";

function UploadDocumentPage() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ========================================
  // Handle Selected File
  // ========================================

  const handleFile = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF, DOCX, or TXT file.");
      return;
    }

    setSelectedFile(file);
    setUploadMessage("");
  };

  // ========================================
  // File Input Change
  // ========================================

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  // ========================================
  // Drag & Drop
  // ========================================

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

  // ========================================
  // Remove File
  // ========================================

  const removeFile = () => {
    setSelectedFile(null);
    setUploadMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ========================================
  // Upload Document to FastAPI
  // ========================================

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a document first.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadMessage("");

      const result = await uploadDocument(selectedFile);

      console.log("Upload response:", result);

      setUploadMessage(
        `Successfully uploaded: ${result.filename}`
      );

      // Navigate to Documents page after successful upload
      setTimeout(() => {
        navigate("/documents");
      }, 1000);

    } catch (error) {
      console.error("Upload error:", error);

      setUploadMessage(
        "Upload failed. Please make sure the backend is running."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="p-8 space-y-8">

      {/* ============================== */}
      {/* Page Header */}
      {/* ============================== */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Upload Legal Document
        </h1>

        <p className="text-slate-400 mt-2">
          Upload contracts, agreements, judgments or other
          legal documents for AI-powered analysis.
        </p>
      </div>

      {/* ============================== */}
      {/* Upload Area */}
      {/* ============================== */}

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

        <h2 className="
          text-2xl
          font-bold
          text-white
        ">
          Drag & Drop Your Legal Document
        </h2>

        {/* Description */}

        <p className="
          text-slate-400
          mt-3
        ">
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

      {/* ============================== */}
      {/* Selected File */}
      {/* ============================== */}

      {selectedFile && (
        <div className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-5
        ">

          <div className="
            flex
            items-center
            justify-between
            gap-4
          ">

            <div className="
              flex
              items-center
              gap-4
            ">

              {/* File Icon */}

              <div className="
                w-12
                h-12
                rounded-xl
                bg-cyan-500/10
                flex
                items-center
                justify-center
              ">
                <FileText
                  size={24}
                  className="text-cyan-400"
                />
              </div>

              {/* File Information */}

              <div>

                <p className="
                  text-white
                  font-semibold
                  break-all
                ">
                  {selectedFile.name}
                </p>

                <p className="
                  text-slate-400
                  text-sm
                  mt-1
                ">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>

              </div>

            </div>

            {/* Remove File */}

            <button
              type="button"
              onClick={removeFile}
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
              "
              aria-label="Remove selected file"
            >
              <X size={20} />
            </button>

          </div>

          {/* ============================== */}
          {/* Upload Button */}
          {/* ============================== */}

          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="
              mt-5
              w-full
              px-6
              py-3
              rounded-xl
              bg-cyan-500
              hover:bg-cyan-400
              disabled:bg-slate-700
              disabled:cursor-not-allowed
              text-white
              font-semibold
              transition
            "
          >
            {isUploading
              ? "Uploading..."
              : "Upload Document"}
          </button>

        </div>
      )}

      {/* ============================== */}
      {/* Upload Message */}
      {/* ============================== */}

      {uploadMessage && (
        <div className="
          bg-slate-900
          border
          border-slate-800
          rounded-xl
          p-4
        ">
          <p className="
            text-cyan-400
            font-medium
          ">
            {uploadMessage}
          </p>
        </div>
      )}

      {/* ============================== */}
      {/* Information */}
      {/* ============================== */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-4
      ">

        {/* PDF */}

        <div className="
          bg-slate-900
          border
          border-slate-800
          rounded-xl
          p-5
        ">
          <h3 className="text-white font-semibold">
            PDF Documents
          </h3>

          <p className="text-slate-400 text-sm mt-2">
            Upload legal PDFs for document analysis.
          </p>
        </div>

        {/* DOCX */}

        <div className="
          bg-slate-900
          border
          border-slate-800
          rounded-xl
          p-5
        ">
          <h3 className="text-white font-semibold">
            DOCX Documents
          </h3>

          <p className="text-slate-400 text-sm mt-2">
            Analyze contracts and agreements in DOCX format.
          </p>
        </div>

        {/* TXT */}

        <div className="
          bg-slate-900
          border
          border-slate-800
          rounded-xl
          p-5
        ">
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