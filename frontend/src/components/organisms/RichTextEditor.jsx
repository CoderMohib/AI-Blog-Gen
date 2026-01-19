import { EditorContent } from "@tiptap/react";
import BlogEditorToolbar from "./BlogEditorToolbar";

const RichTextEditor = ({ editor, wordCount, characterCount }) => {
  if (!editor) {
    return (
      <div className="flex items-center justify-center h-96 bg-card-soft rounded-lg">
        <p className="text-text-secondary">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <BlogEditorToolbar editor={editor} />

      <div className="relative">
        <EditorContent editor={editor} className="prose-editor" />
      </div>

      {/* Stats Bar */}
      <div className="border-t border-border px-4 py-2 bg-card-soft flex justify-between items-center text-sm text-text-secondary">
        <div className="flex gap-4">
          <span>Words: {wordCount}</span>
          <span>Characters: {characterCount}</span>
        </div>
        <div className="text-xs">Auto-saved</div>
      </div>
    </div>
  );
};

export default RichTextEditor;
