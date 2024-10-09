import React, { useState } from "react";
import './PdfToExcelConverter.css'; // Assuming external CSS for styling
import { ThreeDots } from 'react-loader-spinner'; // Import a specific loader
import { FaQuestionCircle } from 'react-icons/fa'; // Importing help icon from react-icons

const PdfToExcelConverter = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Regex to validate PDF file type
  const pdfRegex = /\.pdf$/i;

  // Handle file selection with PDF validation
  const handleFileChange = (e) => {
    const files = [...e.target.files];
    const validFiles = files.filter((file) => pdfRegex.test(file.name));

    // Check for duplicates and create a new list of selected files
    const updatedFiles = [...selectedFiles, ...validFiles].filter((file, index, self) =>
      index === self.findIndex((f) => f.name === file.name)
    );

    if (validFiles.length !== files.length) {
      alert("Only PDF files are allowed!");
    }

    setSelectedFiles(updatedFiles); // Update selected files with new valid ones
    setError(""); // Reset error if valid files are selected
  };

  // Remove selected PDF file
  const handleRemoveFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  // Handle file upload and conversion
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select files first.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("https://personal-portfolio-backend-4y21.onrender.com/api/getall-contact", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File conversion failed");
      }

      const convertedFiles = await response.json(); // Assuming backend returns file URLs
      setConvertedFiles(convertedFiles);
      setSuccess("Files converted successfully!");
    } catch (error) {
      console.error("Error during file conversion:", error);
      setError("Error during file conversion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file download
  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", url.split("/").pop()); // Extract file name from URL
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  return (
    <div className="converter-container">
      <h1 className="title">Convert PDF to Excel</h1>
      <div className="upload-section">
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileChange}
          disabled={loading}
          className="file-input"
          aria-label="Upload PDF files"
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="upload-button"
          aria-label="Upload and Convert PDFs"
        >
          {loading ? (
            <ThreeDots color="#FFFFFF" height={20} width={20} /> // Show loader while loading
          ) : (
            "Convert to Excel"
          )}
        </button>
      </div>

      {/* Help Icon */}
      <div className="help-icon" style={{ position: 'absolute', right: '20px', bottom: '20px' }}>
        <a href="https://devnamit.com/" target="_blank" rel="noopener noreferrer">
          <FaQuestionCircle size={24} style={{ cursor: 'pointer', color: '#000' }} />
        </a>
      </div>


      {/* Display the names of the selected files */}
      {selectedFiles.length > 0 && (
        <div className="selected-files-section">
          <h3>Selected PDF Files:</h3>
          <ul className="selected-files-list">
            {selectedFiles.map((file, index) => (
              <li key={index} className="selected-file-item">
                {file.name}
                <button
                  className="remove-button"
                  onClick={() => handleRemoveFile(index)}
                  aria-label={`Remove ${file.name}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {convertedFiles.length > 0 && (
        <div className="converted-files-section">
          <h3>Converted Files</h3>
          <ul className="converted-files-list">
            {convertedFiles.map((fileUrl, index) => (
              <li key={index}>
                <a
                  href="#"
                  onClick={() => handleDownload(fileUrl)}
                  className="download-link"
                >
                  Download File {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PdfToExcelConverter;
