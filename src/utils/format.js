import moment from "moment";

export const baseUrl = "/StuckOverBug";

export const emptyUser = {
  id: -1,
  username: "Who?",
  password: "",
  profile: "https://i.pinimg.com/originals/8f/6d/5c/8f6d5c365c7c29d9dab1ad219ca8eb70.jpg",
  realname: "Who am I?",
  email: "who@m.i",
  active: 1,
}

export const emptyThread = {
  id: -1,
  type: "",     // [question, reply]
  ref: -1,      // question id
  author: emptyUser,   // author id
  contents: "", // html
  snippets: [], // list of filename, type, code
  status: -1,   // [3: Urgent banget (danger), 2: Nanya aja (warning), 1: Iseng doank (success/ primary), 0: Ditutup (secondary)]
  time: "",
}

export const emptyComment = {
  id: -1,
  author: emptyUser,
  ref: -1,
  contents: "",
  time: "",
}

export const datetimeFormat = (datetime, format = "DD/MM/YYYY HH:mm") => {
  return new Date(datetime).getTime()+(2*86400000) < new Date().getTime()
         ? moment(datetime).format(format)
         : moment(datetime).fromNow()
                        
}