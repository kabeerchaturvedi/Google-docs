import React, { useCallback, useEffect } from "react";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import { io } from "socket.io-client";

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
  useEffect(() => {
    const socket = io("http://localhost:3001");

    return () => {
      socket.disconnect();
    };
  }, []);
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper === null) return;

    //to clear out the page on refresh
    wrapperRef.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS } });
  }, []);
  return <div className="container" ref={wrapperRef}></div>;
};

export default TextEditor;
