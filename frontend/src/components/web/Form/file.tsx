import React, { useState, useRef } from "react";

interface FileInputWidgetProps {
  htmlFor: string;
  label: string;
  placeholder: string;
  onChange?: (file: File) => void;
}

const FileInputWidget: React.FC<FileInputWidgetProps> = ({
  htmlFor,
  label,
  placeholder,
  onChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  let timer: NodeJS.Timeout;

  const handleMouseEnter = () => {
    timer = setTimeout(() => setIsHovered(true), 300);
  };

  const handleMouseLeave = () => {
    clearTimeout(timer);
    setIsHovered(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onChange) {
      onChange(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileContent(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="form-group relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <p className="block text-md font-normal text-text mb-1">{label}</p>
      <input
        ref={inputRef}
        type="file"
        id={htmlFor}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />
      <label
        htmlFor={htmlFor}
        className="block text-md font-normal placeholder-placeholder text-text bg-background border border-border py-1.5 px-2 rounded-md outline-none w-full cursor-pointer"
      >
        <span className="text-text">{placeholder}</span>
      </label>
    </div>
  );
};

export default FileInputWidget;
