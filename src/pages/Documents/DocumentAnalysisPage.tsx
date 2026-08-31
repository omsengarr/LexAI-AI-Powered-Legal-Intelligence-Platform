import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import {
  FileText,
  Lock,
  Unlock,
  Loader2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import {
  getDocumentText,
  analyzeDocumentPages,
  summarizeDocumentPage,
} from "../../services/api";


// ========================================
// Types
// ========================================

interface DocumentPage {
  page_number: number;
  text: string;
}

interface DocumentData {
  document_id: number;
  filename: string;
  total_pages: number;
  pages: DocumentPage[];
}

interface PageSummary {
  [pageNumber: number]: string;
}


// ========================================
// Component
// ========================================

function DocumentAnalysisPage() {

  // ======================================
  // Document State
  // ======================================

  const [documentData, setDocumentData] =
    useState<DocumentData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");


  // ======================================
  // Privacy State
  // ======================================

  const [lockedPages, setLockedPages] =
    useState<number[]>([]);


  // ======================================
  // Analysis State
  // ======================================

  const [analyzing, setAnalyzing] =
    useState(false);

  const [analysisResult, setAnalysisResult] =
    useState<any>(null);


  // ======================================
  // Page Summary State
  // ======================================

  const [pageSummaries, setPageSummaries] =
    useState<PageSummary>({});

  const [summarizingPage, setSummarizingPage] =
    useState<number | null>(null);

  const [summaryErrors, setSummaryErrors] =
    useState<{
      [pageNumber: number]: string;
    }>({});


  // ======================================
  // Get Document ID
  // ======================================

  const params =
    new URLSearchParams(
      window.location.search
    );

  const documentId =
    Number(params.get("documentId"));


  // ======================================
  // Load Document
  // ======================================

  useEffect(() => {

    async function loadDocument() {

      if (!documentId) {

        setErrorMessage(
          "No document was selected."
        );

        setLoading(false);

        return;
      }

      try {

        setLoading(true);
        setErrorMessage("");

        const data =
          await getDocumentText(
            documentId
          );

        setDocumentData(data);

      } catch (error) {

        console.error(
          "Failed to load document:",
          error
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load document."
        );

      } finally {

        setLoading(false);

      }
    }

    loadDocument();

  }, [documentId]);


  // ======================================
  // Lock / Unlock Page
  // ======================================

  function togglePageLock(
    pageNumber: number
  ) {

    setLockedPages(
      (previousPages) => {

        const isCurrentlyLocked =
          previousPages.includes(
            pageNumber
          );

        if (isCurrentlyLocked) {

          return previousPages.filter(
            (page) =>
              page !== pageNumber
          );

        }

        // Remove any existing summary
        // when page becomes locked.

        setPageSummaries(
          (previousSummaries) => {

            const updated = {
              ...previousSummaries,
            };

            delete updated[pageNumber];

            return updated;
          }
        );

        setSummaryErrors(
          (previousErrors) => {

            const updated = {
              ...previousErrors,
            };

            delete updated[pageNumber];

            return updated;
          }
        );

        return [
          ...previousPages,
          pageNumber,
        ].sort(
          (a, b) => a - b
        );

      }
    );
  }


  // ======================================
  // Generate Page Summary
  // ======================================

  async function handleSummarizePage(
    pageNumber: number
  ) {

    if (!documentData) {
      return;
    }


    // Do not allow locked pages
    // to be summarized.

    if (
      lockedPages.includes(
        pageNumber
      )
    ) {

      setSummaryErrors(
        (previous) => ({
          ...previous,
          [pageNumber]:
            "This page is locked and cannot be summarized.",
        })
      );

      return;
    }


    try {

      setSummarizingPage(
        pageNumber
      );

      setSummaryErrors(
        (previous) => {

          const updated = {
            ...previous,
          };

          delete updated[pageNumber];

          return updated;
        }
      );


      const result =
        await summarizeDocumentPage(
          documentData.document_id,
          pageNumber,
          lockedPages
        );


      setPageSummaries(
        (previous) => ({
          ...previous,
          [pageNumber]:
            result.summary,
        })
      );

    } catch (error) {

      console.error(
        "Page summary failed:",
        error
      );

      setSummaryErrors(
        (previous) => ({
          ...previous,
          [pageNumber]:
            error instanceof Error
              ? error.message
              : "Failed to generate page summary.",
        })
      );

    } finally {

      setSummarizingPage(
        null
      );

    }
  }


  // ======================================
  // Analyze Pages
  // ======================================

  async function handleAnalyze() {

    if (!documentData) {
      return;
    }

    try {

      setAnalyzing(true);
      setErrorMessage("");
      setAnalysisResult(null);

      const result =
        await analyzeDocumentPages(
          documentData.document_id,
          lockedPages
        );

      console.log(
        "Analysis result:",
        result
      );

      setAnalysisResult(result);

    } catch (error) {

      console.error(
        "Analysis failed:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Analysis failed."
      );

    } finally {

      setAnalyzing(false);

    }
  }


  // ======================================
  // Loading
  // ======================================

  if (loading) {

    return (
      <div
        className="
          flex
          min-h-[400px]
          items-center
          justify-center
          text-slate-400
        "
      >

        <Loader2
          size={32}
          className="animate-spin text-cyan-400"
        />

        <span className="ml-3">
          Loading document...
        </span>

      </div>
    );

  }


  // ======================================
  // Error
  // ======================================

  if (
    errorMessage &&
    !documentData
  ) {

    return (
      <div
        className="
          rounded-2xl
          border
          border-red-500/30
          bg-red-500/10
          p-6
          text-red-400
        "
      >
        {errorMessage}
      </div>
    );

  }


  if (!documentData) {
    return null;
  }


  // ======================================
  // Page
  // ======================================

  return (

    <div className="w-full space-y-6">

      {/* ================================= */}
      {/* Header */}
      {/* ================================= */}

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
        "
      >

        <div
          className="
            flex
            flex-col
            gap-4
            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          <div>

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <FileText
                size={26}
                className="text-cyan-400"
              />

              <h1
                className="
                  text-2xl
                  font-bold
                  text-white
                "
              >
                Document Analysis
              </h1>

            </div>

            <p
              className="
                mt-2
                text-slate-400
              "
            >
              {documentData.filename}
            </p>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {documentData.total_pages} pages
            </p>

          </div>


          {/* Privacy Indicator */}

          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-green-500/20
              bg-green-500/10
              px-4
              py-3
            "
          >

            <ShieldCheck
              size={22}
              className="text-green-400"
            />

            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  text-green-400
                "
              >
                Privacy Protection
              </p>

              <p
                className="
                  text-xs
                  text-slate-400
                "
              >
                Locked pages are excluded
                from analysis.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================================= */}
      {/* Global Error */}
      {/* ================================= */}

      {errorMessage && (

        <div
          className="
            rounded-xl
            border
            border-red-500/30
            bg-red-500/10
            px-5
            py-4
            text-red-400
          "
        >
          {errorMessage}
        </div>

      )}


      {/* ================================= */}
      {/* Page Controls */}
      {/* ================================= */}

      <section
        className="
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
          p-6
        "
      >

        <div
          className="
            flex
            flex-col
            gap-4
            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-semibold
                text-white
              "
            >
              Select Pages for Analysis
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-400
              "
            >
              Lock pages containing private
              or sensitive information.
            </p>

          </div>


          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-cyan-500
              px-6
              py-3
              font-semibold
              text-white
              transition
              hover:bg-cyan-400
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            {analyzing ? (

              <>
                <Loader2
                  size={20}
                  className="animate-spin"
                />

                Analyzing...
              </>

            ) : (

              <>
                <FileText size={20} />

                Analyze Unlocked Pages
              </>

            )}

          </button>

        </div>


        {/* Page Summary */}

        <div
          className="
            mt-5
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-3
          "
        >

          <div
            className="
              rounded-xl
              border
              border-slate-800
              bg-slate-950
              p-4
            "
          >

            <p
              className="
                text-sm
                text-slate-500
              "
            >
              Total Pages
            </p>

            <p
              className="
                mt-1
                text-2xl
                font-bold
                text-white
              "
            >
              {documentData.total_pages}
            </p>

          </div>


          <div
            className="
              rounded-xl
              border
              border-red-500/20
              bg-red-500/5
              p-4
            "
          >

            <p
              className="
                text-sm
                text-slate-500
              "
            >
              Locked / Private
            </p>

            <p
              className="
                mt-1
                text-2xl
                font-bold
                text-red-400
              "
            >
              {lockedPages.length}
            </p>

          </div>


          <div
            className="
              rounded-xl
              border
              border-green-500/20
              bg-green-500/5
              p-4
            "
          >

            <p
              className="
                text-sm
                text-slate-500
              "
            >
              Available for Analysis
            </p>

            <p
              className="
                mt-1
                text-2xl
                font-bold
                text-green-400
              "
            >
              {documentData.total_pages -
                lockedPages.length}
            </p>

          </div>

        </div>

      </section>


      {/* ================================= */}
      {/* Pages */}
      {/* ================================= */}

      <section className="space-y-5">

        {documentData.pages.map(
          (page) => {

            const isLocked =
              lockedPages.includes(
                page.page_number
              );

            const isSummarizing =
              summarizingPage ===
              page.page_number;

            const summary =
              pageSummaries[
                page.page_number
              ];

            const summaryError =
              summaryErrors[
                page.page_number
              ];


            return (

              <div
                key={page.page_number}
                className={`
                  rounded-2xl
                  border
                  ${
                    isLocked
                      ? "border-red-500/30 bg-red-500/5"
                      : "border-slate-800 bg-slate-900"
                  }
                  p-6
                `}
              >

                {/* ========================= */}
                {/* Page Header */}
                {/* ========================= */}

                <div
                  className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-slate-800
                        font-semibold
                        text-white
                      "
                    >
                      {page.page_number}
                    </div>

                    <div>

                      <h3
                        className="
                          font-semibold
                          text-white
                        "
                      >
                        Page {page.page_number}
                      </h3>

                      <p
                        className="
                          text-xs
                          text-slate-500
                        "
                      >
                        {isLocked
                          ? "Private — excluded from analysis"
                          : "Available for analysis"}
                      </p>

                    </div>

                  </div>


                  {/* Page Actions */}

                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-2
                    "
                  >

                    {/* Summarize */}

                    <button
                      type="button"
                      onClick={() =>
                        handleSummarizePage(
                          page.page_number
                        )
                      }
                      disabled={
                        isLocked ||
                        isSummarizing
                      }
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        bg-cyan-500/10
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-cyan-400
                        transition
                        hover:bg-cyan-500/20
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >

                      {isSummarizing ? (

                        <>
                          <Loader2
                            size={17}
                            className="animate-spin"
                          />

                          Summarizing...
                        </>

                      ) : (

                        <>
                          <Sparkles size={17} />

                          Summarize Page
                        </>

                      )}

                    </button>


                    {/* Lock / Unlock */}

                    <button
                      type="button"
                      onClick={() =>
                        togglePageLock(
                          page.page_number
                        )
                      }
                      className={`
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        transition
                        ${
                          isLocked
                            ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                            : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        }
                      `}
                    >

                      {isLocked ? (

                        <>
                          <Unlock size={17} />

                          Unlock Page
                        </>

                      ) : (

                        <>
                          <Lock size={17} />

                          Lock Page
                        </>

                      )}

                    </button>

                  </div>

                </div>


                {/* ========================= */}
                {/* Locked Page */}
                {/* ========================= */}

                {isLocked ? (

                  <div
                    className="
                      mt-5
                      flex
                      flex-col
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-red-500/20
                      bg-slate-950
                      px-6
                      py-10
                      text-center
                    "
                  >

                    <Lock
                      size={32}
                      className="text-red-400"
                    />

                    <h4
                      className="
                        mt-3
                        font-semibold
                        text-red-400
                      "
                    >
                      Page Locked
                    </h4>

                    <p
                      className="
                        mt-1
                        max-w-md
                        text-sm
                        text-slate-500
                      "
                    >
                      This page contains private or
                      sensitive information and has been
                      excluded from AI analysis.
                    </p>

                  </div>

                ) : (

                  <>
                    {/* ======================= */}
                    {/* Page Text */}
                    {/* ======================= */}

                    <div
                      className="
                        mt-5
                        max-h-80
                        overflow-y-auto
                        rounded-xl
                        border
                        border-slate-800
                        bg-slate-950
                        p-5
                      "
                    >

                      <p
                        className="
                          whitespace-pre-wrap
                          text-sm
                          leading-7
                          text-slate-300
                        "
                      >
                        {page.text ||
                          "No text extracted from this page."}
                      </p>

                    </div>


                    {/* ======================= */}
                    {/* Summary Error */}
                    {/* ======================= */}

                    {summaryError && (

                      <div
                        className="
                          mt-4
                          flex
                          items-start
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

                        <AlertCircle
                          size={18}
                          className="mt-0.5 shrink-0"
                        />

                        <span>
                          {summaryError}
                        </span>

                      </div>

                    )}


{/* ======================= */}
{/* AI Summary */}
{/* ======================= */}

{summary && (

  <div
    className="
      mt-5
      rounded-xl
      border
      border-cyan-500/20
      bg-cyan-500/5
      p-5
    "
  >

    {/* Summary Header */}

    <div
      className="
        flex
        items-center
        gap-2
      "
    >

      <Sparkles
        size={20}
        className="text-cyan-400"
      />

      <h4
        className="
          font-semibold
          text-white
        "
      >
        AI Page Summary
      </h4>

    </div>


    {/* Summary Content */}

    <div
      className="
        mt-4
        text-sm
        leading-7
        text-slate-300
      "
    >

      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 text-xl font-bold text-white">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mb-3 mt-6 text-lg font-bold text-cyan-400">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mb-3 mt-5 text-base font-semibold text-white">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="mb-4 leading-7 text-slate-300">
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul className="mb-4 ml-6 list-disc space-y-2">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="mb-4 ml-6 list-decimal space-y-2">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="pl-1 text-slate-300">
              {children}
            </li>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-white">
              {children}
            </strong>
          ),

          hr: () => (
            <hr className="my-6 border-slate-700" />
          ),
        }}
      >
        {summary}
      </ReactMarkdown>

    </div>

  </div>

)}
                   </>

                )}

              </div>

            );

          }
        )}

      </section>

      {/* ================================= */}
      {/* Analysis Result */}
      {/* ================================= */}

      {analysisResult && (

        <section
          className="
            rounded-2xl
            border
            border-cyan-500/20
            bg-cyan-500/5
            p-6
          "
        >

          <h2
            className="
              text-xl
              font-semibold
              text-white
            "
          >
            Selected Pages
          </h2>

          <p
            className="
              mt-2
              text-slate-400
            "
          >
            The backend received only the pages
            that were not locked.
          </p>

          <div
            className="
              mt-5
              flex
              flex-wrap
              gap-2
            "
          >

            {analysisResult.analyzed_pages?.map(
              (pageNumber: number) => (

                <span
                  key={pageNumber}
                  className="
                    rounded-lg
                    bg-green-500/10
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-green-400
                  "
                >
                  Page {pageNumber}
                </span>

              )
            )}

          </div>

        </section>

      )}

    </div>
  );
}


export default DocumentAnalysisPage;