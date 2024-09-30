import { Avatar } from "@mui/material";

import { datetimeFormat } from "../../utils/format";

import ProfilePicture from "./Profpic";
import CodeSnippet from "./Snippet";

const ReplyCard = ({ data }) => {
  return <>
    {/* THREAD */}
    <div className="card mb-2">
      <div className="card-header">
        <div className="row m-0 mt-1 gap-2 align-items-start">
          <div className="col-auto p-0">
            <Avatar
              role="button"
              className="ratio ratio-1x1 bg-danger"
            >
              <ProfilePicture data={data.author} />
            </Avatar>
          </div>
          <div className="col-auto p-0">
            <h6 className="card-title mb-0">
              {data.author.realname}
              <span className="small text-secondary"> (@{data.author.username})</span>
            </h6>
            {/* <p className="card-title mb-0 small text-secondary"></p> */}
            <p className="small mt-1 mb-0 text-nowrap"><span className="text-secondary me-1">Reply on</span> {datetimeFormat(data.time, "DD MMMM yyyy HH:mm")}</p>
          </div>
        </div>
      </div>
      <div className="card-body pb-2">
        <div
          className="card-text"
          dangerouslySetInnerHTML={{ __html: data.contents }}
        />
        {/* SNIPPET */}
        {
          data.snippets.length? <>
            <CodeSnippet filename={data.snippets[0].filename} type={data.snippets[0].type} code={data.snippets[0].code} />
          </> : <></>
        }
      </div>
    </div>
  </>
}

export default ReplyCard;