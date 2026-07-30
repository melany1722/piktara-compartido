import React, { useState, useEffect } from "react";

const fDisplay = "'Baloo 2', 'Comic Sans MS', sans-serif";

const palette = {
  morado: "#5A189A",
  amarillo: "#FFC300",
  crema: "#FFF8E7",
  borde: "#3A2312",
};

export default function IniciarSeccion() {
  const [esRegistro, setEsRegistro] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const actualizarEstadoUsuario = () => {
    const sesionGuardada = localStorage.getItem("piktara_user");
    if (sesionGuardada) {
      setUsuarioLogueado(JSON.parse(sesionGuardada));
    } else {
      setUsuarioLogueado(null);
    }
  };

  useEffect(() => {
    actualizarEstadoUsuario();
    // Escuchar cambios de sesión en la aplicación
    window.addEventListener("piktara_auth_change", actualizarEstadoUsuario);
    return () => window.removeEventListener("piktara_auth_change", actualizarEstadoUsuario);
  }, []);

  const notificarCambioAuth = () => {
    window.dispatchEvent(new Event("piktara_auth_change"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensaje("");

    if (!email || !password || (esRegistro && !nombre)) {
      setMensaje("⚠️ Completa todos los campos obligatorios.");
      return;
    }

    const usuario = {
      nombre: esRegistro ? nombre : email.split("@")[0],
      email: email,
    };

    localStorage.setItem("piktara_user", JSON.stringify(usuario));
    setUsuarioLogueado(usuario);
    notificarCambioAuth();
    setMensaje("🎉 ¡Bienvenido a Piktara!");
  };

  const cerrarSesion = () => {
    localStorage.removeItem("piktara_user");
    setUsuarioLogueado(null);
    setEmail("");
    setPassword("");
    setNombre("");
    notificarCambioAuth();
  };

  return (
    <>
      <style>{`
        .offcanvas.show .piktara-login-card {
          animation: comicPopInLogin 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes comicPopInLogin {
          0% { transform: scale(0.88) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        .input-piktara-login:focus {
          background-color: #fff !important;
          border-color: ${palette.morado} !important;
          box-shadow: 0 5px 0 ${palette.morado} !important;
          outline: none;
        }

        .btn-login-piktara {
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .btn-login-piktara:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 7px 0 ${palette.borde} !important;
        }

        .btn-close-piktara {
          transition: transform 0.2s ease, background-color 0.2s ease;
        }
        .btn-close-piktara:hover {
          transform: rotate(90deg) scale(1.15);
          background-color: ${palette.amarillo} !important;
          color: ${palette.morado} !important;
        }
      `}</style>

      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="panelLogin"
        aria-labelledby="panelLoginLabel"
        style={{
          width: "380px",
          background: palette.crema,
          borderLeft: `6px solid ${palette.morado}`,
          boxShadow: `-10px 0 30px rgba(58, 35, 18, 0.15)`,
        }}
      >
        <div className="piktara-login-card h-100 d-flex flex-column">
          {/* Cabecera */}
          <div className="offcanvas-header px-4 pt-4 pb-2 justify-content-between align-items-center">
            <div
              style={{
                background: palette.amarillo,
                border: `3.5px solid ${palette.borde}`,
                borderRadius: "16px",
                padding: "6px 22px",
                boxShadow: `0 4px 0 ${palette.borde}`,
              }}
            >
              <h5
                id="panelLoginLabel"
                style={{
                  fontFamily: fDisplay,
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  color: palette.morado,
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                {usuarioLogueado ? "👤 Cuenta Activa" : esRegistro ? "📝 Crear Cuenta" : "⚡ ¡Ingresar!"}
              </h5>
            </div>

            <button
              type="button"
              className="btn-close-piktara d-flex align-items-center justify-content-center"
              data-bs-dismiss="offcanvas"
              aria-label="Cerrar"
              style={{
                width: "36px",
                height: "36px",
                background: palette.morado,
                color: palette.crema,
                borderRadius: "50%",
                border: `3px solid ${palette.borde}`,
                boxShadow: `0 3px 0 ${palette.borde}`,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {/* Cuerpo */}
          <div className="offcanvas-body pt-3 px-4 d-flex flex-column align-items-center gap-3">
            {usuarioLogueado ? (
              /* VISTA: USUARIO CON SESIÓN INICIADA */
              <div
                className="w-100 text-center p-4 mt-2"
                style={{
                  background: "#fff",
                  border: `3.5px solid ${palette.borde}`,
                  borderRadius: "20px",
                  boxShadow: `0 6px 0 ${palette.borde}`,
                }}
              >
                <div className="position-relative d-inline-block mb-3">
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: palette.amarillo,
                      border: `3.5px solid ${palette.borde}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: fDisplay,
                      fontSize: "2.2rem",
                      fontWeight: 800,
                      color: palette.morado,
                      boxShadow: `0 4px 0 ${palette.borde}`,
                    }}
                  >
                    {usuarioLogueado.nombre.charAt(0).toUpperCase()}
                  </div>
                  {/* Badge verde de En Línea */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: "2px",
                      right: "2px",
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#2ec4b6",
                      border: `2.5px solid ${palette.borde}`,
                      borderRadius: "50%",
                    }}
                  />
                </div>

                <h4 style={{ fontFamily: fDisplay, fontWeight: 800, color: palette.morado, margin: 0 }}>
                  ¡Hola, {usuarioLogueado.nombre}!
                </h4>
                <p style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, color: palette.borde, fontSize: "0.85rem", marginTop: "4px" }}>
                  {usuarioLogueado.email}
                </p>

                <div
                  className="mt-3 p-2"
                  style={{
                    background: palette.crema,
                    border: `2px solid ${palette.borde}`,
                    borderRadius: "12px",
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: palette.morado,
                  }}
                >
                  ✨ Tu progreso en los cómics está guardado
                </div>

                <button
                  onClick={cerrarSesion}
                  className="btn btn-login-piktara w-100 mt-4"
                  style={{
                    padding: "10px",
                    borderRadius: "14px",
                    border: `3px solid ${palette.borde}`,
                    background: "#e63946",
                    fontFamily: fDisplay,
                    fontSize: "0.95rem",
                    color: "#fff",
                    fontWeight: 800,
                    boxShadow: `0 4px 0 ${palette.borde}`,
                    textTransform: "uppercase",
                  }}
                >
                  🚪 Cerrar Sesión
                </button>
              </div>
            ) : (
              /* VISTA: FORMULARIO LOGIN / REGISTRO */
              <form onSubmit={handleSubmit} className="w-100 d-flex flex-column gap-3">
                {mensaje && (
                  <div
                    style={{
                      background: palette.amarillo,
                      border: `2.5px solid ${palette.borde}`,
                      borderRadius: "12px",
                      padding: "8px",
                      fontFamily: "'Quicksand', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      color: palette.borde,
                      textAlign: "center",
                    }}
                  >
                    {mensaje}
                  </div>
                )}

                {esRegistro && (
                  <div>
                    <label style={{ fontFamily: fDisplay, fontSize: "0.85rem", fontWeight: 800, color: palette.morado, textTransform: "uppercase" }}>
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      className="form-control input-piktara-login"
                      placeholder="Tu Nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "14px",
                        border: `3px solid ${palette.borde}`,
                        background: "#fff",
                        fontFamily: "'Quicksand', sans-serif",
                        fontWeight: 700,
                      }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ fontFamily: fDisplay, fontSize: "0.85rem", fontWeight: 800, color: palette.morado, textTransform: "uppercase" }}>
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control input-piktara-login"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "14px",
                      border: `3px solid ${palette.borde}`,
                      background: "#fff",
                      fontFamily: "'Quicksand', sans-serif",
                      fontWeight: 700,
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: fDisplay, fontSize: "0.85rem", fontWeight: 800, color: palette.morado, textTransform: "uppercase" }}>
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control input-piktara-login"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "14px",
                      border: `3px solid ${palette.borde}`,
                      background: "#fff",
                      fontFamily: "'Quicksand', sans-serif",
                      fontWeight: 700,
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-login-piktara w-100 mt-2"
                  style={{
                    padding: "12px",
                    borderRadius: "16px",
                    border: `3.5px solid ${palette.borde}`,
                    background: palette.amarillo,
                    fontFamily: fDisplay,
                    fontSize: "1rem",
                    color: palette.morado,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    boxShadow: `0 5px 0 ${palette.borde}`,
                  }}
                >
                  {esRegistro ? "🚀 Crear Mi Cuenta" : "🔑 Ingresar"}
                </button>

                <div className="text-center mt-2">
                  <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "0.85rem", fontWeight: 700, color: palette.borde }}>
                    {esRegistro ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
                  </span>{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setEsRegistro(!esRegistro);
                      setMensaje("");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      fontFamily: fDisplay,
                      fontSize: "0.9rem",
                      fontWeight: 800,
                      color: palette.morado,
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    {esRegistro ? "Inicia Sesión" : "Regístrate aquí"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}