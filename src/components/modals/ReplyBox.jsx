import { useContext, useState } from "react";
import AuthContext from "../../contexts/AuthProvider";

import { CgTrashEmpty } from "react-icons/cg";
import { IoSend } from "react-icons/io5";

import Swal from "sweetalert2";
import { postThread } from "../../utils/DataThreads";

import CodeSnippet from "../cards/Snippet";

const ReplyBox = ({ refId, addReply }) => {
  const [answer, setAnswer] = useState("");
  const [snippet, setSnippet] = useState("");
  const [filename, setFilename] = useState("");
  const [type, setType] = useState("");

  const { loginData } = useContext(AuthContext);

  const postingAnswer = (e) => {
    e.preventDefault();
    if (answer.trim() != "") {
      let data = {
        type: "reply",
        ref: refId,
        author: loginData,
        contents: `<p>${answer}</p>`,
        snippets: [],
      };

      if (filename || snippet) {
        data.snippets.push(
          {
            filename: filename,
            type: type,
            code: snippet,
          }
        );
      }

      addReply(postThread(data));
      document.getElementById("close-reply").click();
    } else {
      Swal.fire({
        icon: "error",
        title: "Empty Answer",
        text: "You must write down your answer so the SOBug Asker can solve their code. X(",
      });
    }
  }

  const discard = () => {
    setAnswer("");
    setFilename("");
    setType("");
    setSnippet("");
  }

  return <>
    <div
      className="modal fade"
      id="replyModal"
      // tabIndex="-1"
      aria-labelledby="replyModal"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-body align-items-center">
            {/* Answer */}
            <h5>Reply Your Answer</h5>
            <textarea 
              name="reply-answer" 
              id="reply-answer" 
              className="form-control"
              rows={4}
              placeholder="Type your answer here..."
              value={answer} 
              onChange={(e) => setAnswer(e.target.value)} 
            />
            {/* Code Snippet */}
            <h5 className="mt-3">Code Snippet</h5>
            <div className="row g-2 pb-2">
              <div className="col">
                <input 
                  type="text" 
                  name="filename-reply" 
                  id="filename-reply" 
                  className="form-control" 
                  placeholder="filename.ext"
                  value={filename} 
                  onChange={(e) => setFilename(e.target.value)} 
                  autoComplete="off"
                />
              </div>
              <div className="col-xl-4 col-md-5 col-sm-6 col">
                <select name="type-reply" id="type-reply" className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                  {/* cpp, python, html, css, js, jsx, ts, tsx, json, yaml, yml, xml, md */}
                  <option value="" disabled>- Choose Language -</option>
                  <option value="text">Language: Text</option>
                  <option value="python">Language: Python</option>
                  <option value="html">Language: HTML</option>
                  <option value="css">Language: CSS</option>
                  <option value="js">Language: JS</option>
                  <option value="jsx">Language: JSX</option>
                  <option value="ts">Language: TS</option>
                  <option value="tsx">Language: TSX</option>
                  <option value="json">Language: JSON</option>
                  <option value="yaml">Language: YAML</option>
                  <option value="yml">Language: YML</option>
                  <option value="xml">Language: XML</option>
                  <option value="md">Language: MD</option>
                  </select>
              </div>
            </div>
            <textarea 
              className="form-control"
              name="snippet-reply" 
              id="snippet-reply" 
              rows={4}
              placeholder="Type your code here..."
              value={snippet} 
              onChange={(e) => setSnippet(e.target.value)} 
            />
            <h6 className="text-center text-primary mt-2"><span className="text-danger">NOTE:</span> Use {"<space>"} as alternate of {"<tab>"}</h6>
            
            {/* Preview Snippet */}
            {
              snippet.trim() || filename.trim()? <>
                <CodeSnippet filename={filename} type={type} code={snippet} />
              </> : <></>
            }
          </div>
          <div className="modal-footer row m-0 p-2">
            <div className="col">
              <button
                id="close-reply"
                type="button"
                className="btn btn-outline-danger"
                data-bs-dismiss="modal"
                onClick={discard}
              >
                <CgTrashEmpty className="mb-1" /> Discard
              </button>
            </div>
            <div className="col text-end">
              <button
                type="button"
                className="btn btn-primary shadow-sm"
                onClick={postingAnswer}
              >
                <IoSend size={16} className="mb-1 me-1" /> POST ANSWER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
}

export default ReplyBox;