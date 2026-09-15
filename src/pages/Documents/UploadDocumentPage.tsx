import {
  useRef,
  useState,
} from "react";

import type { ChangeEvent } from "react";

import {
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
  FileType2,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  Database,
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
    event: ChangeEvent<HTMLInputElement>
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

    <div className="relative w-full space-y-8 pb-6">

      {/* ========================================
          Ambient Background
      ======================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        <div
          className="
            absolute
            left-[15%]
            top-[-12%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-cyan-500/[0.035]
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            right-[5%]
            top-[35%]
            h-[360px]
            w-[360px]
            rounded-full
            bg-purple-500/[0.025]
            blur-[120px]
          "
        />

      </div>


      {/* ========================================
          Page Header
      ======================================== */}

      <section
        className="
          relative
          overflow-hidden
          rounded-[28px]
          border
          border-slate-800/80
          bg-[#070d18]
          shadow-[0_25px_80px_rgba(0,0,0,0.24)]
        "
      >

        {/* Background glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-24
            -top-28
            h-80
            w-80
            rounded-full
            bg-cyan-400/[0.08]
            blur-[100px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            bottom-[-80px]
            left-[35%]
            h-64
            w-64
            rounded-full
            bg-blue-500/[0.04]
            blur-[100px]
          "
        />

        {/* Decorative grid */}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.35) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative p-6 sm:p-8 lg:p-10">

          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

            {/* Main heading */}

            <div className="max-w-3xl">

              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-cyan-400/15
                  bg-cyan-400/[0.06]
                  px-3
                  py-1.5
                "
              >

                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />

                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-cyan-400
                  "
                >
                  Document Intelligence
                </span>

              </div>


              <h1
                className="
                  text-3xl
                  font-bold
                  tracking-[-0.03em]
                  text-white
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                Upload your legal documents.
                <span
                  className="
                    block
                    bg-gradient-to-r
                    from-white
                    via-slate-200
                    to-cyan-400
                    bg-clip-text
                    text-transparent
                  "
                >
                  Let LexAI do the analysis.
                </span>
              </h1>


              <p
                className="
                  mt-4
                  max-w-2xl
                  text-sm
                  leading-7
                  text-slate-500
                  sm:text-base
                "
              >
                Upload contracts, agreements, judgments,
                or other legal documents and prepare them
                for AI-powered legal intelligence.
              </p>

            </div>


            {/* Header status */}

            <div
              className="
                w-full
                shrink-0
                lg:w-[260px]
              "
            >

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-800
                  bg-slate-950/70
                  p-5
                  backdrop-blur-xl
                "
              >

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-10
                    -top-10
                    h-28
                    w-28
                    rounded-full
                    bg-cyan-400/[0.07]
                    blur-2xl
                  "
                />

                <div className="relative">

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-cyan-400/15
                        bg-cyan-400/[0.07]
                      "
                    >
                      <ShieldCheck className="h-4 w-4 text-cyan-400" />
                    </div>

                    <div>

                      <p className="text-xs font-semibold text-white">
                        Secure Processing
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-600">
                        Your workspace
                      </p>

                    </div>

                  </div>


                  <div className="mt-4 flex items-center gap-2">

                    <span className="relative flex h-1.5 w-1.5">

                      <span
                        className="
                          absolute
                          inline-flex
                          h-full
                          w-full
                          animate-ping
                          rounded-full
                          bg-emerald-400
                          opacity-30
                        "
                      />

                      <span
                        className="
                          relative
                          h-1.5
                          w-1.5
                          rounded-full
                          bg-emerald-400
                        "
                      />

                    </span>

                    <span className="text-[10px] text-emerald-400">
                      Ready for upload
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          Upload Workspace
      ======================================== */}

      <section>

        <div className="mb-5">

          <div className="flex items-center gap-2">

            <div
              className="
                h-5
                w-1
                rounded-full
                bg-cyan-400
                shadow-[0_0_12px_rgba(34,211,238,0.6)]
              "
            />

            <h2 className="text-lg font-semibold tracking-tight text-white">
              Upload Workspace
            </h2>

          </div>

          <p className="mt-1.5 text-sm text-slate-600">
            Select a legal document to begin processing.
          </p>

        </div>


        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-slate-800/80
            bg-[#080e19]
            p-1
            shadow-[0_20px_60px_rgba(0,0,0,0.18)]
          "
        >

          {/* Top glow */}

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-0
              h-32
              w-72
              -translate-x-1/2
              rounded-full
              bg-cyan-400/[0.045]
              blur-3xl
            "
          />

          <div className="relative p-5 sm:p-6 lg:p-8">

            {/* Upload drop-style area */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-dashed
                border-slate-700
                bg-slate-950/60
                px-5
                py-12
                text-center
                transition-all
                duration-300
                hover:border-cyan-400/30
                hover:bg-cyan-400/[0.018]
                sm:px-8
                sm:py-16
              "
            >

              {/* Corner glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-0
                  h-40
                  w-40
                  -translate-x-1/2
                  rounded-full
                  bg-cyan-400/[0.04]
                  blur-3xl
                  transition-all
                  duration-500
                  group-hover:bg-cyan-400/[0.07]
                "
              />


              <div className="relative">

                {/* Upload icon */}

                <div className="flex justify-center">

                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-cyan-400/20
                      bg-cyan-400/[0.07]
                      text-cyan-400
                      shadow-[0_0_40px_rgba(34,211,238,0.05)]
                      transition-all
                      duration-300
                      group-hover:scale-105
                      group-hover:border-cyan-400/30
                      group-hover:bg-cyan-400/[0.1]
                    "
                  >
                    <Upload className="h-7 w-7" />
                  </div>

                </div>


                {/* Title */}

                <h2
                  className="
                    mt-6
                    text-xl
                    font-semibold
                    tracking-tight
                    text-white
                    sm:text-2xl
                  "
                >
                  Select a legal document
                </h2>


                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
                  Choose a file from your computer to
                  upload it into your LexAI workspace.
                </p>


                {/* Supported formats */}

                <div className="mt-5 flex flex-wrap justify-center gap-2">

                  <span
                    className="
                      rounded-full
                      border
                      border-slate-800
                      bg-slate-900/60
                      px-3
                      py-1
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.12em]
                      text-slate-600
                    "
                  >
                    PDF
                  </span>

                  <span
                    className="
                      rounded-full
                      border
                      border-slate-800
                      bg-slate-900/60
                      px-3
                      py-1
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.12em]
                      text-slate-600
                    "
                  >
                    DOCX
                  </span>

                  <span
                    className="
                      rounded-full
                      border
                      border-slate-800
                      bg-slate-900/60
                      px-3
                      py-1
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.12em]
                      text-slate-600
                    "
                  >
                    TXT
                  </span>

                </div>


                {/* File input */}

                <input
                  ref={fileInputRef}
                  id="document-upload"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />


                {/* Browse button */}

                <label
                  htmlFor="document-upload"
                  className="
                    mt-7
                    inline-flex
                    cursor-pointer
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-cyan-400/20
                    bg-cyan-400/[0.09]
                    px-5
                    py-3
                    text-xs
                    font-semibold
                    text-cyan-300
                    shadow-[0_0_30px_rgba(34,211,238,0.04)]
                    transition-all
                    duration-300
                    hover:border-cyan-400/35
                    hover:bg-cyan-400/[0.14]
                    hover:text-cyan-200
                  "
                >

                  <Upload className="h-4 w-4" />

                  Browse Files

                  <ArrowUpRight className="h-3.5 w-3.5" />

                </label>


                <p className="mt-3 text-[9px] uppercase tracking-[0.14em] text-slate-700">
                  Maximum supported formats: PDF • DOCX • TXT
                </p>

              </div>

            </div>


            {/* ========================================
                Selected File
            ======================================== */}

            {selectedFile && (

              <div
                className="
                  relative
                  mt-4
                  overflow-hidden
                  rounded-2xl
                  border
                  border-cyan-400/15
                  bg-cyan-400/[0.035]
                  p-4
                  sm:p-5
                "
              >

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex min-w-0 items-center gap-3">

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-cyan-400/15
                        bg-cyan-400/[0.07]
                      "
                    >
                      <FileText className="h-5 w-5 text-cyan-400" />
                    </div>


                    <div className="min-w-0">

                      <p className="truncate text-xs font-semibold text-white">
                        {selectedFile.name}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-600">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="
                      inline-flex
                      shrink-0
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-cyan-400/20
                      bg-cyan-400/[0.09]
                      px-5
                      py-3
                      text-xs
                      font-semibold
                      text-cyan-300
                      transition-all
                      duration-300
                      hover:border-cyan-400/35
                      hover:bg-cyan-400/[0.14]
                      hover:text-cyan-200
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >

                    {uploading ? (

                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />

                        Uploading...
                      </>

                    ) : (

                      <>
                        <Upload className="h-4 w-4" />

                        Upload Document
                      </>

                    )}

                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      </section>


      {/* ========================================
          Messages
      ======================================== */}

      {successMessage && (

        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-emerald-400/15
            bg-emerald-400/[0.045]
            px-5
            py-4
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-emerald-400/15
                bg-emerald-400/[0.07]
              "
            >
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </div>

            <div>

              <p className="text-xs font-semibold text-emerald-300">
                Upload successful
              </p>

              <p className="mt-0.5 text-[10px] text-emerald-400/60">
                {successMessage}
              </p>

            </div>

          </div>

        </div>

      )}


      {errorMessage && (

        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-red-400/15
            bg-red-400/[0.045]
            px-5
            py-4
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-red-400/15
                bg-red-400/[0.07]
              "
            >
              <AlertCircle className="h-4 w-4 text-red-400" />
            </div>

            <div>

              <p className="text-xs font-semibold text-red-300">
                Upload failed
              </p>

              <p className="mt-0.5 text-[10px] text-red-400/60">
                {errorMessage}
              </p>

            </div>

          </div>

        </div>

      )}


      {/* ========================================
          Supported Document Types
      ======================================== */}

      <section>

        <div className="mb-5">

          <div className="flex items-center gap-2">

            <div
              className="
                h-5
                w-1
                rounded-full
                bg-cyan-400
                shadow-[0_0_12px_rgba(34,211,238,0.6)]
              "
            />

            <h2 className="text-lg font-semibold tracking-tight text-white">
              Supported Document Types
            </h2>

          </div>

          <p className="mt-1.5 text-sm text-slate-600">
            Upload legal documents in the formats supported by LexAI.
          </p>

        </div>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* PDF */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-800/80
              bg-[#080e19]
              p-5
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-slate-700
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                -right-10
                -top-10
                h-28
                w-28
                rounded-full
                bg-cyan-400/[0.035]
                blur-3xl
                transition-all
                duration-300
                group-hover:bg-cyan-400/[0.06]
              "
            />

            <div className="relative">

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-cyan-400/15
                  bg-cyan-400/[0.07]
                "
              >
                <FileText className="h-4 w-4 text-cyan-400" />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-white">
                PDF Documents
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                Legal PDFs ready for document intelligence
                and analysis.
              </p>

              <div className="mt-4 text-[9px] font-medium uppercase tracking-[0.12em] text-cyan-500/70">
                .pdf
              </div>

            </div>

          </div>


          {/* DOCX */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-800/80
              bg-[#080e19]
              p-5
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-slate-700
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                -right-10
                -top-10
                h-28
                w-28
                rounded-full
                bg-purple-400/[0.035]
                blur-3xl
                transition-all
                duration-300
                group-hover:bg-purple-400/[0.06]
              "
            />

            <div className="relative">

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-purple-400/15
                  bg-purple-400/[0.07]
                "
              >
                <FileType2 className="h-4 w-4 text-purple-400" />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-white">
                DOCX Documents
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                Analyze contracts and agreements in DOCX
                format.
              </p>

              <div className="mt-4 text-[9px] font-medium uppercase tracking-[0.12em] text-purple-400/70">
                .docx
              </div>

            </div>

          </div>


          {/* TXT */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-800/80
              bg-[#080e19]
              p-5
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-slate-700
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                -right-10
                -top-10
                h-28
                w-28
                rounded-full
                bg-emerald-400/[0.035]
                blur-3xl
                transition-all
                duration-300
                group-hover:bg-emerald-400/[0.06]
              "
            />

            <div className="relative">

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-emerald-400/15
                  bg-emerald-400/[0.07]
                "
              >
                <FileText className="h-4 w-4 text-emerald-400" />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-white">
                TXT Documents
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                Upload plain-text legal documents for
                analysis and processing.
              </p>

              <div className="mt-4 text-[9px] font-medium uppercase tracking-[0.12em] text-emerald-400/70">
                .txt
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          Uploaded Documents
      ======================================== */}

      <section>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <div
                className="
                  h-5
                  w-1
                  rounded-full
                  bg-cyan-400
                  shadow-[0_0_12px_rgba(34,211,238,0.6)]
                "
              />

              <h2 className="text-lg font-semibold tracking-tight text-white">
                Uploaded Documents
              </h2>

            </div>

            <p className="mt-1.5 text-sm text-slate-600">
              Documents currently stored in your LexAI workspace.
            </p>

          </div>


          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-slate-800
              bg-slate-900/50
              px-3
              py-1.5
              text-[9px]
              font-medium
              uppercase
              tracking-[0.13em]
              text-slate-600
            "
          >

            <Database className="h-3 w-3 text-cyan-500" />

            Document repository

          </div>

        </div>


        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-800/80
            bg-slate-900/20
            p-1
            shadow-[0_20px_60px_rgba(0,0,0,0.12)]
          "
        >

          <DocumentList
            refreshKey={refreshKey}
          />

        </div>

      </section>


      {/* ========================================
          Bottom Status
      ======================================== */}

      <section
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-slate-800/80
          bg-[#050a12]
        "
      >

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-28
            w-64
            -translate-x-1/2
            rounded-full
            bg-cyan-400/[0.04]
            blur-3xl
          "
        />

        <div className="relative flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-cyan-400/15
                bg-cyan-400/[0.06]
              "
            >
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
            </div>

            <div>

              <p className="text-xs font-semibold text-slate-300">
                LexAI Document Intelligence
              </p>

              <p className="mt-0.5 text-[10px] text-slate-700">
                Upload a document whenever you're ready.
              </p>

            </div>

          </div>


          <div className="flex items-center gap-2">

            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-emerald-400
                shadow-[0_0_8px_rgba(52,211,153,0.7)]
              "
            />

            <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-slate-700">
              Processing services ready
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}


export default UploadDocumentPage;