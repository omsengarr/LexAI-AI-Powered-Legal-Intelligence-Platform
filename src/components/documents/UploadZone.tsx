import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";

function UploadZone() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("Uploaded Files:", acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
      ],
      "text/plain": [".txt"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
        isDragActive
          ? "border-cyan-400 bg-cyan-500/10"
          : "border-slate-700 bg-slate-900 hover:border-cyan-400"
      }`}
    >
      <input {...getInputProps()} />

      <FaCloudUploadAlt className="text-6xl text-cyan-400 mx-auto mb-6" />

      <h2 className="text-2xl font-bold text-white mb-3">
        Drag & Drop Your Legal Document
      </h2>

      <p className="text-slate-400">
        Supports PDF, DOCX and TXT files
      </p>

      <button
        type="button"
        className="mt-8 px-6 py-3 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition"
      >
        Browse Files
      </button>
    </div>
  );
}

export default UploadZone;