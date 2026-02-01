"use client";

import { useState } from "react";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ParagraphNode, TextNode } from "lexical";

import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { FontFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/font-format-toolbar-plugin";
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HistoryToolbarPlugin } from "@/components/editor/plugins/toolbar/history-toolbar-plugin";
import { useTranslation } from "react-i18next";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkToolbarPlugin } from "@/components/editor/plugins/toolbar/link-toolbar-plugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { FloatingLinkContext } from "@/components/editor/context/floating-link-context";
import { FormatParagraph } from "@/components/editor/plugins/toolbar/block-format/format-paragraph";
import { BlockFormatDropDown } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin";
import { FormatHeading } from "@/components/editor/plugins/toolbar/block-format/format-heading";
import { FormatNumberedList } from "@/components/editor/plugins/toolbar/block-format/format-numbered-list";
import { FormatBulletedList } from "@/components/editor/plugins/toolbar/block-format/format-bulleted-list";
import { FormatQuote } from "@/components/editor/plugins/toolbar/block-format/format-quote";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes: [HeadingNode, ParagraphNode, TextNode, QuoteNode],
  onError: (error: Error) => {
    console.error(error);
  },
};

export function RichTextEditor() {
  return (
    <div className="bg-background w-full overflow-hidden rounded-lg border">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
        }}
      >
        <TooltipProvider>
          <FloatingLinkContext>
            <Plugins />
          </FloatingLinkContext>
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}

export function Plugins() {
  const { t } = useTranslation();
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div className="relative">
      {/* toolbar plugins */}
      <ToolbarPlugin>
        {({ blockType }) => (
          <>
            <div className="flex items-center justify-between border-b border-border p-2">
              <BlockFormatDropDown>
                <FormatParagraph />
                <FormatHeading levels={["h1", "h2", "h3"]} />
                <FormatNumberedList />
                <FormatBulletedList />
                <FormatQuote />
              </BlockFormatDropDown>

              <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto">
                <FontFormatToolbarPlugin format="bold" />
                <FontFormatToolbarPlugin format="italic" />
                <FontFormatToolbarPlugin format="underline" />
                <FontFormatToolbarPlugin format="strikethrough" />
                <LinkToolbarPlugin />
              </div>

              <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto">
                <HistoryToolbarPlugin />
              </div>
            </div>
          </>
        )}
      </ToolbarPlugin>

      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable
                  placeholder={t("form.start_typing")}
                  className="ContentEditable__root relative block h-72 min-h-72 overflow-auto px-8 py-4 focus:outline-none"
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <HistoryPlugin />
        <LinkPlugin />
        <ListPlugin />
        <ClickableLinkPlugin />
      </div>
    </div>
  );
}
