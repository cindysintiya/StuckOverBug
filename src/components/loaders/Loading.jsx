import { baseUrl } from "../../utils/format";

const Loading = () => {
  return <div className="vh-100 d-flex flex-column justify-content-center align-items-center">
    <img src={`${baseUrl}/assets/loading-bug.gif`} alt="Loading..." className="img-fluid w-25 mb-0" />
    <h5>Loading... Please Wait!</h5>
  </div>
}

export default Loading;