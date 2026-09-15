import { useEffect, useState } from "react";

import {
  FileText,
  Trash2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Database,
  Clock3,
  FileType2,
} from "lucide-react";

import {
  getDocuments,
  deleteDocument,
} from "../../services/api";


// ========================================
// Document Type
// ========================================

interface DocumentItem {
  id: number;
  filename: string;
  content_type?: string;
  uploaded_at?: string;
}


// ========================================
// Props
// ========================================

interface DocumentListProps {
  refreshKey?: number;
}


// ========================================
// Document List
// ========================================

function DocumentList({
  refreshKey = 0,
}: DocumentListProps) {

  const [documents, setDocuments] =
    useState<DocumentItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deletingId, setDeletingId] =
    useState<number | null>(null);


  // ========================================
  // Load Documents
  // ========================================

  async function loadDocuments() {

    try {

      setLoading(true);
      setError("");

      const data =
        await getDocuments();

      console.log(
        "Documents:",
        data
      );

      setDocuments(
        Array.isArray(data)
          ? data
          : data.documents || []
      );

    } catch (error) {

      console.error(
        "Failed to load documents:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load documents."
      );

    } finally {

      setLoading(false);

    }
  }


  // ========================================
  // Load On Mount / Refresh
  // ========================================

  useEffect(() => {

    loadDocuments();

  }, [refreshKey]);


  // ========================================
  // Delete Document
  // ========================================

  async function handleDelete(
    documentId: number
  ) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this document?"
      );

    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(documentId);

      setError("");

      await deleteDocument(
        documentId
      );


      setDocuments(
        (previous) =>
          previous.filter(
            (document) =>
              document.id !== documentId
          )
      );


    } catch (error) {

      console.error(
        "Failed to delete document:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete document."
      );

    } finally {

      setDeletingId(null);

    }
  }


  // ========================================
  // Format Date + Time
  // ========================================

  function formatDateTime(
    date?: string
  ) {

    if (!date) {
      return "Unknown date";
    }

    let dateString = date;

    if (
      !date.endsWith("Z") &&
      !date.includes("+") &&
      !/[+-]\d{2}:\d{2}$/.test(date)
    ) {

      dateString = `${date}Z`;

    }


    const parsedDate =
      new Date(dateString);


    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return date;

    }


    return parsedDate.toLocaleString(
      "en-IN",
      {
        timeZone: "Asia/Kolkata",

        day: "2-digit",
        month: "2-digit",
        year: "numeric",

        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",

        hour12: true,
      }
    );
  }


  // ========================================
  // Get File Type
  // ========================================

  function getFileType(
    contentType?: string,
    filename?: string
  ) {

    if (
      contentType?.includes("pdf") ||
      filename?.toLowerCase().endsWith(".pdf")
    ) {

      return "PDF";

    }


    if (
      contentType?.includes("word") ||
      filename?.toLowerCase().endsWith(".docx")
    ) {

      return "DOCX";

    }


    if (
      contentType?.includes("text") ||
      filename?.toLowerCase().endsWith(".txt")
    ) {

      return "TXT";

    }


    return "DOCUMENT";
  }


  // ========================================
  // Get File Icon
  // ========================================

  function getFileIcon(
    fileType: string
  ) {

    if (fileType === "DOCX") {
      return (
        <FileType2 className="h-5 w-5" />
      );
    }

    return (
      <FileText className="h-5 w-5" />
    );
  }


  // ========================================
  // Loading State
  // ========================================

  if (loading) {

    return (

      <div
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-slate-800/80
          bg-[#080e19]
          p-10
        "
      >

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-32
            w-48
            -translate-x-1/2
            rounded-full
            bg-cyan-400/[0.04]
            blur-3xl
          "
        />

        <div className="relative flex min-h-32 items-center justify-center">

          <div className="flex flex-col items-center gap-3">

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
                bg-cyan-400/[0.06]
              "
            >

              <Loader2
                className="
                  h-4
                  w-4
                  animate-spin
                  text-cyan-400
                "
              />

            </div>

            <p className="text-xs text-slate-500">
              Loading documents...
            </p>

          </div>

        </div>

      </div>

    );
  }


  // ========================================
  // Error State
  // ========================================

  if (
    error &&
    documents.length === 0
  ) {

    return (

      <div
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-red-400/15
          bg-red-400/[0.035]
          p-6
        "
      >

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-red-400/15
              bg-red-400/[0.06]
            "
          >

            <AlertCircle className="h-5 w-5 text-red-400" />

          </div>


          <div className="flex-1">

            <p className="text-xs font-semibold text-red-300">
              Unable to load documents
            </p>

            <p className="mt-1 text-[10px] leading-5 text-red-400/60">
              {error}
            </p>

          </div>


          <button
            type="button"
            onClick={loadDocuments}
            className="
              inline-flex
              shrink-0
              items-center
              gap-2
              rounded-xl
              border
              border-slate-700
              bg-slate-950/70
              px-4
              py-2.5
              text-[10px]
              font-semibold
              text-slate-300
              transition-all
              duration-300
              hover:border-cyan-400/25
              hover:bg-cyan-400/[0.05]
              hover:text-cyan-300
            "
          >

            <RefreshCw className="h-3.5 w-3.5" />

            Try Again

          </button>

        </div>

      </div>

    );
  }


  // ========================================
  // Empty State
  // ========================================

  if (
    documents.length === 0
  ) {

    return (

      <div
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-slate-800/80
          bg-[#080e19]
          p-10
          text-center
        "
      >

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-40
            w-48
            -translate-x-1/2
            rounded-full
            bg-cyan-400/[0.035]
            blur-3xl
          "
        />

        <div className="relative">

          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              border
              border-cyan-400/15
              bg-cyan-400/[0.06]
            "
          >

            <Database className="h-6 w-6 text-cyan-400" />

          </div>


          <h3
            className="
              mt-5
              text-base
              font-semibold
              text-white
            "
          >
            No Documents Found
          </h3>


          <p
            className="
              mx-auto
              mt-2
              max-w-md
              text-xs
              leading-6
              text-slate-600
            "
          >
            Upload your first legal document to
            start using LexAI's document intelligence
            features.
          </p>

        </div>

      </div>

    );
  }


  // ========================================
  // Document List
  // ========================================

  return (

    <div className="space-y-3">

      {/* ==================================
          Error while documents exist
      ================================== */}

      {error && (

        <div
          className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-red-400/15
            bg-red-400/[0.035]
            px-4
            py-3
            text-xs
            text-red-300
          "
        >

          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* ==================================
          Document Count
      ================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          px-1
          pb-1
        "
      >

        <div className="flex items-center gap-2">

          <span className="relative flex h-1.5 w-1.5">

            <span
              className="
                absolute
                inline-flex
                h-full
                w-full
                animate-ping
                rounded-full
                bg-cyan-400
                opacity-30
              "
            />

            <span
              className="
                relative
                h-1.5
                w-1.5
                rounded-full
                bg-cyan-400
              "
            />

          </span>

          <span className="text-[9px] font-medium uppercase tracking-[0.13em] text-slate-600">
            {documents.length}{" "}
            {documents.length === 1
              ? "document"
              : "documents"}{" "}
            available
          </span>

        </div>


        <span className="text-[9px] uppercase tracking-[0.12em] text-slate-700">
          Repository
        </span>

      </div>


      {/* ==================================
          Document Cards
      ================================== */}

      {documents.map(
        (document) => {

          const fileType =
            getFileType(
              document.content_type,
              document.filename
            );


          return (

            <div
              key={document.id}
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-slate-800/80
                bg-[#080e19]
                p-4
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-slate-700
                hover:bg-[#0a111d]
                hover:shadow-[0_18px_50px_rgba(0,0,0,0.18)]
                sm:p-5
              "
            >

              {/* Hover glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-12
                  -top-12
                  h-32
                  w-32
                  rounded-full
                  bg-cyan-400/[0.025]
                  blur-3xl
                  opacity-0
                  transition-opacity
                  duration-300
                  group-hover:opacity-100
                "
              />


              {/* Active side indicator */}

              <div
                className="
                  absolute
                  left-0
                  top-1/2
                  h-8
                  w-[2px]
                  -translate-y-1/2
                  rounded-r-full
                  bg-cyan-400
                  opacity-0
                  shadow-[0_0_12px_rgba(34,211,238,0.7)]
                  transition-opacity
                  duration-300
                  group-hover:opacity-100
                "
              />


              <div
                className="
                  relative
                  flex
                  flex-col
                  gap-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                {/* =================================
                     File Information
                ================================= */}

                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-4
                  "
                >

                  {/* File Icon */}

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
                      bg-cyan-400/[0.06]
                      text-cyan-400
                      transition-all
                      duration-300
                      group-hover:border-cyan-400/25
                      group-hover:bg-cyan-400/[0.09]
                    "
                  >

                    {getFileIcon(fileType)}

                  </div>


                  {/* File Details */}

                  <div className="min-w-0">

                    <div className="flex items-center gap-2">

                      <h3
                        className="
                          truncate
                          text-xs
                          font-semibold
                          text-slate-200
                          transition-colors
                          duration-300
                          group-hover:text-white
                          sm:text-sm
                        "
                      >
                        {document.filename}
                      </h3>

                    </div>


                    <div
                      className="
                        mt-1.5
                        flex
                        flex-wrap
                        items-center
                        gap-x-2
                        gap-y-1
                      "
                    >

                      <span
                        className="
                          rounded-md
                          border
                          border-slate-800
                          bg-slate-950/60
                          px-2
                          py-0.5
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-[0.1em]
                          text-cyan-500/70
                        "
                      >
                        {fileType}
                      </span>

                      <span className="text-[9px] text-slate-700">
                        {document.content_type ||
                          "Legal document"}
                      </span>

                    </div>

                  </div>

                </div>


                {/* =================================
                     Metadata + Delete
                ================================= */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    sm:justify-end
                  "
                >

                  {/* Uploaded */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      sm:text-right
                    "
                  >

                    <Clock3 className="h-3.5 w-3.5 text-slate-700" />

                    <div>

                      <p className="text-[8px] uppercase tracking-[0.12em] text-slate-700">
                        Uploaded
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
                        {formatDateTime(
                          document.uploaded_at
                        )}
                      </p>

                    </div>

                  </div>


                  {/* Delete */}

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        document.id
                      )
                    }
                    disabled={
                      deletingId === document.id
                    }
                    title="Delete document"
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-red-400/10
                      bg-red-400/[0.035]
                      text-red-400/70
                      transition-all
                      duration-300
                      hover:border-red-400/20
                      hover:bg-red-400/[0.08]
                      hover:text-red-300
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >

                    {deletingId === document.id ? (

                      <Loader2
                        className="
                          h-4
                          w-4
                          animate-spin
                        "
                      />

                    ) : (

                      <Trash2 className="h-4 w-4" />

                    )}

                  </button>

                </div>

              </div>

            </div>

          );

        }
      )}

    </div>

  );
}


export default DocumentList;