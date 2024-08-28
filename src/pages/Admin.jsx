import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AdminDashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const { data } = await axios.post("/api/admin/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("File uploaded successfully");
      setUploadedFiles((prevFiles) => [...prevFiles, data.file]); // Assuming data.file contains the uploaded file info
    } catch (error) {
      toast.error(error.response.data.message || "File upload failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="fileUpload">
          Upload File:
        </label>
        <input
          type="file"
          id="fileUpload"
          onChange={handleFileChange}
          className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleFileUpload}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mb-4"
      >
        Upload File
      </button>

      <div className="w-full md:w-1/2">
        <h2 className="text-2xl mb-2">Uploaded Files</h2>
        <ul className="list-disc list-inside">
          {uploadedFiles.map((file, index) => (
            <li key={index} className="text-gray-700">
              <a href={`/uploads/${file.filename}`} download>
                {file.originalname}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <Toaster />
    </div>
  );
};

export default AdminDashboard;
