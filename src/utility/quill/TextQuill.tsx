import React, { FC } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import ImageResize from "@looop/quill-image-resize-module-react";

interface TextQuillProps {
  name: string;
  value: string;
  setValue: (value: string) => void;
  isDisable: boolean;
}

// Quill.register("modules/ImageResize", ImageResize);
// ImageResize: { modules: ["Resize"] },
const TextQuill: FC<TextQuillProps> = ({ name, value, setValue, isDisable }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["image"],
      [{ align: [] }, { color: [] }, { background: [] }],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "color",
    "background",
  ];

  return (
    <ReactQuill
      id={name}
      className="form-control text-editor"
      theme="snow"
      modules={modules}
      formats={formats}
      value={value}
      onChange={(content, _, source, editor) => setValue(editor.getHTML())}
      style={{ width: "100%", height: "450px" }}
      readOnly={isDisable}
    />
  );
};

export default TextQuill;
