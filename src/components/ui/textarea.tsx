// src/components/ui/textarea.tsx
import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export const Textarea: React.FC<TextareaProps> = (props) => (
  <textarea {...props} className="border rounded p-2 w-full" />
);
