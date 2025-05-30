import { useMemo, useRef, useState } from "react";
import { chunkUploadFiles, filterNonUploaded } from "helpers/uploadHelpers";
import { Button } from "@mui/material";
import { UploadFile, UploadTwoTone } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";

const FolderUploader = () => {
  // Refetch

  const queryClient = useQueryClient();
  const [content, setContent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  // const progressModal = useModal();
  const ref = useRef(null);

  const totalFiles = useMemo(
    () => (content ? Object.keys(content).length : 0),
    [content]
  );
  const [uploadedFiles, setUploadedFiles] = useState(0);

  // const { setAssociatedPaths } = useContext(PathsContext);
  // const failureModal = useModal();
  const [isUploading, setUploading] = useState(true);

  const handleChange = async (c) => {
    const files = c.target.files;
    setContent(files);

    if (files) {
      setSubmitting(true);
      setUploading(true);
      try {
        let [filteredFiles, hashes] = await filterNonUploaded(files);
        chunkUploadFiles(
          [filteredFiles, hashes],
          (file, file_id) => {
            // setAssociatedPaths((prev) => ({
            //   ...prev,
            //   [file_id]: file.webkitRelativePath,
            // }));
            setUploadedFiles((prev) => prev + 1);
          },
          () => {
            queryClient.refetchQueries(["get-files-meta"]);
            setUploading(false);
            setTimeout(() => {
              setSubmitting(false);
            }, 1000);
          }
        );
      } catch (e) {
        console.log("Error ", e);
      }
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 20 }}>
        <Button
          color="info"
          id="upload-proxy"
          variant="contained"
          startIcon={<UploadTwoTone />}
          onClick={(e) => {
            document.getElementById("folder-upload")?.click();
          }}
        >
          Folder upload
        </Button>
        <Button
          id="upload-proxy-2"
          variant="contained"
          startIcon={<UploadFile />}
          onClick={(e) => {
            document.getElementById("file-upload")?.click();
          }}
        >
          File upload
        </Button>
      </div>
      <input
        id="folder-upload"
        type="file"
        directory=""
        webkitdirectory=""
        onChange={handleChange}
        ref={ref}
        style={{ visibility: "hidden" }}
      />
      <input
        id="file-upload"
        type="file"
        onChange={handleChange}
        ref={ref}
        style={{ visibility: "hidden" }}
      />
      {submitting && content && (
        <>
          {isUploading ? (
            <>
              <p>{Math.round((uploadedFiles / totalFiles) * 100)}%</p>
            </>
          ) : (
            <> Finished Uploading</>
          )}
        </>
      )}
    </div>
  );
};

export default FolderUploader;
