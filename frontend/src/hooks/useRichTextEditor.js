import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import { useEffect, useState } from "react";

const useRichTextEditor = (initialContent = "") => {
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[400px] max-w-none p-4",
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setWordCount(text.split(/\s+/).filter(Boolean).length);
      setCharacterCount(text.length);

      // Auto-save to localStorage
      localStorage.setItem("blog-draft", editor.getHTML());
    },
  });

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("blog-draft");
    if (savedDraft && editor && !initialContent) {
      editor.commands.setContent(savedDraft);
    }
  }, [editor, initialContent]);

  const saveContent = () => {
    if (editor) {
      const html = editor.getHTML();
      localStorage.setItem("blog-draft", html);
      return html;
    }
    return "";
  };

  const loadDraft = () => {
    const savedDraft = localStorage.getItem("blog-draft");
    if (savedDraft && editor) {
      editor.commands.setContent(savedDraft);
    }
  };

  const clearContent = () => {
    if (editor) {
      editor.commands.clearContent();
      localStorage.removeItem("blog-draft");
    }
  };

  const getContent = () => {
    return editor ? editor.getHTML() : "";
  };

  const setContent = (content) => {
    if (editor) {
      editor.commands.setContent(content);
    }
  };

  return {
    editor,
    content: getContent(),
    wordCount,
    characterCount,
    saveContent,
    loadDraft,
    clearContent,
    setContent,
  };
};

export default useRichTextEditor;
