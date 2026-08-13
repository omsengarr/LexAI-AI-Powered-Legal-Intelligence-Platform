import {
  useRef,
  useState,
} from "react";

import {
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";

import DocumentList from "./DocumentList";

import {
  uploadDocument,
} from "../../services/api";


function UploadDocumentPage() {

  // ========================================
  // State
  // ========================================

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [refreshKey, setRefreshKey] =
    useState(0);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);


  // ========================================
  // File Selection
  // ========================================

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setSuccessMessage("");
    setErrorMessage("");
  }


  // ========================================
  // Upload File
  // ========================================

  async function handleUpload() {

    if (!selectedFile) {

      setErrorMessage(
        "Please select a document first."
      );

      return;
    }

    try {

      setUploading(true);

      setSuccessMessage("");
      setErrorMessage("");

      const result =
        await uploadDocument(selectedFile);

      console.log(
        "Upload successful:",
        result
      );

      setSuccessMessage(
        `${selectedFile.name} uploaded successfully.`
      );

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setRefreshKey(
        (previous) => previous + 1
      );

    } catch (error) {

      console.error(
        "Upload failed:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to upload document."
      );

    } finally {

      setUploading(false);

    }
  }


  // ========================================
  // Page
  // ========================================

  return (

    <div className="w-full space-y-8">


      {/* ================================== */}
      {/* Page Header */}
      {/* ================================== */}

      <section
        className="
          rounded-2xl
          border
          border-slate-800
          bg-gradient-to-br
          from-slate-900
          via-slate-900
          to-cyan-950/30
          p-6
          md:p-8
        "
      >

        <div className="flex items-center gap-4">

          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-cyan-500/20
              bg-cyan-500/10
              text-cyan-400
            "
          >
            <Upload size={24} />
          </div>

          <div>

            <p
              className="
                text-sm
                font-medium
                uppercase
                tracking-wider
                text-cyan-400
              "
            >
              Document Intelligence
            </p>

            <h1
              className="
                mt-1
                text-3xl
                font-bold
                tracking-tight
                text-white
              "
            >
              Upload Legal Document
            </h1>

            <p
              className="
                mt-2
                max-w-3xl
                text-slate-400
              "
            >
              Upload contracts, agreements, judgments
              or other legal documents for AI-powered
              analysis.
            </p>

          </div>

        </div>

      </section>


      {/* ================================== */}
      {/* Upload Area */}
      {/* ================================== */}

      <section
        className="
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
          p-6
          md:p-8
        "
      >

        <div
          className="
            rounded-2xl
            border-2
            border-dashed
            border-slate-700
            bg-slate-950/50
            px-6
            py-12
            text-center
            transition
            hover:border-cyan-500/50
          "
        >

          {/* Upload Icon */}

          <div className="flex justify-center">

            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                border
                border-cyan-500/20
                bg-cyan-500/10
                text-cyan-400
              "
            >
              <Upload size={30} />
            </div>

          </div>


          {/* Title */}

          <h2
            className="
              mt-6
              text-xl
              font-semibold
              text-white
            "
          >
            Drag & Drop Your Legal Document
          </h2>


          {/* Description */}

          <p
            className="
              mt-2
              text-sm
              text-slate-400
            "
          >
            Supports PDF, DOCX and TXT files
          </p>


          {/* File Input */}

          <input
            ref={fileInputRef}
            id="document-upload"
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
          />


          {/* Browse Button */}

          <label
            htmlFor="document-upload"
            className="
              mt-6
              inline-flex
              cursor-pointer
              items-center
              justify-center
              rounded-lg
              bg-cyan-500
              px-6
              py-3
              font-semibold
              text-white
              transition
              hover:bg-cyan-400
            "
          >
            Browse Files
          </label>


          {/* Selected File */}

          {selectedFile && (

            <div
              className="
                mx-auto
                mt-6
                max-w-xl
                rounded-xl
                border
                border-slate-800
                bg-slate-900
                p-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-3
                "
              >

                <FileText
                  size={22}
                  className="text-cyan-400"
                />

                <div className="text-left">

                  <p className="font-medium text-white">
                    {selectedFile.name}
                  </p>

                  <p className="text-sm text-slate-500">
                    {(selectedFile.size / 1024).toFixed(1)}
                    {" KB"}
                  </p>

                </div>

              </div>


              {/* Upload Button */}

              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-green-500
                  px-6
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:bg-green-400
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {uploading ? (

                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />

                    Uploading...
                  </>

                ) : (

                  <>
                    <Upload size={20} />

                    Upload Document
                  </>

                )}

              </button>

            </div>

          )}

        </div>

      </section>


      {/* ================================== */}
      {/* Messages */}
      {/* ================================== */}

      {successMessage && (

        <div
          className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-green-500/30
            bg-green-500/10
            px-5
            py-4
            text-green-400
          "
        >

          <CheckCircle size={20} />

          <span>
            {successMessage}
          </span>

        </div>

      )}


      {errorMessage && (

        <div
          className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-red-500/30
            bg-red-500/10
            px-5
            py-4
            text-red-400
          "
        >

          <AlertCircle size={20} />

          <span>
            {errorMessage}
          </span>

        </div>

      )}


      {/* ================================== */}
      {/* Supported File Types */}
      {/* ================================== */}

      <section>

        <div className="mb-5">

          <h2 className="text-lg font-semibold text-white">
            Supported Document Types
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Upload legal documents in any of the
            supported formats.
          </p>

        </div>


        <div
          className="
            grid
            grid-cols-1
            gap-6
            md:grid-cols-3
          "
        >

          {/* PDF */}

          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-6
            "
          >

            <FileText
              size={24}
              className="text-cyan-400"
            />

            <h3 className="mt-4 font-semibold text-white">
              PDF Documents
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Upload legal PDFs for document analysis.
            </p>

          </div>


          {/* DOCX */}

          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-6
            "
          >

            <FileText
              size={24}
              className="text-purple-400"
            />

            <h3 className="mt-4 font-semibold text-white">
              DOCX Documents
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Analyze contracts and agreements in DOCX
              format.
            </p>

          </div>


          {/* TXT */}

          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-6
            "
          >

            <FileText
              size={24}
              className="text-green-400"
            />

            <h3 className="mt-4 font-semibold text-white">
              TXT Documents
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Upload plain-text legal documents for
              analysis.
            </p>

          </div>

        </div>

      </section>


      {/* ================================== */}
      {/* Existing Documents */}
      {/* ================================== */}

      <section>

        <div className="mb-5">

          <h2 className="text-2xl font-bold text-white">
            Uploaded Documents
          </h2>

          <p className="mt-1 text-slate-400">
            Documents currently stored in your
            LexAI database.
          </p>

        </div>


        <DocumentList
          refreshKey={refreshKey}
        />

      </section>


    </div>
  );
}


export default UploadDocumentPage;