// import { faSpinner } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Modal, { useModal, UseModalHook } from "components/Modal";
// import Space from "components/Space";
import { useContext, useMemo, useRef, useState } from "react";
// import style from "./path-sink.module.scss";
import { chunkUploadFiles } from "helpers/uploadHelpers";
import { Button } from "@mui/material";
import { UploadFile } from "@mui/icons-material";
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

  const handleChange = (c) => {
    const files = c.target.files;
    setContent(files);

    if (files) {
      // progressModal.show();
      setSubmitting(true);
      setUploading(true);
      chunkUploadFiles(
        files,
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
            // progressModal.hide();
            // modal.hide();
          }, 1000);
        }
      );
    }
  };

  return (
    <div>
      <Button
        id="upload-proxy"
        variant="contained"
        // className={style.uploaderLabel}
        // htmlFor="folder-upload"
        endIcon={<UploadFile />}
        onClick={(e) => {
          document.getElementById("folder-upload")?.click();
        }}
      >
        Folder upload
      </Button>
      <input
        id="folder-upload"
        type="file"
        // @ts-expect-error: folders are good
        // eslint-disable-next-line react/no-unknown-property
        directory=""
        webkitdirectory=""
        onChange={handleChange}
        ref={ref}
        style={{ visibility: "hidden" }}
      />
      {submitting && content && (
        <>
          {isUploading ? (
            <>
              {/* <FontAwesomeIcon spin fontSize={25} icon={faSpinner} /> */}
              <p>{Math.round((uploadedFiles / totalFiles) * 100)}%</p>
              {/* <FullWidth> */}
              {/* <ProgressBar count={uploadedFiles} total={totalFiles} /> */}
              {/* </FullWidth> */}
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
