import { useEffect, useState } from "react";
import {
  FileText,
  Lock,
  Unlock,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import {
  getDocumentText,
  analyzeDocumentPages,
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

        if (
          previousPages.includes(
            pageNumber
          )
        ) {

          return previousPages.filter(
            (page) =>
              page !== pageNumber
          );

        }

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

  if (errorMessage && !documentData) {

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
      {/* Error */}
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

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
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


                {/* Temporary text preview */}

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