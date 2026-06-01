const f = "Arial, sans-serif";

export default function Buscar() {
  return (
    <>
      {/* BOTÓN LUPA — pégalo en el navbar */}
      <i
        className="bi bi-search"
        style={{ cursor: "pointer", fontSize: "1.2rem", color: "#2a2a2a" }}
        data-bs-toggle="offcanvas"
        data-bs-target="#panelBuscar"
        aria-controls="panelBuscar"
      />

      {/* PANEL OFFCANVAS — se desliza desde la derecha */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="panelBuscar"
        aria-labelledby="panelBuscarLabel"
        style={{ width: "320px", background: "#fff" }}
      >
        {/* HEADER: campo de texto + botón X */}
        <div
          className="offcanvas-header border-0 pb-0"
          style={{ alignItems: "flex-start" }}
        >
          <input
            type="text"
            className="form-control border-0 shadow-none p-0"
            id="panelBuscarLabel"
            placeholder="ropa"
            style={{
              fontFamily: f,
              fontSize: "0.85rem",
              color: "#2a2a2a",
              letterSpacing: "0.05em",
              background: "transparent",
            }}
          />
          {/* Botón X nativo de Bootstrap */}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Cerrar"
            style={{ fontSize: "0.65rem" }}
          />
        </div>

        {/* CUERPO: separador + label BUSCAR + ícono lupa */}
        <div className="offcanvas-body pt-2">
          <div className="d-flex align-items-center gap-2">
            <span
              style={{
                fontFamily: f,
                fontSize: "0.78rem",
                letterSpacing: "0.18em",
                color: "#2a2a2a",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              BUSCAR
            </span>
            <hr className="flex-grow-1 my-0" style={{ borderColor: "#2a2a2a", opacity: 1 }} />
            <i className="bi bi-search" style={{ fontSize: "0.85rem", color: "#2a2a2a" }} />
          </div>
        </div>
      </div>
    </>
  );
}