import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../contexts/AuthProvider";

import { CodeBlock } from "react-code-block";
import { FaCode } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";

import Swal from "sweetalert2";
import { closeThread, findThread } from "../utils/DataThreads";
import { getComments, postComment } from "../utils/DataComments";
import { emptyComment, emptyThread } from "../utils/format";

import ReplyBox from "../components/modals/ReplyBox";
import ReplyCard from "../components/cards/Reply";
import CommentCard from "../components/cards/Comment";
import ThreadDetailCard from "../components/cards/ThreadDetail";
import Loading from "../components/loaders/Loading";

const DetailThread = () => {
  const id = useParams().id;

  const [thread, setThread] = useState();
  const [replies, setReplies] = useState();
  const [comments, setComments] = useState();

  const [commentBox, setCommentBox] = useState("");

  const { loginData, isLogin } = useContext(AuthContext);

  const addReply = (reply) => {
    setReplies([reply, ...replies]);
  }

  const postingComment = (e) => {
    e.preventDefault();
    if (isLogin) {
      const data = {
        author: loginData,
        ref: id,
        contents: commentBox,
      }

      postComment(data)
        .then((res) => {
          setComments([res.data.value, ...comments]);
          setCommentBox("");
          document.getElementById("comments-box").scrollTo({ top: 0, behavior: "smooth" });
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: "Can't post your comment.",
          })
        });
    }
  }

  const closingThread = () => {
    Swal.fire({
      icon: "question",
      title: "Mark as Closed",
      text: "Are you sure wanna close this thread? You will no longer receive any reply after closing this.",
      showCancelButton: true,
      confirmButtonText: "Yes, Close Thread",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.showLoading();
        closeThread(id)
          .then((res) => {
            setThread({ ...thread, status: res.data.value.status });
          })
      }
    })
  }

  useEffect(() => {
    findThread(id)
      .then((res) => {
        setThread(res.data.thread);
        setReplies(res.data.replies);
        getComments(id)
          .then((comments) => {
            setComments(comments.data.value);
          })
          .catch((err) => {
            setComments(emptyComment);
          });
      })
      .catch((err) => {
        setThread(emptyThread);
        setReplies(emptyThread);
      });
  }, []);

  return (
    thread? <>
      <div className="row mx-0 my-3">
        <div className="col-md-7 offset-md-1">
          {/* THREAD */}
          <ThreadDetailCard data={thread} />
          
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
            <div className="col-auto" title={isLogin? "" : "Please Login for Replying this Thread."}>
              {
                isLogin && thread.status>0? 
                  loginData._id == thread.author._id? <>
                    {/* owner */}
                    <button className="btn btn-success pt-1 shadow-sm me-2" data-bs-toggle="modal" data-bs-target="#replyModal">
                      + Reply
                    </button>
                    <button className="btn btn-danger pt-1 shadow-sm" onClick={closingThread}>
                      × Mark as Closed
                    </button>
                  </> : <>
                    {/* user */}
                    <button className="btn btn-success pt-1 shadow-sm" data-bs-toggle="modal" data-bs-target="#replyModal">
                      + New Reply
                    </button>
                  </> : <>
                    {/* unauthorized/ closed */}
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
                      <ReplyCard data={reply} />
                    </div>
                  })
                }
              </div>
            </> : <>
              <p className="text-center pt-4 pb-3">No Reply yet...</p>
            </>
          }
          {
            isLogin && thread.status>0? 
              <ReplyBox refId={id} addReply={addReply}/>
                : thread.status? <></> : <>
                  <div className="position-relative" title="This thread is no longer receiving any Answer.">
                    <hr className="border-warning border-3 mt-2 mb-0" />
                    <hr className="border-warning border-3 my-1" />
                    <div className="position-absolute top-50 start-50 translate-middle mt-1">
                      <h6 className="position-relative bg-white px-2 text-nowrap">THREAD CLOSED</h6>
                    </div>
                  </div>
                  <p className="text-center mt-2 mb-4 mb-sm-2 text-secondary">
                    <span className="fw-semibold">@{thread.author.username}</span> has marked their thread as Closed. This thread was no longer receiving Answer.
                  </p>
                </>
          }
        </div>
        {/* COMMENTS */}
        <div className="col-md-3">
          <div className="border rounded mx-md-0 mx-2">
            <h6 className="p-3 mb-0 bg-light rounded-top">Comment(s) on this Thread:</h6>
            <div className="overflow-auto overflow-x-hidden p-2 pt-0" id="comments-box" style={{ maxHeight: 280 }}>
              {
                comments?
                  comments.length? <>
                  {
                    comments.map((comment) => {
                      return <div key={comment._id} className="border-top px-2 pt-2">
                        <CommentCard data={comment} />
                      </div>
                    })
                  }
                </> : <>
                  <p className="text-center pt-5 pb-3">No Comment yet...</p>
                </> : <>
                  <p className="text-center pt-5 pb-3">Getting Comment(s)...</p>
                </>
              }
            </div>
            <div className="p-2 bg-light rounded-bottom">
              <form className="row m-1 gap-2" onSubmit={postingComment} title={isLogin? "" : "Please Login for leaving Comment."}>
                <input 
                  type="text" 
                  name="comment-box" 
                  id="comment-box" 
                  className="form-control col" 
                  maxLength={100}
                  autoComplete="off"
                  placeholder="Type your comment..."
                  value={commentBox}
                  onChange={(e) => setCommentBox(e.target.value)}
                  required
                  disabled={!isLogin || thread.status<=0}
                />
                <button type="submit" className="btn btn-success pt-0 pb-1 col-auto" disabled={commentBox.trim()==""}>
                  <IoSend size={19}/>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </> : <Loading />
  )
}

export default DetailThread;