import { useEffect, useState } from "react";

import {
  FileText,
  Trash2,
  Loader2,
  AlertCircle,
  RefreshCw,
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
  upload_date?: string;
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


      // Remove immediately from UI

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
  // Format Date
  // ========================================

  function formatDate(
    date?: string
  ) {

    if (!date) {
      return "Unknown date";
    }

    const parsedDate =
      new Date(date);

    if (Number.isNaN(
      parsedDate.getTime()
    )) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
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
  // Loading State
  // ========================================

  if (loading) {

    return (

      <div
        className="
          flex
          min-h-40
          items-center
          justify-center
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
            text-slate-400
          "
        >

          <Loader2
            size={22}
            className="animate-spin text-cyan-400"
          />

          Loading documents...

        </div>

      </div>

    );
  }


  // ========================================
  // Error State
  // ========================================

  if (error && documents.length === 0) {

    return (

      <div
        className="
          rounded-2xl
          border
          border-red-500/30
          bg-red-500/10
          p-6
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
            text-red-400
          "
        >

          <AlertCircle size={22} />

          <span>
            {error}
          </span>

        </div>


        <button
          type="button"
          onClick={loadDocuments}
          className="
            mt-4
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            border-slate-700
            bg-slate-900
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:border-cyan-500/50
          "
        >

          <RefreshCw size={16} />

          Try Again

        </button>

      </div>

    );
  }


  // ========================================
  // Empty State
  // ========================================

  if (documents.length === 0) {

    return (

      <div
        className="
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
          p-10
          text-center
        "
      >

        <div
          className="
            mx-auto
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-cyan-500/10
            text-cyan-400
          "
        >

          <FileText size={26} />

        </div>


        <h3
          className="
            mt-5
            text-lg
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
            text-sm
            text-slate-500
          "
        >
          Upload your first legal document to
          start using LexAI's document intelligence
          features.
        </p>

      </div>

    );
  }


  // ========================================
  // Document List
  // ========================================

  return (

    <div className="space-y-4">


      {/* Error while documents exist */}

      {error && (

        <div
          className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-red-500/30
            bg-red-500/10
            px-4
            py-3
            text-sm
            text-red-400
          "
        >

          <AlertCircle size={18} />

          {error}

        </div>

      )}


      {/* Document Cards */}

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
                flex
                flex-col
                gap-4
                rounded-2xl
                border
                border-slate-800
                bg-slate-900
                p-5
                transition
                hover:border-slate-700
                hover:bg-slate-900/80
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              {/* Left Side */}

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
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-cyan-500/10
                    text-cyan-400
                  "
                >

                  <FileText size={24} />

                </div>


                {/* File Information */}

                <div className="min-w-0">

                  <h3
                    className="
                      truncate
                      font-semibold
                      text-white
                    "
                  >
                    {document.filename}
                  </h3>


                  <div
                    className="
                      mt-1
                      flex
                      flex-wrap
                      items-center
                      gap-x-3
                      gap-y-1
                      text-sm
                      text-slate-500
                    "
                  >

                    <span>
                      {document.content_type ||
                        fileType}
                    </span>

                    <span className="hidden sm:inline">
                      •
                    </span>

                    <span>
                      {fileType}
                    </span>

                  </div>

                </div>

              </div>


              {/* Right Side */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  sm:justify-end
                "
              >

                {/* Date */}

                <span
                  className="
                    whitespace-nowrap
                    text-sm
                    text-slate-500
                  "
                >
                  {formatDate(
                    document.upload_date
                  )}
                </span>


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
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-red-500/30
                    bg-red-500/5
                    text-red-400
                    transition
                    hover:bg-red-500/10
                    hover:text-red-300
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >

                  {deletingId === document.id ? (

                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                  ) : (

                    <Trash2 size={18} />

                  )}

                </button>

              </div>

            </div>

          );
        }
      )}

    </div>

  );
}


export default DocumentList;