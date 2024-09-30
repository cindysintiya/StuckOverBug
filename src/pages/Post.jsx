import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthProvider";

import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

import { BiEdit } from "react-icons/bi";
import { FaCode } from "react-icons/fa6";
import { IoNewspaperOutline } from "react-icons/io5";

import Swal from "sweetalert2";
import { baseUrl } from "../utils/format";
import { postThread } from "../utils/DataThreads";

import ThreadCard from "../components/cards/Thread";
import ThreadDetailCard from "../components/cards/ThreadDetail";
import CodeSnippet from "../components/cards/Snippet";

const PostThread = () => {
  const [level, setLevel] = useState(2);

  const [editor, setEditor] = useState("");
  const [isi, setIsi] = useState("");

  const [snippet1, setSnippet1] = useState("");
  const [filename1, setFilename1] = useState("");
  const [type1, setType1] = useState("");
  const [snippet2, setSnippet2] = useState("");
  const [filename2, setFilename2] = useState("");
  const [type2, setType2] = useState("");
  const [snippet3, setSnippet3] = useState("");
  const [filename3, setFilename3] = useState("");
  const [type3, setType3] = useState("");

  const { loginData } = useContext(AuthContext);

  const [threadPreview, setThreadPreview] = useState({
    id: -1,
    type: "question",
    author: loginData,
    contents: "",
    status: "",
    time: new Date(),
  });

  const nav = useNavigate();

  const previewIsi = () => {
    try {
      const htmlString = draftToHtml(convertToRaw(editor.getCurrentContent()));
      setIsi(htmlString); 
      setThreadPreview({ ...threadPreview, contents: htmlString, status: level, time: new Date(), });
    } catch (error) {
      setThreadPreview({ ...threadPreview, status: level, time: new Date(), });
    }
  };

  const postingThread = (e) => {
    e.preventDefault();
    const form = document.querySelector(".needs-validation");
    form.classList.add("was-validated");
    if (form.checkValidity()) {
      form.classList.remove("was-validated");

      const data = {
        ...threadPreview,
        author: loginData._id,
        snippets: []
      };

      if (filename1 || snippet1) {
        data.snippets.push(
          {
            filename: filename1,
            type: type1,
            code: snippet1,
          }
        );
      }
      if (filename2 || snippet2) {
        data.snippets.push(
          {
            filename: filename2,
            type: type2,
            code: snippet2,
          }
        );
      }
      if (filename3 || snippet3) {
        data.snippets.push(
          {
            filename: filename3,
            type: type3,
            code: snippet3,
          }
        );
      }

      Swal.fire({
        title: "Please Wait...",
        text: "Sending your thread data to server.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
          postThread(data)
            .then((res) => {
              Swal.fire({
                icon: "success",
                title: "Thread Posted!",
                text: "You can find your thread on Home page and wait for SOBug(s)' reply to solve your bug.",
                confirmButtonText: "Go to HOME",
                didClose: () => {
                  nav(`${baseUrl}/`);
                }
              });
            })
            .catch((err) => {
              Swal.fire({
                icon: "error",
                title: "Failed to Post!",
                text: err.response?.data.message || "Something went wrong!",
              });
            });
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Empty Thread",
        text: "You must write down your question so other SOBug can help you fixing your code. What can we solve if you don't provide your question? X(",
        // confirmButtonColor: "#00b6db",
      });
    }
  }

  return (
    <>
      <div className="row row-gap-1 m-2 pb-3">
        <div className="col-md-10 offset-md-1">
          <ul className="nav nav-tabs flex-nowrap overflow-auto overflow-y-hidden" id="myTab" role="tablist">
            <li className="nav-item me-1" role="presentation">
              <button
                className="nav-link active text-nowrap"
                id="form-editor-tab"
                data-bs-toggle="tab"
                data-bs-target="#form-editor"
                type="button"
                role="tab"
                aria-controls="form-editor"
                aria-selected="true"
              >
                <BiEdit className="mb-1" /> Question Editor
              </button>
            </li>
            <li className="nav-item me-1" role="presentation">
              <button
                className="nav-link text-nowrap"
                id="snippet-editor-tab"
                data-bs-toggle="tab"
                data-bs-target="#snippet-editor"
                type="button"
                role="tab"
                aria-controls="snippet-editor"
                aria-selected="false"
              >
                <FaCode className="mb-1" /> Code Snippets <small>(optional)</small>
              </button>
            </li>
            <li className="nav-item" role="presentation" onMouseDown={previewIsi}>
              <button
                className="nav-link text-nowrap"
                id="preview-thread-tab"
                data-bs-toggle="tab"
                data-bs-target="#preview-thread"
                type="button"
                role="tab"
                aria-controls="preview-thread"
                aria-selected="false"
              >
                <IoNewspaperOutline className="mb-1" /> Thread Preview
              </button>
            </li>
          </ul>
          <div className="tab-content p-3 pt-0 border border-top-0 rounded-bottom">
            <div
              className="tab-pane fade show active pt-3"
              id="form-editor"
              role="tabpanel"
              aria-labelledby="form-editor-tab"
            >
              <form
                id="form-thread"
                className="needs-validation"
                onSubmit={postingThread}
                noValidate
              >
                <Editor
                  editorState={editor}
                  onEditorStateChange={(val) => setEditor(val)}
                  // toolbarClassName="mt-2"
                  editorClassName="demo-editor border px-3"
                  editorStyle={{ height: window.visualViewport.height * 0.5 }}
                  required
                />
                <input
                  type="text"
                  name="hidden-isi"
                  defaultValue={isi.slice(3, isi.length - 5)}
                  required
                  hidden
                />
                <div className="invalid-feedback">*Please fill in your thread with any question</div>
                <div className="row mt-2">
                  <div className="col-auto">
                    <h5 className="mb-0">Urgent Level:</h5>
                  </div>
                  <div className="col-xl-5 col-md-8 col">
                    <div className="d-flex flex-wrap gap-1 justify-content-between">
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="urgent-level" id="level1" checked={level == 1} onChange={(e) => e.target.checked? setLevel(1) : null} />
                        <label className="form-check-label" htmlFor="level1">
                          Iseng Doank
                        </label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="urgent-level" id="level2" checked={level == 2} onChange={(e) => e.target.checked? setLevel(2) : null} />
                        <label className="form-check-label" htmlFor="level2">
                          Nanya Aja
                        </label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="urgent-level" id="level3" checked={level == 3} onChange={(e) => e.target.checked? setLevel(3) : null} />
                        <label className="form-check-label" htmlFor="level3">
                          Urgent Buanget
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="float-start pt-2 pb-3">
                  <NavLink
                    to={`${baseUrl}/`}
                    aria-current="page"
                    className="btn btn-outline-danger shadow mt-3 me-2"
                  >
                    Discard
                  </NavLink>
                </div>
                <div className="float-end pt-2 pb-3">
                  <button
                    type="submit"
                    id="btn-save"
                    onMouseDown={previewIsi}
                    className="btn btn-primary shadow mt-3"
                  >
                    POST THREAD
                  </button>
                </div>
              </form>
            </div>
            <div
              className="tab-pane fade pt-2 text-start overflow-auto"
              id="snippet-editor"
              role="tabpanel"
              aria-labelledby="snippet-editor-tab"
              style={{ height: window.visualViewport.height * 0.75 }}
            >
              <div className="p-2">
                <h6 className="text-center text-primary"><span className="text-danger">NOTE:</span> Use {"<space>"} as alternate of {"<tab>"}</h6>
                <h5>Snippet 1</h5>
                <div className="row g-2 pb-2">
                  <div className="col">
                    <input 
                      type="text" 
                      name="filename-1" 
                      id="filename-1" 
                      className="form-control" 
                      placeholder="filename.ext"
                      value={filename1} 
                      onChange={(e) => setFilename1(e.target.value)} 
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-xl-3 col-md-4 col-sm-5 col">
                    <select name="type-1" id="type-1" className="form-select" value={type1} onChange={(e) => setType1(e.target.value)}>
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
                  name="snippet-1" 
                  id="snippet-1" 
                  rows={5}
                  placeholder="Type your code here..."
                  value={snippet1} 
                  onChange={(e) => setSnippet1(e.target.value)} 
                />
              </div>
              <div className="p-2">
                <h5>Snippet 2</h5>
                <div className="row g-2 pb-2">
                  <div className="col">
                    <input 
                      type="text" 
                      name="filename-2" 
                      id="filename-2" 
                      className="form-control" 
                      placeholder="filename.ext"
                      value={filename2} 
                      onChange={(e) => setFilename2(e.target.value)} 
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-xl-3 col-md-4 col-sm-5 col">
                    <select name="type-2" id="type-2" className="form-select" value={type2} onChange={(e) => setType2(e.target.value)}>
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
                  name="snippet-2" 
                  id="snippet-2" 
                  rows={5}
                  placeholder="Type your code here..."
                  value={snippet2} 
                  onChange={(e) => setSnippet2(e.target.value)} 
                />
              </div>
              <div className="p-2">
                <h5>Snippet 3</h5>
                <div className="row g-2 pb-2">
                  <div className="col">
                    <input 
                      type="text" 
                      name="filename-3" 
                      id="filename-3" 
                      className="form-control" 
                      placeholder="filename.ext"
                      value={filename3} 
                      onChange={(e) => setFilename3(e.target.value)} 
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-xl-3 col-md-4 col-sm-5 col">
                    <select name="type-3" id="type-3" className="form-select" value={type3} onChange={(e) => setType3(e.target.value)}>
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
                  name="snippet-3" 
                  id="snippet-3" 
                  rows={5}
                  placeholder="Type your code here..."
                  value={snippet3} 
                  onChange={(e) => setSnippet3(e.target.value)} 
                />
              </div>
            </div>
            <div
              className="tab-pane fade pt-3 text-start overflow-auto"
              id="preview-thread"
              role="tabpanel"
              aria-labelledby="preview-thread-tab"
              style={{ height: window.visualViewport.height * 0.75 }}
            >
              <div className="col-md-10 offset-md-1">
                <h4 className="text-center">Thread Card <span className="fs-6">(show on home page)</span></h4>
                <ThreadCard data={threadPreview} />
                <br />
                
                <h4 className="text-center">Thread Detail <span className="fs-6">(show on detail page)</span></h4>
                <ThreadDetailCard data={threadPreview} level={level} isi={isi} />
                <br />

                <h4 className="text-center">Code Snippet(s) <span className="fs-6">(show on detail page)</span></h4>
                {
                  snippet1.trim() || filename1.trim()? <>
                    <CodeSnippet filename={filename1} type={type1} code={snippet1} />
                  </> : <></>
                }
                {
                  snippet2.trim() || filename2.trim()? <>
                    <CodeSnippet filename={filename2} type={type2} code={snippet2} />
                  </> : <></>
                }
                {
                  snippet3.trim() || filename3.trim()? <>
                    <CodeSnippet filename={filename3} type={type3} code={snippet3} />
                  </> : <></>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PostThread;