import React from 'react';

interface PolicyPreviewProps {
  content: string;
}

export const PolicyPreview: React.FC<PolicyPreviewProps> = ({ content }) => {
  if (!content || !content.trim()) {
    return <p className="text-stone-400 italic text-xs p-4">No content typed yet. Type your policy or clauses in the editor...</p>;
  }

  const rawLines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentBulletList: string[] = [];
  let currentNumberList: string[] = [];

  const flushLists = (keyPrefix: string) => {
    if (currentBulletList.length > 0) {
      elements.push(
        <ul key={`${keyPrefix}-bullet`} className="list-disc list-outside pl-5 space-y-1 my-2 text-stone-700 text-xs sm:text-[13px]">
          {currentBulletList.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ul>
      );
      currentBulletList = [];
    }
    if (currentNumberList.length > 0) {
      elements.push(
        <ol key={`${keyPrefix}-num`} className="list-decimal list-outside pl-5 space-y-1 my-2 text-stone-700 text-xs sm:text-[13px]">
          {currentNumberList.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ol>
      );
      currentNumberList = [];
    }
  };

  const formatInline = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-stone-100 text-[#B84A22] text-xs font-mono">$1</code>');
  };

  rawLines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed === '---' || trimmed === '***') {
      flushLists(`hr-${idx}`);
      elements.push(<hr key={`hr-${idx}`} className="border-stone-200 my-4" />);
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushLists(`h2-${idx}`);
      const title = trimmed.replace(/^##\s+/, '');
      elements.push(
        <h2
          key={`h2-${idx}`}
          className="text-sm sm:text-base font-bold text-[#1A130E] mt-5 mb-1.5 tracking-tight first:mt-0"
          dangerouslySetInnerHTML={{ __html: formatInline(title) }}
        />
      );
      return;
    }

    if (trimmed.startsWith('### ')) {
      flushLists(`h3-${idx}`);
      const title = trimmed.replace(/^###\s+/, '');
      elements.push(
        <h3
          key={`h3-${idx}`}
          className="text-xs sm:text-sm font-bold text-[#1A130E] mt-3 mb-1"
          dangerouslySetInnerHTML={{ __html: formatInline(title) }}
        />
      );
      return;
    }

    if (trimmed.startsWith('> ')) {
      flushLists(`quote-${idx}`);
      const quote = trimmed.replace(/^>\s*/, '');
      elements.push(
        <blockquote
          key={`quote-${idx}`}
          className="border-l-3 border-[#B84A22] bg-orange-50/50 pl-3 py-2 my-2.5 rounded-r-lg text-xs text-stone-700 italic"
          dangerouslySetInnerHTML={{ __html: formatInline(quote) }}
        />
      );
      return;
    }

    if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemText = trimmed.replace(/^[•\-\*]\s*/, '');
      currentBulletList.push(itemText);
      return;
    }

    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      currentNumberList.push(numMatch[2]);
      return;
    }

    if (!trimmed) {
      flushLists(`empty-${idx}`);
      return;
    }

    flushLists(`p-${idx}`);
    elements.push(
      <p
        key={`p-${idx}`}
        className="text-stone-700 text-xs sm:text-[13px] leading-relaxed my-1.5"
        dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
      />
    );
  });

  flushLists('final');

  return <div className="space-y-0.5">{elements}</div>;
};
