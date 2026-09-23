import React, { useState } from "react";
import { FaTimes, FaCloudUploadAlt, FaFileAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const UploadModal = ({ isOpen, onClose, onOpenAuth }) => {
  const { user, token } = useAuth();
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit!");
        return;
      }
      setFile(selected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to upload your prescription!");
      onClose();
      onOpenAuth();
      return;
    }
    if (!file) {
      toast.error("Please select a prescription file first");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("prescription", file);
    formData.append("notes", notes);

    try {
      const response = await fetch("/api/prescriptions/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Prescription uploaded successfully! Our pharmacist will review it.");
        setFile(null);
        setNotes("");
        onClose();
      } else {
        throw new Error(data.message || "Failed to upload prescription");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-[480px] rounded-2xl p-6 relative shadow-2xl transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition p-1.5 rounded-full hover:bg-gray-100"
        >
          <FaTimes size={18} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          📄 Upload Prescription
        </h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Please upload a clear picture or PDF of your doctor's prescription. Our certified pharmacists will verify it and add the medicines to your cart.
        </p>

        {user ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* File dropzone/picker */}
            <div className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-2xl p-6 transition flex flex-col items-center justify-center bg-gray-50 cursor-pointer relative">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {file ? (
                <div className="flex flex-col items-center text-center">
                  <FaFileAlt className="text-blue-500 text-4xl mb-3" />
                  <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <FaCloudUploadAlt className="text-gray-400 text-4xl mb-3" />
                  <p className="text-sm font-medium text-gray-700">
                    Click to browse files
                  </p>
                  <p className="text-xs text-gray-400 mt-1.5">
                    Supports JPG, PNG, or PDF. Max size 5MB.
                  </p>
                </div>
              )}
            </div>

            {/* Notes Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Optional Pharmacist Instructions / Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="E.g. Please add 10 tablets of Paracetamol, call me before dispatching..."
                className="w-full text-sm border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition text-sm shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {uploading ? "Uploading..." : "Submit Prescription"}
            </button>
          </form>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-red-500 font-medium mb-4">
              ⚠️ You must be logged in to upload a prescription.
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow-md transition"
            >
              Login / Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadModal;
