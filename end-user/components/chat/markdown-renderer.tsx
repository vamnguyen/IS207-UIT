"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div className={cn("markdown-content", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }: { children?: ReactNode }) => (
            <h1 className="text-lg font-bold mt-3 mb-2">{children}</h1>
          ),
          h2: ({ children }: { children?: ReactNode }) => (
            <h2 className="text-base font-bold mt-2.5 mb-1.5">{children}</h2>
          ),
          h3: ({ children }: { children?: ReactNode }) => (
            <h3 className="text-sm font-semibold mt-2 mb-1">{children}</h3>
          ),
          // Paragraphs
          p: ({ children }: { children?: ReactNode }) => (
            <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
          ),
          // Bold and Strong
          strong: ({ children }: { children?: ReactNode }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          // Italic
          em: ({ children }: { children?: ReactNode }) => (
            <em className="italic">{children}</em>
          ),
          // Lists
          ul: ({ children }: { children?: ReactNode }) => (
            <ul className="list-disc list-inside my-2 space-y-1 ml-1">
              {children}
            </ul>
          ),
          ol: ({ children }: { children?: ReactNode }) => (
            <ol className="list-decimal list-inside my-2 space-y-1 ml-1">
              {children}
            </ol>
          ),
          li: ({ children }: { children?: ReactNode }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          // Code
          code: ({
            className,
            children,
          }: {
            className?: string;
            children?: ReactNode;
          }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code
                  className={cn(
                    "block bg-muted/50 p-2.5 rounded-md text-xs font-mono overflow-x-auto my-2",
                    className
                  )}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className="bg-muted/50 px-1.5 py-0.5 rounded text-xs font-mono">
                {children}
              </code>
            );
          },
          // Preformatted
          pre: ({ children }: { children?: ReactNode }) => (
            <pre className="bg-muted/50 p-3 rounded-lg overflow-x-auto my-2 text-xs">
              {children}
            </pre>
          ),
          // Links
          a: ({ href, children }: { href?: string; children?: ReactNode }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
            >
              {children}
            </a>
          ),
          // Blockquote
          blockquote: ({ children }: { children?: ReactNode }) => (
            <blockquote className="border-l-2 border-primary/50 pl-3 my-2 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          // Horizontal Rule
          hr: () => <hr className="my-3 border-border" />,
          // Tables (GitHub Flavored Markdown)
          table: ({ children }: { children?: ReactNode }) => (
            <div className="overflow-x-auto my-2">
              <table className="min-w-full text-xs border-collapse border border-border rounded">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }: { children?: ReactNode }) => (
            <thead className="bg-muted/50">{children}</thead>
          ),
          tbody: ({ children }: { children?: ReactNode }) => (
            <tbody>{children}</tbody>
          ),
          tr: ({ children }: { children?: ReactNode }) => (
            <tr className="border-b border-border">{children}</tr>
          ),
          th: ({ children }: { children?: ReactNode }) => (
            <th className="px-2 py-1.5 text-left font-semibold border border-border">
              {children}
            </th>
          ),
          td: ({ children }: { children?: ReactNode }) => (
            <td className="px-2 py-1.5 border border-border">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
