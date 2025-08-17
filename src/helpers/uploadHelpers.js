import axios from "axios";
import pLimit from "p-limit";
import { targetServer } from "settings";
import sparkMd5 from "spark-md5";

/*
 * // TODO: Expect and handle errors
 * // TODO: Refactor into a hook
 */

const limit = pLimit(2);

const markUploadComplete = async (upload_id, filename) => {
  const completionForm = new FormData();
  completionForm.append("upload_id", upload_id);
  completionForm.append("realname", filename);
  // TODO: Protect uploads using project and user ids
  const url = `http://${targetServer}/api/chunkedUpload/complete`;
  const res = await axios.post(url, completionForm);
  return res;
};

/**
 * chunk: Blob, upload_id: string, headers: Dict<string>
 */
const sendSignleChunk = async (chunk, upload_id, hash, headers) => {
  const FORM_FILE_ALIAS = "my_file";
  const url = `http://${targetServer}/api/chunkedUpload/start`;
  const formData = new FormData();
  formData.append(FORM_FILE_ALIAS, chunk);
  if (upload_id) formData.append("upload_id", upload_id);
  if (hash) formData.append("hash", hash);
  const data = await axios
    .post(url, formData, {
      headers: { ...headers },
    })
    .then((res) => res.data);

  return data;
};

/**
 * file:: File
 * CHUNK_SIZE: 8 MB
 */
async function sendChunked(file, hash) {
  console.log("sendChunked ", file, hash);
  const CHUNK_SIZE = 1024 * 1024 * 8 * 1;

  let chunkNumber = Math.ceil(file.size / CHUNK_SIZE);
  let id = "";
  const chunkNumbers = Array.from({ length: chunkNumber }, (v, x) => x);
  for (const index of chunkNumbers) {
    const start = index * CHUNK_SIZE;
    const stop = start + CHUNK_SIZE;

    const chunk = file.slice(start, stop);
    const dropOff = start + chunk.size;

    const contentRangeHeader = {
      "Content-Range": `bytes ${start}-${dropOff}/${chunk.size}`,
    };

    // This case requires wait inside a loop
    // eslint-disable-next-line no-await-in-loop
    const { upload_id = "" } = await sendSignleChunk(
      chunk,
      id,
      hash,
      contentRangeHeader
    );
    if (upload_id) id = upload_id;
  }

  return id;
}

async function handleFile(fileData, cb) {
  const [file, hash] = fileData;
  const id = await sendChunked(file, hash).then((res) => {
    const id = res;
    if (cb) cb(file, id);
    return res;
  });
  const res = await markUploadComplete(id, file.name);
  return res;
}

export const chunkUploadFiles = async (
  filesData,
  onFileUplodCB,
  onUploadEndCB
) => {
  const [files, hashes] = filesData;
  console.log("chunkUploadFiles", files, hashes);
  let promises = [];
  var i = 0;

  Object.values(files).forEach((file, c) => {
    const prom = limit(() => handleFile([file, hashes[c]], onFileUplodCB));
    promises.push(prom);
  });

  await Promise.all(promises).then((res) => {
    if (onUploadEndCB) onUploadEndCB();
    return res;
  });
};

export const computeHash = async (file) => {
  return new Promise((resolve, reject) => {
    const blobSlice =
      File.prototype.slice ||
      File.prototype.mozSlice ||
      File.prototype.webkitSlic;
    let chunkSize = 2097152; // Read in chunks of 2MB
    let chunks = Math.ceil(file.size / chunkSize);
    let spark = new sparkMd5.ArrayBuffer();
    let fileReader = new FileReader();
    var currentChunk = 0;

    fileReader.onload = function (e) {
      console.log("read chunk nbr", currentChunk + 1, "of", chunks);
      spark.append(e.target.result); // Append array buffer
      currentChunk++;

      if (currentChunk < chunks) {
        loadNext();
      } else {
        const result = spark.end();
        resolve(result);
      }
    };

    fileReader.onerror = function (error) {
      console.warn("oops, something went wrong.");
      reject(error);
    };

    function loadNext() {
      var start = currentChunk * chunkSize,
        end = start + chunkSize >= file.size ? file.size : start + chunkSize;

      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }

    loadNext();
  });
};

export const filterNonUploaded = async (fileList) => {
  const files = fileList;
  let fileHashes = [];
  for (const file of files) {
    let hash = await computeHash(file);
    fileHashes.push(hash);
  }

  const url = `http://${targetServer}/api/chunkedUpload/check_uploads`;
  const checkers = await axios
    .post(url, {
      hashes: fileHashes,
    })
    .then((res) => {
      console.log(res);
      return res.data.hashes;
    });

  var result = [[], []];
  Array.from(files).forEach((file, c) => {
    if (checkers[c]) result[0].push(file);
    result[1].push(fileHashes[c]);
  });

  return result;
};
