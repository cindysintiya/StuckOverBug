import "./App.css";

import { Route, Routes } from "react-router-dom";

import PublicLayout from './layouts/PublicLayout';

import Welcome from './pages/Welcome';
import Home from "./pages/Home";
import Login from "./pages/Login";

const App = () => {
  return <>
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="/thread/:id">
          <Route index element={<Welcome />} />
        </Route>
        <Route path="/auth">
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
        </Route>
        {/* <Route path="/pathname">
          <Route index element={<Welcome />} />
        </Route> */}
      </Route>
    </Routes>
  </>
}

export default App
