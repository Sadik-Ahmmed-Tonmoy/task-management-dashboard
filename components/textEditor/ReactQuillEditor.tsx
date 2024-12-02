"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list", // Ensure 'list' format is included
  "bullet", // Ensure 'bullet' format is included
  "indent",
  "link",
  "image",
  "video",
  "align",
];

const ReactQuillEditor: React.FC = () => {
  const [value, setValue] = useState("");
  const [submittedValue, setSubmittedValue] = useState("");

  const handleSubmit = () => {
    console.log(value);
    setSubmittedValue(value);
  };

  return (
    <>
      <div className="my-4">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          modules={modules}
          formats={formats}
          className="h-60"
        />
      </div>

      <button onClick={handleSubmit} className="bg-lime-400 px-3 py-2 rounded mt-20 outline-lime-100 text-black">
        Submit
      </button>

      {submittedValue && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Submitted Content</h2>
          <div className="ql-editor disable-tailwind" dangerouslySetInnerHTML={{ __html: submittedValue }} />{" "}
        </div>
      )}
    </>
  );
};

export default ReactQuillEditor;
