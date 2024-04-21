import { useState } from 'react';

const Article = ({ text }: { text: string }) => <article>{text}</article>;

const ExpandableText = ({ text }: { text: string }) => {
  const limit = 255;
  const [isExpanded, setExpanded] = useState(false);

  if (text.length <= limit) return <Article text={text} />;

  return (
    <div>
      {isExpanded ? <Article text={text} /> : <Article text={text.substring(0, limit)} />}
      <button className="btn" onClick={() => setExpanded(!isExpanded)}>
        {isExpanded ? 'Show Less' : 'Show More'}
      </button>
    </div>
  );
};

export default ExpandableText;
