import { useState } from "react";

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function Contact() {
  const [form, setForm] = useState({ nombre: "", correo: "", mensaje: "" });
  const [errors, setErrors] = useState({});
  const [ok, setOk] = useState(false);

  const onChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    setOk(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const e2 = {};
    if (!form.nombre.trim()) e2.nombre = "El nombre es obligatorio.";
    if (!form.correo.trim()) e2.correo = "El correo es obligatorio.";
    else if (!emailOk(form.correo)) e2.correo = "Formato de correo inválido.";
    if (!form.mensaje.trim()) e2.mensaje = "El mensaje es obligatorio.";
    setErrors(e2);
    if (Object.keys(e2).length) return;
    setOk(true); // simulado
  };

  return (
    <div className="container py-4">
      <h1 className="h4 mb-3">Contacto</h1>
      <form onSubmit={onSubmit} noValidate className="card p-3 shadow-sm" data-testid="contact-form">
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input id="nombre" name="nombre" className={`form-control ${errors.nombre ? "is-invalid" : ""}`} value={form.nombre} onChange={onChange} />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="correo" className="form-label">Correo</label>
          <input id="correo" name="correo" type="email" className={`form-control ${errors.correo ? "is-invalid" : ""}`} value={form.correo} onChange={onChange} />
          {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="mensaje" className="form-label">Mensaje</label>
          <textarea id="mensaje" name="mensaje" rows={4} className={`form-control ${errors.mensaje ? "is-invalid" : ""}`} value={form.mensaje} onChange={onChange} />
          {errors.mensaje && <div className="invalid-feedback">{errors.mensaje}</div>}
        </div>

        <button className="btn btn-primary" type="submit">Enviar</button>
        {ok && <div role="status" className="alert alert-success mt-3 mb-0">¡Mensaje enviado correctamente!</div>}
      </form>
    </div>
  );
}
