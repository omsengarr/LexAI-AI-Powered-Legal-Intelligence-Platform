import {
  FileText,
  Trash2,
  Loader2,
} from "lucide-react";


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

interface DocumentCardProps {
  document: DocumentItem;
  deleting: boolean;
  onDelete: (documentId: number) => void;
}


// ========================================
// Document Card
// ========================================

function DocumentCard({
  document,
  deleting,
  onDelete,
}: DocumentCardProps) {

  // ======================================
  // Get File Type
  // ======================================

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


  // ======================================
  // Format Uploaded Date & Time
  // ======================================

  function formatDateTime(
    date?: string
  ) {

    if (!date) {
      return "Unknown date";
    }

    const parsedDate = new Date(date);

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
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }


  const fileType = getFileType(
    document.content_type,
    document.filename
  );


  // ======================================
  // Card
  // ======================================

  return (

    <div
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

      {/* ================================= */}
      {/* Left Side */}
      {/* ================================= */}

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
              {document.content_type || fileType}
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


      {/* ================================= */}
      {/* Right Side */}
      {/* ================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          sm:justify-end
        "
      >

        {/* Uploaded Date & Time */}

        <div
          className="
            whitespace-nowrap
            text-right
          "
        >

          <p className="text-xs text-slate-500">
            Uploaded
          </p>

          <p className="text-sm text-slate-300">
            {formatDateTime(
              document.uploaded_at
            )}
          </p>

        </div>


        {/* Delete Button */}

        <button
          type="button"
          onClick={() =>
            onDelete(document.id)
          }
          disabled={deleting}
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

          {deleting ? (

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


export default DocumentCard;