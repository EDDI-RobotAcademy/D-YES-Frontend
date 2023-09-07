import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useRef, useMemo, useState } from "react";
import { ImageResize } from "quill-image-resize-module-ts";


interface TextQuillProps {
  name: string;
  value: string;
  setValue: (value: string) => void;
  isDisable: boolean;
}

Quill.register("modules/ImageResize", ImageResize);
export default function TextQuill({ name, value, setValue, isDisable }: TextQuillProps) {
  const quillRef = useRef<ReactQuill | null>(null);
  const [imageData, setImageData] = useState<string | null>(null); // 이미지 데이터를 저장

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.addEventListener("change", () => {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];

        const reader = new FileReader();

        reader.onload = async () => {
          if (reader.result) {
            const base64Data = (reader.result as string).split(",")[1];
            const editor = quillRef?.current?.getEditor();
            setImageData(base64Data); // 이미지 데이터를 상태로 저장

            if (editor) {
              const range = editor.getSelection() || { index: 0, length: 0 };
              editor.insertEmbed(range.index, "image", `data:image/*;base64,${base64Data}`);
              editor.setSelection({ index: range.index + 1, length: 0 });
            }
          }
        };

        reader.readAsDataURL(file);
      }
    });
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["image"],
          [{ align: [] }, { color: [] }, { background: [] }],
        ],
        handlers: { image: imageHandler },
      },
      clipboard: {
        matchVisual: false,
      },
      ImageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize"],
      },
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "align",
    "image",
  ];

  return (
    <ReactQuill
      id={name}
      className="form-control text-editor"
      theme="snow"
      ref={quillRef}
      modules={modules}
      formats={formats}
      value={value || ""}
      onChange={(content, _, source, editor) => setValue(editor.getHTML())}
      style={{ width: "100%", height: "450px" }}
      readOnly={isDisable}
    />
  );
}
