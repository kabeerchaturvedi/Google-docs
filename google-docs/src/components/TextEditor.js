import React, { useCallback, useEffect, useState } from "react";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const TextEditor = () => {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const { id: documentId } = useParams();

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });
    socket.emit("get-document", document);
  }, [socket, quill, documentId]);

  //useEffect for checking and seeing the changes(delta)
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);
    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  //useEffect for updating document/changes(delta)
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("recieve-changes", handler);
    return () => {
      socket.off("recieve-changes", handler);
    };
  }, [socket, quill]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper === null) return;

    //to clear out the page on refresh
    wrapperRef.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS } });
    q.enable(false);
    q.setText('...Loading')
    setQuill(q);
  }, []);

  return <div className="container" ref={wrapperRef}></div>;
};

export default TextEditor;
