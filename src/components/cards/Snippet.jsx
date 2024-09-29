import { CodeBlock } from "react-code-block";
import { FaCode } from "react-icons/fa6";

const CodeSnippet = ({ filename, type, code }) => {
  return <>
    <ul className="nav nav-tabs" role="tablist">
      <li className="nav-item me-1" role="presentation">
        <button
          className="nav-link active pb-0"
          // id="snippet-1-tab"
          // data-bs-toggle="tab"
          // data-bs-target="#snippet-1"
          type="button"
          role="tab"
          // aria-controls="snippet-1"
          aria-selected="true"
        >
          <FaCode className="mb-1 me-2" /> {filename}
        </button>
      </li>
    </ul>
    <div className="tab-content px-3 mb-2 border border-top-0 rounded-bottom">
      <div
        className="tab-pane fade show active pt-3"
        // id="snippet-1"
        role="tabpanel"
        // aria-labelledby="snippet-1-tab"
      >
        <CodeBlock code={code} language={type}>
          <CodeBlock.Code className="bg-dark px-4 py-3 rounded shadow-sm">
            <div className="table-row">
              <CodeBlock.LineNumber className="table-cell pe-3 text-secondary" />
              <CodeBlock.LineContent className="table-cell">
                <CodeBlock.Token />
              </CodeBlock.LineContent>
            </div>
          </CodeBlock.Code>
        </CodeBlock>
      </div>
    </div>
  </>
}

export default CodeSnippet;