import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import * as pdfjs from "pdfjs-dist";
import PDFWorker from "pdfjs-dist/build/pdf.worker.min?url";

const usePdf = (options) => {
  pdfjs.GlobalWorkerOptions.workerSrc = PDFWorker;

  const pdf = shallowRef();
  const pages = shallowRef(0);
  const outline = shallowRef(null);
  const attachments = shallowRef(null);
  const js = shallowRef(null);
  const metadata = shallowRef(null);

  const _progress = ref(0);

  const readDocument = async () => {
    const loadingTask = pdfjs.getDocument(options.src);
    loadingTask.onPassword = onPdfPassword;
    loadingTask.onProgress = onPdfProgress;

    try {
      const doc = await loadingTask.promise;
      pdf.value = doc.loadingTask;
      pages.value = doc.numPages;
      outline.value = await getOutlines(doc);
      attachments.value = await doc.getAttachments();
      metadata.value = await doc.getMetadata();
      js.value = await doc.getJSActions();
      Object.assign(metadata.value, {
        fingerprint: doc.fingerprints,
      });
    } catch (e) {
      onPdfProgress({
        loaded: 1,
        total: 1,
      });
      if (!!options.onError && typeof options.onError === "function") {
        options.onError(e);
      } else {
        throw new Error(e);
      }
    } finally {
    }
  };

  const cleanup = () => {
    pdf.value?.promise.then((doc) => {
      doc.cleanup();
    });
    pdf.value?.destroy();
  };

  const onPdfProgress = (e) => {
    options.onProgress?.(e);
    _progress.value = Math.floor(e.loaded / e.total);
  };

  const onPdfPassword = (updatePassword, reason) => {
    if (!!options.onPassword && typeof options.onPassword === "function") {
      options.onPassword(updatePassword, reason);
    } else {
      if (reason == 1) {
        const pass = prompt("Enter password for protected PDF");
        updatePassword(pass ?? "");
      } else if (reason == 2) {
        throw new Error();
      }
    }
  };

  const getOutlines = async (doc, ol = null) => {
    const pairs = [];

    let _outline = ol ?? (await doc.getOutline());
    if (_outline) {
      for (let i = 0; i < _outline.length; i++) {
        const { dest, items, title } = _outline[i];
        let d = dest;
        if (typeof dest === "string") {
          d = await doc.getDestination(dest);
        }
        const page = await getOutlinePage(doc, d);
        if (!!page || (!page && items.length > 0)) {
          pairs.push({
            page,
            offsetY: d[3],
            offsetX: d[2],
            title: title,
            sub: await getOutlines(doc, items),
          });
        }
      }
    }
    return pairs;
  };

  const getOutlinePage = async (doc, dest) => {
    const r = dest[0];
    if (!!r) {
      const id = await doc.getPageIndex(r);
      return parseInt(id) + 1;
    }
    return null;
  };

  watch(() => options.src, readDocument);

  onMounted(readDocument);

  onBeforeUnmount(cleanup);

  return {
    pdf,
    pages,
    outline,
    attachments,
    metadata,
    progress: _progress,
    javascript: js,
  };
};

export default usePdf;
