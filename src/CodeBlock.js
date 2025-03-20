// CodeBlock.jsx
import React from "react";
// You can choose between "Prism" or "Light" as a highlighter.
// Here, we're using the Prism highlighter.
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// Import a style theme (here, we use the "coy" theme)
import { 
  // vscDarkPlus, 
  materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language, code }) => {
  return (
    <SyntaxHighlighter language={language} style={materialDark}>
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
