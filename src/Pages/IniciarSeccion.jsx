const f = "Arial, sans-serif";

export default function IniciarSeccion() {
  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="panelLogin"
      aria-labelledby="panelLoginLabel"
      style={{ width: "360px", background: "#fff" }}
    >
      <div className="offcanvas-header border-0 pb-0 justify-content-end">
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar" style={{ fontSize: "0.65rem" }} />
      </div>
      <div className="offcanvas-body pt-0 d-flex flex-column align-items-center gap-3 px-4">
        <h5 style={{ fontFamily: f, fontWeight: 600, letterSpacing: "0.08em", color: "#2a2a2a" }}>Ingresar</h5>
        <input type="email" placeholder="CORREO ELECTRONICO" style={{ width: "100%", padding: "14px 20px", borderRadius: "30px", border: "none", background: "#c8a870", fontFamily: f, fontSize: "0.75rem", letterSpacing: "0.12em", color: "#2a2a2a", outline: "none" }} />
        <input type="password" placeholder="CONTRASEÑA" style={{ width: "100%", padding: "14px 20px", borderRadius: "30px", border: "none", background: "#c8a870", fontFamily: f, fontSize: "0.75rem", letterSpacing: "0.12em", color: "#2a2a2a", outline: "none" }} />
        <div style={{ width: "100%", textAlign: "right" }}>
          <a href="#" style={{ fontFamily: f, fontSize: "0.72rem", color: "#2a2a2a", textDecoration: "none" }}>¿Olvidó su contraseña?</a>
        </div>
        <button style={{ width: "100%", padding: "14px 20px", borderRadius: "30px", border: "none", background: "#e8a830", fontFamily: f, fontSize: "0.78rem", letterSpacing: "0.15em", color: "#fff", fontWeight: 600, cursor: "pointer", textTransform: "uppercase" }}>
          REGISTRARSE
        </button>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <a href="#" style={{ fontFamily: f, fontSize: "0.72rem", color: "#2a2a2a", textDecoration: "underline" }}>Crear cuenta</a>
        </div>
      </div>
    </div>
  );
}