import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

// === FORMULARIO PÚBLICO ===
function PublicForm() {
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow border-0">
          <div className="card-body p-5">
            <h2 className="text-primary fw-bold mb-3">Contáctanos</h2>
            <p className="text-muted mb-4">Déjanos tu mensaje y te responderemos al correo.</p>
            {sent ? (
              <div className="alert alert-success py-4 text-center">
                <i className="bi bi-check-circle-fill fs-1 d-block mb-3"></i>
                <h5 className="fw-bold">¡Mensaje Enviado!</h5>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3"><label className="form-label fw-bold">Nombre</label><input type="text" className="form-control" required /></div>
                <div className="mb-3"><label className="form-label fw-bold">Correo</label><input type="email" className="form-control" required /></div>
                <div className="mb-4"><label className="form-label fw-bold">Mensaje</label><textarea className="form-control" rows="4" required></textarea></div>
                <button type="submit" className="btn btn-primary w-100 fw-bold">Enviar</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// === INTERFAZ DE CHAT REAL ===
function ChatInterface() {
  const { username, isAdmin, isTecnico, isCliente } = useAuth();
  
  // Normalizamos ID (email)
  const myId = username; 

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]); 
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  // 1. CARGAR CONTACTOS
  useEffect(() => {
    async function loadContacts() {
      try {
        setLoading(true);
        let list = [];

        // Admin por defecto
        const contactAdmin = { chatId: "admin", nombre: "Soporte Central", rol: "ADMIN", avatar: "", online: true };
        if (!isAdmin) list.push(contactAdmin);

        if (isAdmin) {
          // Admin ve a todos
          const [resTec, resCli] = await Promise.all([api.get("/tecnicos"), api.get("/clientes")]);
          const tecnicos = resTec.data.map(t => ({ chatId: t.email, nombre: `${t.nombre} ${t.apellido}`, rol: "Técnico", avatar: t.foto }));
          const clientes = resCli.data.map(c => ({ chatId: c.email, nombre: `${c.nombre} ${c.apellido}`, rol: "Cliente" }));
          list = [...tecnicos, ...clientes];
          
          // Agregar usuarios Demo si no existen
          if(!list.find(u => u.chatId === 'tecnico1')) list.unshift({chatId:'tecnico1', nombre:'Técnico Demo', rol:'Técnico'});
          if(!list.find(u => u.chatId === 'cliente1')) list.unshift({chatId:'cliente1', nombre:'Cliente Demo', rol:'Cliente'});

        } else {
            // Clientes/Técnicos ven sus servicios
            const resServicios = await api.get("/servicios");
            const misServicios = resServicios.data.filter(s => {
                // Lógica flexible para coincidir emails reales o usuarios demo
                const cEmail = s.cliente?.email;
                const tEmail = s.tecnico?.email;
                const soyYo = (cEmail === myId) || (tEmail === myId) || 
                              (myId === 'tecnico1' && tEmail === 'carlos.perez@reparafacil.com') ||
                              (myId === 'cliente1' && cEmail === 'cliente.garantia@test.com');
                return soyYo;
            });

            const contactsMap = new Map();
            misServicios.forEach(s => {
                if (isCliente && s.tecnico) {
                    let tid = s.tecnico.email; 
                    if(tid === 'carlos.perez@reparafacil.com') tid = 'tecnico1'; // Mapeo demo
                    contactsMap.set(tid, { chatId: tid, nombre: `${s.tecnico.nombre} ${s.tecnico.apellido}`, rol: "Técnico", avatar: s.tecnico.foto });
                }
                if (isTecnico && s.cliente) {
                    let cid = s.cliente.email;
                    if(cid === 'cliente.garantia@test.com') cid = 'cliente1'; // Mapeo demo
                    contactsMap.set(cid, { chatId: cid, nombre: `${s.cliente.nombre} ${s.cliente.apellido}`, rol: "Cliente" });
                }
            });
            list = [...list, ...Array.from(contactsMap.values())];
        }

        setContacts(list);
        if (list.length > 0 && !selectedContact) setSelectedContact(list[0]);
      } catch (error) { console.error("Error contacts", error); } 
      finally { setLoading(false); }
    }
    loadContacts();
  }, [isAdmin, isCliente, isTecnico, myId]);

  // 2. POLLING DE MENSAJES (Cada 2 segundos consulta al backend real)
  useEffect(() => {
    let interval;
    const fetchMessages = async () => {
      if (!selectedContact) return;
      try {
        // LLAMADA AL BACKEND REAL
        const res = await api.get(`/mensajes/chat/${selectedContact.chatId}`);
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };

    if (selectedContact) {
      fetchMessages(); // Carga inmediata
      interval = setInterval(fetchMessages, 2000); // Recarga automática
    }
    return () => clearInterval(interval);
  }, [selectedContact]);

  // 3. SCROLL
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // 4. ENVIAR MENSAJE (REAL)
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !selectedContact) return;

    try {
        // ENVIAR AL BACKEND
        await api.post("/mensajes", {
            destinatario: selectedContact.chatId,
            contenido: inputMsg
        });
        
        // Limpiar input y recargar mensajes para ver el nuevo
        setInputMsg("");
        const res = await api.get(`/mensajes/chat/${selectedContact.chatId}`);
        setMessages(res.data);

    } catch (error) {
        alert("Error al enviar mensaje. Revisa la consola.");
        console.error(error);
    }
  };

  if (loading) return <div className="text-center py-5">Cargando chat...</div>;

  return (
    <div className="card shadow border-0 overflow-hidden" style={{ height: "75vh" }}>
      <div className="row g-0 h-100">
        {/* SIDEBAR */}
        <div className="col-md-4 col-lg-3 border-end bg-light d-flex flex-column">
          <div className="p-3 border-bottom bg-white"><h6 className="mb-0 fw-bold text-primary">Chat | {myId}</h6></div>
          <div className="flex-grow-1 overflow-auto">
            {contacts.map(c => (
              <button key={c.chatId} onClick={() => setSelectedContact(c)}
                className={`list-group-item list-group-item-action border-0 py-3 ${selectedContact?.chatId === c.chatId ? 'bg-white border-start border-4 border-primary' : ''}`}>
                <div className="fw-bold">{c.nombre}</div>
                <div className="small text-muted">{c.rol}</div>
              </button>
            ))}
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="col-md-8 col-lg-9 d-flex flex-column bg-white">
          {selectedContact ? (
            <>
              <div className="p-3 border-bottom bg-light fw-bold">{selectedContact.nombre} <span className="badge bg-secondary ms-2">{selectedContact.rol}</span></div>
              
              <div className="flex-grow-1 p-4 overflow-auto" style={{backgroundColor: "#eef2f5"}} ref={scrollRef}>
                {messages.length === 0 && <p className="text-center text-muted mt-5">No hay mensajes aún.</p>}
                {messages.map((msg) => {
                  const isMe = msg.remite === myId; // Comparamos con backend 'remite'
                  return (
                    <div key={msg.id} className={`d-flex mb-3 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                      <div className={`px-4 py-2 shadow-sm ${isMe ? 'bg-primary text-white' : 'bg-white text-dark border'}`} 
                           style={{maxWidth: "75%", borderRadius: "20px", borderBottomRightRadius: isMe?0:20, borderBottomLeftRadius: isMe?20:0}}>
                        <div>{msg.contenido}</div>
                        <div className={`text-end mt-1 ${isMe ? 'text-white-50' : 'text-muted'}`} style={{fontSize: "0.65rem"}}>
                            {msg.fecha ? new Date(msg.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 border-top bg-white">
                <form onSubmit={handleSend} className="d-flex gap-2">
                  <input type="text" className="form-control form-control-lg bg-light border-0" placeholder="Escribe..." value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} autoFocus />
                  <button type="submit" className="btn btn-primary btn-lg px-4 fw-bold d-flex align-items-center shadow-sm">
                    <span>Enviar</span> <i className="bi bi-send-fill ms-2"></i>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-100 d-flex align-items-center justify-content-center text-muted">Selecciona un contacto</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  const { isAuthenticated } = useAuth();
  return <div className="container py-5">{isAuthenticated ? <ChatInterface /> : <PublicForm />}</div>;
}