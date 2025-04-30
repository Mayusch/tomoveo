import React, { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { autocompletion } from "@codemirror/autocomplete";

//Component renders code editor using CodeMirror 6.
function Editor({ code, onChange, readOnly }) {
  const editorRef = useRef();
  const viewRef = useRef();

  //Initialize the editor and view inside a referenced DOM element when the component mounts.
  useEffect(() => {
    if (!editorRef.current) return;

    //Prepares an extension that can be added to an EditorView later
    const updateListener = EditorView.updateListener.of((update) => {
      if (update.changes) {
        const doc = update.state.doc.toString();
        onChange(doc);
      }
    });

    //Supports syntax highlighting, autocompletion, dark theme (`oneDark`), and basic editor setup for a better developer experience.
    const view = new EditorView({
      doc: code,
      extensions: [
        basicSetup,
        javascript(),
        oneDark,
        autocompletion(),
        updateListener,
        EditorView.editable.of(!readOnly),
      ],
      parent: editorRef.current,
    });

    viewRef.current = view;

    //Unmount the editor and view when the component unmounts.
    // eslint-disable-next-line
    return () => {
      view.destroy();
    };
    // eslint-disable-next-line
  }, []);

  //Updates the editor content when the `code` prop changes.
  useEffect(() => {
    if (viewRef.current && code !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: code,
        },
      });
    }
  }, [code]);

  //Provides a "Copy Code" button below the editor that copies the current content to the clipboard using the Clipboard API.
  function handleCopy() {
    if (viewRef.current) {
      const text = viewRef.current.state.doc.toString();
      navigator.clipboard
        .writeText(text)
        .then(() => alert("Code copied to clipboard!"))
        .catch((err) => console.error("Failed to copy code: ", err));
    }
  }

  //Renders the editor with a copy button below it.
  return (
    <div style={{ width: "100%" }}>
      <div
        ref={editorRef}
        style={{
          border: "1px solid #ccc",
          height: "500px",
          marginBottom: "10px",
          width: "100%",
        }}
      />
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={handleCopy}
          style={{
            padding: "8px 12px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Copy Code
        </button>
      </div>
    </div>
  );
}

export default Editor;
