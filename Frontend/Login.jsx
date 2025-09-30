import React, { useState } from "react";
import { login } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await login({ email, password });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      nav("/dashboard"); // redirect after login
    } catch (error) {
      if (error.response) {
        setErr(error.response.data.msg || "Login failed");
      } else {
        setErr("Server not reachable");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow">
            <h2 className="mb-4 text-center">Login</h2>
            {err && <div className="alert alert-danger">{err}</div>}
            <form onSubmit={submit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" id="email" className="form-control" value={email} onChange={e=>setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" id="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
            <div className="mt-3 text-center">
              No account? <Link to="/register" className="text-primary">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
