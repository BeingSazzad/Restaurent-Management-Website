import React from 'react';

interface PolicyContentRendererProps {
  content?: string;
  sections?: { id?: string; title: string; content: string }[];
}

export const PolicyContentRenderer: React.FC<PolicyContentRendererProps> = ({ content, sections }) => {
  // If raw unified content string is available, render markdown
  if (content && content.trim()) {
    const rawLines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let currentBulletList: string[] = [];
    let currentNumberList: string[] = [];

    const flushLists = (keyPrefix: string) => {
      if (currentBulletList.length > 0) {
        elements.push(
          <ul key={`${keyPrefix}-bullet`} className="list-disc list-outside pl-6 space-y-1.5 my-3 text-[#444444]">
            {currentBulletList.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            ))}
          </ul>
        );
        currentBulletList = [];
      }
      if (currentNumberList.length > 0) {
        elements.push(
          <ol key={`${keyPrefix}-num`} className="list-decimal list-outside pl-6 space-y-1.5 my-3 text-[#444444]">
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

      // Horizontal Rule
      if (trimmed === '---' || trimmed === '***') {
        flushLists(`hr-${idx}`);
        elements.push(<hr key={`hr-${idx}`} className="border-[#EAE5DF] my-6" />);
        return;
      }

      // Heading 2
      if (trimmed.startsWith('## ')) {
        flushLists(`h2-${idx}`);
        const title = trimmed.replace(/^##\s+/, '');
        elements.push(
          <h2
            key={`h2-${idx}`}
            className="text-[18px] sm:text-[20px] font-bold text-[#1A130E] mt-7 mb-2 tracking-tight first:mt-0"
            dangerouslySetInnerHTML={{ __html: formatInline(title) }}
          />
        );
        return;
      }

      // Heading 3
      if (trimmed.startsWith('### ')) {
        flushLists(`h3-${idx}`);
        const title = trimmed.replace(/^###\s+/, '');
        elements.push(
          <h3
            key={`h3-${idx}`}
            className="text-[15px] sm:text-[16px] font-bold text-[#1A130E] mt-5 mb-1.5"
            dangerouslySetInnerHTML={{ __html: formatInline(title) }}
          />
        );
        return;
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        flushLists(`quote-${idx}`);
        const quote = trimmed.replace(/^>\s*/, '');
        elements.push(
          <blockquote
            key={`quote-${idx}`}
            className="border-l-4 border-[#B84A22] bg-orange-50/60 pl-4 py-2.5 my-3 rounded-r-xl text-[13.5px] text-stone-700 italic"
            dangerouslySetInnerHTML={{ __html: formatInline(quote) }}
          />
        );
        return;
      }

      // Bullet List item
      if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemText = trimmed.replace(/^[•\-\*]\s*/, '');
        currentBulletList.push(itemText);
        return;
      }

      // Numbered List item
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        currentNumberList.push(numMatch[2]);
        return;
      }

      // Empty line -> flush lists
      if (!trimmed) {
        flushLists(`empty-${idx}`);
        return;
      }

      // Standard Paragraph
      flushLists(`p-${idx}`);
      elements.push(
        <p
          key={`p-${idx}`}
          className="text-[#444444] text-[14px] sm:text-[15px] leading-relaxed my-2"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
        />
      );
    });

    flushLists('final');

    return <div className="space-y-1">{elements}</div>;
  }

  // Fallback: render sections array
  if (sections && sections.length > 0) {
    return (
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <section
            key={section.id || idx}
            className={`space-y-2 ${idx > 0 && idx === sections.length - 1 ? 'pt-4 border-t border-[#E5E5E5]' : ''}`}
          >
            <h2 className="text-[17px] sm:text-[18px] font-bold text-[#1A130E]">{section.title}</h2>
            <p className="whitespace-pre-line text-[#444444] text-[14px] sm:text-[15px] leading-relaxed">
              {section.content}
            </p>
          </section>
        ))}
      </div>
    );
  }

  return <p className="text-stone-400 italic">No content published yet.</p>;
};
