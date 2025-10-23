import React, { useState, useRef, useEffect } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Link, 
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Heading1,
  Heading2,
  Heading3
} from "lucide-react";

const RichTextEditor = ({ value, onChange, placeholder = "Start writing..." }) => {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleContentChange();
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      execCommand("insertImage", url);
    }
  };

  const insertLink = () => {
    const url = prompt("Enter link URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const ToolbarButton = ({ onClick, children, isActive = false, title }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-muted ${
        isActive ? "bg-primary text-primary-foreground" : ""
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/20">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <ToolbarButton onClick={() => execCommand("bold")} title="Bold">
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand("italic")} title="Italic">
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand("underline")} title="Underline">
            <Underline className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <ToolbarButton onClick={() => execCommand("formatBlock", "h1")} title="Heading 1">
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand("formatBlock", "h2")} title="Heading 2">
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand("formatBlock", "h3")} title="Heading 3">
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <ToolbarButton onClick={() => execCommand("insertUnorderedList")} title="Bullet List">
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand("insertOrderedList")} title="Numbered List">
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <ToolbarButton onClick={() => execCommand("justifyLeft")} title="Align Left">
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand("justifyCenter")} title="Align Center">
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand("justifyRight")} title="Align Right">
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand("justifyFull")} title="Justify">
            <AlignJustify className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* Media */}
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={insertLink} title="Insert Link">
            <Link className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={insertImage} title="Insert Image">
            <Image className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand("formatBlock", "blockquote")} title="Quote">
            <Quote className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`min-h-[400px] p-4 focus:outline-none ${
          isFocused ? "ring-2 ring-primary/20" : ""
        }`}
        style={{
          minHeight: "400px",
          lineHeight: "1.6",
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {/* Placeholder */}
      {!value && !isFocused && (
        <div className="absolute top-16 left-4 text-muted-foreground pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;

