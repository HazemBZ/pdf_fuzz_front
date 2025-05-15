import axios from "axios";
import pLimit from "p-limit";
import { targetServer } from "settings";
// import { Dict, TwoParamsVoid, VoidFunction } from 'types'

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
  const url = `http://${targetServer}/chunkedUpload/complete`;
  const res = await axios.post(url, completionForm);
  return res;
};

/**
 * chunk: Blob, upload_id: string, headers: Dict<string>
 */
const sendSignleChunk = async (chunk, upload_id, headers) => {
  const FORM_FILE_ALIAS = "my_file";
  const url = `http://${targetServer}/chunkedUpload/start`;
  const formData = new FormData();
  formData.append(FORM_FILE_ALIAS, chunk);
  if (upload_id) formData.append("upload_id", upload_id);
  const data = await axios
    .post(url, formData, {
      headers: { ...headers },
    })
    .then((res) => res.data);

  return data;
};

/**
 * file: File
 */
async function sendChunked(file) {
  // 8 MB
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
      contentRangeHeader
    );
    if (upload_id) id = upload_id;
  }

  return id;
}

async function handleFile(file, cb) {
  const id = await sendChunked(file).then((res) => {
    const id = res;
    if (cb) cb(file, id);
    return res;
  });
  const res = await markUploadComplete(id, file.name);
  return res;
}

/**
 * files: FileList,
  onFileUplodCB?: TwoParamsVoid<File, string>,
  onUploadEndCB?: VoidFunction
 */
export const chunkUploadFiles = async (files, onFileUplodCB, onUploadEndCB) => {
  let promises = [];
  for (const file of Object.values(files)) {
    const prom = limit(() => handleFile(file, onFileUplodCB));
    promises.push(prom);
  }
  await Promise.all(promises).then((res) => {
    if (onUploadEndCB) onUploadEndCB();
    return res;
  });
};
