import React from 'react'
import { Link } from "react-router-dom";
import Buscar from "./Buscar";
import "../Comic.css";
import fondodesierto1 from "../assets/fondodesierto1.jpg";

const f = "Arial, sans-serif";

const Comic = () => {
  return (
    <div className="min-vh-100 w-100 fondo-desierto">

      {/* HEADER */}
      <nav className="navbar navbar-expand-lg px-5" style={{ background: "#c8a870" }}>
        <Link to="/" className="navbar-brand me-5">
          <img src="/logo-piktara.png" alt="Piktara" style={{ height: "55px" }} />
        </Link>

        <Link
          to="/nuestro-comic"
          className="d-flex align-items-center text-decoration-none ms-auto"
          style={{ fontFamily: f, fontSize: "0.8rem", letterSpacing: "0.12em", color: "#2a2a2a", textTransform: "uppercase" }}
        >
          <i className="bi bi-arrow-left me-2" style={{ fontSize: "1.1rem" }}></i>
          Volver
        </Link>
      </nav>

    </div>
  )
}

export default Comic