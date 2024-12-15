import React, { useState, useRef, useEffect } from "react";
import {
  Editor,
  EditorState,
  convertFromRaw,
  convertToRaw,
  Modifier,
  RichUtils,
} from "draft-js";
import "../styles/EditorComponent.css";

const DraftJsEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const editorRef = useRef(null);

  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent);
        const contentState = convertFromRaw(parsedContent);
        setEditorState(EditorState.createWithContent(contentState));
      } catch (error) {
        console.error("Error loading saved content: ", error);
      }
    }
  }, []);

  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleSaveContentToLocalStorage = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(rawContent));
    alert("Content saved successfully!");
  };

  const handleClearLocalStorage = () => {
    localStorage.clear();
    setEditorState(EditorState.createEmpty());
  };

  const handleBeforeInput = (chars) => {
    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    const startKey = selection.getStartKey();
    const block = currentContent.getBlockForKey(startKey);
    const blockText = block.getText();

    const blockSelection = selection.merge({
      anchorOffset: 0,
      focusOffset: blockText.length,
    });

    // Handle `#` for heading
    if (blockText === "#" && chars === " ") {
      const newContentState = Modifier.replaceText(
        currentContent,
        blockSelection,
        ""
      );
      setEditorState(
        RichUtils.toggleBlockType(
          EditorState.push(editorState, newContentState, "change-block-type"),
          "header-one"
        )
      );
      return "handled";
    }

    // Handle `*` for bold
    if (blockText === "*" && chars === " ") {
      const newContentState = Modifier.replaceText(
        currentContent,
        blockSelection,
        ""
      );
      setEditorState(
        RichUtils.toggleInlineStyle(
          EditorState.push(editorState, newContentState, "change-inline-style"),
          "BOLD"
        )
      );
      return "handled";
    }

    // Handle `**` for red text
    if (blockText === "**" && chars === " ") {
      const newContentState = Modifier.replaceText(
        currentContent,
        blockSelection,
        ""
      );
      setEditorState(
        RichUtils.toggleInlineStyle(
          EditorState.push(editorState, newContentState, "change-inline-style"),
          "RED"
        )
      );
      return "handled";
    }

    // Handle `***` for underline
    if (blockText === "***" && chars === " ") {
      const newContentState = Modifier.replaceText(
        currentContent,
        blockSelection,
        ""
      );
      setEditorState(
        RichUtils.toggleInlineStyle(
          EditorState.push(editorState, newContentState, "change-inline-style"),
          "UNDERLINE"
        )
      );
      return "handled";
    }

    return "not-handled";
  };

  return (
    <div className="editor-wrap">
      <div className="editor-header">
        <div />
        <span>Demo Editor by Shailesh Gupta</span>
        <div className="header-button">
          <button onClick={handleClearLocalStorage}>Clear LocalStorage</button>
          <button onClick={handleSaveContentToLocalStorage}>Save</button>
        </div>
      </div>

      <div className="rich-editor" onClick={focusEditor}>
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Type something here..."
          handleBeforeInput={handleBeforeInput}
          customStyleMap={customStyleMap}
        />
      </div>
    </div>
  );
};

const customStyleMap = {
  RED: {
    color: "red",
  },
};

export default DraftJsEditor;
