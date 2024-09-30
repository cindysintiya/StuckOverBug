import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useAuth";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import Swal from "sweetalert2";
import { baseUrl } from "../utils/format";
import { postRegister } from "../utils/DataLogin";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); 
  const [realname, setRealname] = useState("");
  const [profile, setProfile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); 

  const nav = useNavigate();

  const register = useRegister();

  // const socket = io(apiNode, {
  //   autoConnect: false,
  // });

  const handleRegister = (e) => {
    e.preventDefault();
    const form = document.querySelector(".needs-validation");
    form.classList.add("was-validated");

    const data = {
      username,
      password,
      realname,
      profile,
      email,
    };
  
    if (form.checkValidity() === true) {
      if (password === confirmPassword) {
        // socket.connect();
  
        // socket.emit("postRegister", data).on("resRegister", (res) => {
        //   if (res.data) {
        //     register(res.data);

        //     Swal.fire({
        //       icon: "success",
        //       title: "Registration Success!",
        //       text: "You can now log in.",
        //       confirmButtonText: "LOGIN NOW",
        //     }).then(() => {
        //       nav(`${baseUrl}/auth/login`);
        //     });
        //   } else {
        //     Swal.fire({
        //       icon: "error",
        //       title: "Registration Failed!",
        //       text: res.message,
        //     });
        //   }
        // });

        // return () => {
        //   socket.off("resRegister");
        //   socket.disconnect();
        // };

        postRegister(data)
          .then((res) => {
            register(res.data.data);

            Swal.fire({
              icon: "success",
              title: "Registration Success!",
              text: "You can now log in.",
              confirmButtonText: "LOGIN NOW",
            }).then(() => {
              nav(`${baseUrl}/auth/login`);
            });
          }).catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Login Failed!",
              text: err.response?.data.message,
            });
          });
      } else {
        Swal.fire({
          icon: "error",
          title: "Password Mismatch!",
          text: "Make sure your passwords match.",
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Empty Field!",
        text: "Please fill in your Registration info.",
      });
    }
  };
  

  return (
    <>
      <div className="py-4 bg-dark">
        <div className="row row-gap-1 m-0">
          <div className="col-xl-8 offset-xl-2 col-md-10 offset-md-1">
            <div className="border rounded shadow mt-1 px-3 pb-3 bg-black">
              <div className="text-center pt-3">
                <NavLink to={`${baseUrl}/`} aria-current="page">
                  <img
                    src={`${baseUrl}/assets/img/Bug3.jpeg`}
                    className="img-fluid"
                    alt="logo"
                    style={{ maxWidth: "200px" }}
                  />
                </NavLink>
              </div>
              <div className="row g-0 m-0">
                <div className="col pt-4 pe-md-3">
                  <form
                    onSubmit={handleRegister}
                    className="needs-validation"
                    noValidate
                  >
                    <label htmlFor="real-name" className="fw-bold text-white mb-2">REAL NAME</label>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="real-name"
                        placeholder="John Doe"
                        required
                        value={realname}
                        onChange={(e) => setRealname(e.target.value)}
                      />
                      <div className="invalid-feedback">Please fill in this field</div>
                      <label htmlFor="real-name">Your Real Rame</label>
                    </div>

                    <label htmlFor="username" className="fw-bold text-white mb-2">USERNAME</label>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="my_sob_username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <div className="invalid-feedback">Please fill in this field</div>
                      <label htmlFor="username">ur_sob_username</label>
                    </div>

                    <label htmlFor="email" className="fw-bold text-white mb-2">EMAIL</label>
                    <div className="form-floating mb-3">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="your@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <div className="invalid-feedback">Please enter a valid email address</div>
                      <label htmlFor="email">your@email.com</label>
                    </div>

                    <label htmlFor="profile-link" className="fw-bold text-white mb-2">PROFILE PICTURE LINK</label>
                    <div className="form-floating mb-3">
                      <input
                        type="url"
                        className="form-control"
                        id="profile-link"
                        placeholder="https://link.profile-picture.com"
                        value={profile}
                        onChange={(e) => setProfile(e.target.value)}
                      />
                      <div className="invalid-feedback">Please enter a valid URL</div>
                      <label htmlFor="profile-link">https://link.profile-picture.com</label>
                    </div>

                    <label htmlFor="password" className="fw-bold text-white mb-2">PASSWORD</label>
                    <div className="d-flex align-items-center">
                      <div className="container-fluid ps-0 form-floating">
                        <input
                          type={passwordVisible ? "text" : "password"}
                          className="form-control"
                          id="password"
                          placeholder="pass***d"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="invalid-feedback">Please fill in this field</div>
                        <label htmlFor="password">pass***d</label>
                      </div>
                      <span
                        className="text-white"
                        role="button"
                        title={passwordVisible ? "Hide" : "Show"}
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        {passwordVisible ? <FaRegEye size={25} /> : <FaRegEyeSlash size={25} />}
                      </span>
                    </div>

                    <label htmlFor="confirm-password" className="fw-bold text-white mb-2 mt-3">CONFIRM PASSWORD</label>
                    <div className="d-flex align-items-center mb-3">
                      <div className="form-floating flex-grow-1">
                        <input
                          type={confirmPasswordVisible ? "text" : "password"}
                          className="form-control"
                          id="confirm-password"
                          placeholder="pass***d"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <div className="invalid-feedback">Please fill in this field</div>
                        <label htmlFor="confirm-password">pass***d</label>
                      </div>
                      <span
                        className="text-white ms-2"
                        role="button"
                        title={confirmPasswordVisible ? "Hide" : "Show"}
                        onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      >
                        {confirmPasswordVisible ? <FaRegEye size={25} /> : <FaRegEyeSlash size={25} />}
                      </span>
                    </div>

                    <div className="text-end mt-4">
                      <div className="d-grid gap-3">
                        <button className="btn btn-outline-info btn-light text-dark" type="submit">REGISTER</button>
                        <NavLink to={`${baseUrl}/auth/login`} className="btn btn-outline-warning btn-light text-dark">
                          Already have an account? Sign In
                        </NavLink>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;