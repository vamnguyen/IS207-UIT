"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export default function PaginationControl({
  current_page,
  last_page,
  onChange,
}: {
  current_page: number | undefined;
  last_page: number | undefined;
  onChange: (page: number) => void;
}) {
  if (!current_page || !last_page) return null;

  const current = current_page;
  const last = last_page;

  // Build pages like: 1, ..., leftRange, current, rightRange, ..., last
  const siblings = 1;
  const left = Math.max(1, current - siblings);
  const right = Math.min(last, current + siblings);

  const items: (number | "...")[] = [];

  if (left > 1) {
    items.push(1);
    if (left > 2) items.push("...");
  }

  for (let p = left; p <= right; p++) items.push(p);

  if (right < last) {
    if (right < last - 1) items.push("...");
    items.push(last);
  }

  return (
    <Pagination>
      <PaginationContent>
        {items.map((it, idx) => (
          <PaginationItem key={idx}>
            {it === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={it === current}
                onClick={(e) => {
                  e.preventDefault();
                  onChange(Number(it));
                }}
              >
                {it}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  );
}
