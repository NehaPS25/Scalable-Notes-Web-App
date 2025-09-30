import React, { useState } from "react";
import { register } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await register({ name, email, password });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      nav("/dashboard"); // redirect after register
    } catch (error) {
      if (error.response) {
        setErr(error.response.data.msg || "Registration failed");
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
            <h2 className="mb-4 text-center">Register</h2>
            {err && <div className="alert alert-danger">{err}</div>}
            <form onSubmit={submit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input type="text" id="name" className="form-control" value={name} onChange={e=>setName(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" id="email" className="form-control" value={email} onChange={e=>setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password (6+ chars)</label>
                <input type="password" id="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-success w-100">Create Account</button>
            </form>
            <div className="mt-3 text-center">
              Already have an account? <Link to="/login" className="text-primary">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
