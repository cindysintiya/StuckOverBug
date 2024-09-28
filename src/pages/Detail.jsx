import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Avatar } from "@mui/material";
import { CodeBlock } from "react-code-block";
import { FaCode } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";

import { findThread, statusName } from "../utils/DataThreads";
import { getComments, postComment } from "../utils/DataComments";
import { userDetail } from "../utils/DataUsers";
import { datetimeFormat } from "../utils/format";

import ReplyBox from "../components/modals/ReplyBox";
import BlankPage from "../components/loaders/Blank";
import AuthContext from "../contexts/AuthProvider";

const DetailThread = () => {
  const id = useParams().id;

  const [thread, setThread] = useState();
  const [replies, setReplies] = useState();
  const [comments, setComments] = useState();

  const [commentBox, setCommentBox] = useState("");

  const { loginData } = useContext(AuthContext);

  const addReply = (reply) => {
    setReplies([reply, ...replies]);
  }

  const postingComment = (e) => {
    e.preventDefault();
    const data = {
      author: loginData.id,
      ref: id,
      contents: commentBox,
    }
    setComments([postComment(data), ...comments]);
    setCommentBox("");
    document.getElementById("comments-box").scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    setThread(findThread(id).thread);
    setReplies(findThread(id).replies);
    setComments(getComments(id));
  }, []);

  return (
    thread? <>
      <div className="row mx-0 my-3">
        <div className="col-md-7 offset-md-1">
          {/* THREAD */}
          <div className="border rounded p-3 pb-0 mb-2">
            <div className="row m-0 gap-2 align-items-start">
              <div className="col-auto p-0">
                <Avatar
                  role="button"
                  className="ratio ratio-1x1"
                >
                  <img src={userDetail(thread.author).profile} alt="pic" className="img-fluid object-fit-cover" />
                </Avatar>
              </div>
              <div className="col-auto p-0">
                <h6 className="card-title mb-0">{userDetail(thread.author).realname}</h6>
                <p className="card-title mb-0 small text-secondary">@{userDetail(thread.author).username}</p>
              </div>
            </div>
            <div className="d-flex flex-wrap m-0 mt-2">
              <div className="col p-0">
                <p className="small mb-0 text-nowrap"><span className="text-secondary me-1">Posted on</span> {datetimeFormat(thread.time, "DD MMMM yyyy HH:mm")}</p>
              </div>
              <div className="col p-0">
                <p className="small mb-0 text-nowrap"><span className="text-secondary me-1">Status</span> {statusName[thread.status]}</p>
              </div>
            </div>
            <div
              className="card-text mt-2"
              dangerouslySetInnerHTML={{ __html: thread.contents }}
            />
          </div>
          
          {/* CODE SNIPPETS */}
          {
            thread.snippets.length? <>
              <ul className="nav nav-tabs flex-nowrap overflow-auto overflow-y-hidden" id="snippetTab" role="tablist">
                {
                  thread.snippets.map((snippet, i) => {
                    return <li className="nav-item me-1 text-nowrap" role="presentation" key={i}>
                      <button
                        className={`nav-link ${i? "" : "active"} pb-1`}
                        id={`snippet-${i}-tab`}
                        data-bs-toggle="tab"
                        data-bs-target={`#snippet-${i}`}
                        type="button"
                        role="tab"
                        aria-controls={`snippet-${i}`}
                        aria-selected="true"
                      >
                        <FaCode className="mb-1 me-2" /> {snippet.filename}
                      </button>
                    </li>
                  })
                }
              </ul>
              <div className="tab-content px-3 border border-top-0 rounded-bottom">
                {
                  thread.snippets.map((snippet, i) => {
                    return <div
                      className={`tab-pane fade ${i? "" : "show active"} pt-3`}
                      id={`snippet-${i}`}
                      role="tabpanel"
                      aria-labelledby={`snippet-${i}-tab`}
                      key={i}
                    >
                      <CodeBlock code={snippet.code} language={snippet.type}>
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
                  })
                }
              </div>
            </> : <></>
          }

          {/* REPLY */}
          <div className="row mx-0 mt-4 justify-content-between align-items-center">
            <h4 className="col mb-0">Reply <span className="fs-6 text-secondary">({replies.length})</span></h4>
            <div className="col-auto">
              {
                thread.status? <>
                  <button className="btn btn-success pt-1 shadow-sm" data-bs-toggle="modal" data-bs-target="#replyModal">
                    + New Reply
                  </button>
                </> : <>
                  <button className="btn btn-success pt-1 disabled" disabled>
                    + New Reply
                  </button>
                </>
              }
            </div>
          </div>
          <hr className="my-2"/>
          {
            replies && replies.length? <>
              <div className="mx-2">
                {
                  replies.map((reply, i) => {
                    return <div className="my-3" key={i}>
                      {/* THREAD */}
                      <div className="card mb-2">
                        <div className="card-header">
                          <div className="row m-0 mt-1 gap-2 align-items-start">
                            <div className="col-auto p-0">
                              <Avatar
                                role="button"
                                className="ratio ratio-1x1"
                              >
                                <img src={userDetail(reply.author).profile} alt="pic" className="img-fluid object-fit-cover" />
                              </Avatar>
                            </div>
                            <div className="col-auto p-0">
                              <h6 className="card-title mb-0">
                                {userDetail(reply.author).realname}
                                <span className="small text-secondary"> (@{userDetail(reply.author).username})</span>
                              </h6>
                              {/* <p className="card-title mb-0 small text-secondary"></p> */}
                              <p className="small mt-1 mb-0 text-nowrap"><span className="text-secondary me-1">Reply on</span> {datetimeFormat(reply.time, "DD MMMM yyyy HH:mm")}</p>
                            </div>
                          </div>
                        </div>
                        <div className="card-body pb-0">
                          <div
                            className="card-text"
                            dangerouslySetInnerHTML={{ __html: reply.contents }}
                          />
                          {/* SNIPPET */}
                          {
                            reply.snippets.length? <>
                              <ul className="nav nav-tabs" id="snippetTab" role="tablist">
                                <li className="nav-item me-1" role="presentation">
                                  <button
                                    className="nav-link active pb-0"
                                    id={`snippet-rep${i}-tab`}
                                    data-bs-toggle="tab"
                                    data-bs-target={`#snippet-rep${i}`}
                                    type="button"
                                    role="tab"
                                    aria-controls={`snippet-rep${i}`}
                                    aria-selected="true"
                                  >
                                    <FaCode className="mb-1 me-2" /> {reply.snippets[0].filename}
                                  </button>
                                </li>
                              </ul>
                              <div className="tab-content px-3 mb-3 border border-top-0 rounded-bottom">
                                <div
                                  className="tab-pane fade show active pt-3"
                                  id={`snippet-rep${i}`}
                                  role="tabpanel"
                                  aria-labelledby={`snippet-rep${i}-tab`}
                                >
                                  <CodeBlock code={reply.snippets[0].code} language={reply.snippets[0].type}>
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
                            </> : <></>
                          }
                        </div>
                      </div>
                    </div>
                  })
                }
              </div>
            </> : <>
              <p className="text-center pt-4 pb-3">No Reply yet...</p>
            </>
          }
          {
            thread.status? 
              <ReplyBox refId={id} addReply={addReply}/> : <>
                <div className="position-relative">
                  <hr className="border-warning border-3 mt-2 mb-0" />
                  <hr className="border-warning border-3 my-1" />
                  <div className="position-absolute top-50 start-50 translate-middle mt-1">
                    <h6 className="position-relative bg-white px-2 text-nowrap">THREAD CLOSED</h6>
                  </div>
                </div>
              </>
          }
        </div>
        {/* COMMENTS */}
        <div className="col-md-3">
          <div className="border rounded mx-md-0 mx-2">
            <h6 className="p-3 mb-0 bg-light rounded-top">Comment(s) on this Thread:</h6>
            <div className="overflow-auto overflow-x-hidden p-2 pt-0" id="comments-box" style={{ maxHeight: 280 }}>
              {
                comments && comments.length? <>
                  {
                    comments.map((comment) => {
                      return <div key={comment.id} className="border-top px-2 pt-2">
                        <div className="d-flex flex-wrap justify-content-between">
                          <p className="mb-0 small fw-bold">
                            @{userDetail(comment.author).username}
                          </p>
                          <p className="mb-0 small text-secondary text-end">
                            {datetimeFormat(comment.time)}
                          </p>
                        </div>
                        <p className="mb-2">{comment.contents}</p>
                      </div>
                    })
                  }
                </> : <>
                  <p className="text-center pt-4 pb-3">No Comment yet...</p>
                </>
              }
            </div>
            <div className="p-2 bg-light rounded-bottom">
              <form className="row m-1 gap-2" onSubmit={postingComment}>
                <input 
                  type="text" 
                  name="comment-box" 
                  id="comment-box" 
                  className="form-control col" 
                  maxLength={100}
                  autoComplete="off"
                  placeholder="Type comment..."
                  value={commentBox}
                  onChange={(e) => setCommentBox(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-success pt-0 pb-1 col-auto" disabled={commentBox.trim()==""}>
                  <IoSend size={19}/>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </> : <BlankPage />
  )
}

export default DetailThread;