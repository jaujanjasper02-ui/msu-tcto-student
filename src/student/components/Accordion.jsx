// src/components/Accordion.jsx
import React, { useState } from "react";

export default function Accordion({ items = [] }) {
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <AccordionItem key={i} item={it} />
      ))}
    </div>
  );
}

function AccordionItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-md overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-4 py-3 flex justify-between items-center bg-white"
        aria-expanded={open}
      >
        <span className="font-medium">{item.q}</span>
        <span className="text-gray-500">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="px-4 py-3 bg-gray-50 text-sm text-gray-700">
          {item.a}
        </div>
      )}
    </div>
  );
}
