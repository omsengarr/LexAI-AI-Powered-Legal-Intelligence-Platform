import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { API_BASE_URL } from "../../services/api";
import { FaCloudUploadAlt } from "react-icons/fa";

function UploadZone() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Upload failed");
      }

      console.log("Upload successful:", data);

      setMessage(`Uploaded successfully: ${data.filename}`);
    } catch (error) {
      console.error("Upload error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while uploading"
      );
    } finally {
      setUploading(false);
    }
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
        disabled={uploading}
        className="mt-8 px-6 py-3 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Browse Files"}
      </button>

      {message && (
        <p className="mt-5 text-sm text-cyan-400">
          {message}
        </p>
      )}
    </div>
  );
}

export default UploadZone;