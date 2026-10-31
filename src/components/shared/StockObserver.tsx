"use client";

import { useEffect } from "react";

const STOCK_HEX: Record<string, string> = {
  paper: "#FBF8F1",
  bone: "#EFE9DB",
  champagne: "#EFE3C4",
  ink: "#0E0F12",
  midnight: "#0F1733",
  royal: "#192F6D",
  room: "#13214D",
};

/**
 * Sets the masthead's stock and the browser's theme-color to whatever stock is
 * under the masthead. Chrome (masthead, dock) is skipped, and so is the reply
 * card, a paper block that only covers part of the room section's width.
 */
export function StockObserver() {
  useEffect(() => {
    const header = document.querySelector("[data-masthead]");
    const meta = document.querySelector('meta[name="theme-color"]');
    const stocks = Array.from(
      document.querySelectorAll<HTMLElement>("[data-stock]:not([data-chrome]):not(#reserve)"),
    );
    const order = new Map(stocks.map((element, index) => [element as Element, index]));
    const active = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) active.add(entry.target);
          else active.delete(entry.target);
        }

        let current: Element | undefined;
        for (const element of active) {
          if (!current || order.get(element)! > order.get(current)!) current = element;
        }
        const stock = current?.getAttribute("data-stock");
        if (!stock) return;

        header?.setAttribute("data-stock", stock);
        meta?.setAttribute("content", STOCK_HEX[stock]);
      },
      { rootMargin: "-32px 0px -95% 0px" },
    );

    stocks.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
