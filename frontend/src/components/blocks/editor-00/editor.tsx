import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot, EditorState, SerializedEditorState } from "lexical";
import {
  TRANSFORMERS,
  $convertToMarkdownString,
  $convertFromMarkdownString,
} from "@lexical/markdown";

import { editorTheme } from "@/components/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";

import { nodes } from "./nodes";
import { Plugins } from "./plugins";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error);
  },
};

function LoadMarkdownPlugin({ markdown }: { markdown: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!markdown || markdown.trim() === "") {
      return;
    }

    editor.update(() => {
      const editorState = $convertFromMarkdownString(markdown, TRANSFORMERS);
      if (editorState) {
        editor.setEditorState(editorState);
      } else {
        console.warn("Could not convert markdown to editor state.");
      }
    });
  }, []);

  return null;
}

export function Editor({
  value,
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
}: {
  value: string;
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: string) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
}) {
  return (
    <div className="bg-white overflow-hidden rounded-lg border">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
        }}
      >
        <TooltipProvider>
          <Plugins />
          <LoadMarkdownPlugin markdown={value} />
          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              editorState.read(() => {
                const markdown = $convertToMarkdownString(TRANSFORMERS);
                onChange?.(markdown);
              });

              onSerializedChange?.(editorState.toJSON());
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}
