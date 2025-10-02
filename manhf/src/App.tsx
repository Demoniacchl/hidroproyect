import { useState } from 'react'
import './App.css'

// Simulación de usuarios - después conectaremos con el backend
const USUARIOS = {
  admin: { usuario: 'admin', password: 'password', rol: 'ADMIN', nombre: 'Administrador General' },
  tecnico: { usuario: 'tecnico', password: 'password', rol: 'TECNICO', nombre: 'Juan Pérez' }
}

// Componente Login
function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [credenciales, setCredenciales] = useState({ usuario: '', password: '' })
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const usuario = USUARIOS[credenciales.usuario as keyof typeof USUARIOS]
    
    if (usuario && usuario.password === credenciales.password) {
      onLogin(usuario)
    } else {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>🔧 Sistema de Mantenciones</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Usuario:</label>
            <input 
              type="text" 
              value={credenciales.usuario}
              onChange={(e) => setCredenciales({...credenciales, usuario: e.target.value})}
              placeholder="admin o tecnico"
              required
            />
          </div>
          
          <div className="input-group">
            <label>Contraseña:</label>
            <input 
              type="password" 
              value={credenciales.password}
              onChange={(e) => setCredenciales({...credenciales, password: e.target.value})}
              placeholder="password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">Ingresar al Sistema</button>
        </form>

        <div className="demo-credentials">
          <h3>Credenciales de Demo:</h3>
          <p><strong>Admin:</strong> admin / password</p>
          <p><strong>Técnico:</strong> tecnico / password</p>
        </div>
      </div>
    </div>
  )
}

// Componente Dashboard
function Dashboard({ usuario }: { usuario: any }) {
  const [vistaActual, setVistaActual] = useState('dashboard')

  const handleLogout = () => {
    window.location.reload() // Simulación de logout
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🏢 Sistema de Gestión de Mantenciones</h1>
        <div className="user-info">
          <span>Bienvenido, {usuario.nombre}</span>
          <span className="user-role">({usuario.rol})</span>
          <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={vistaActual === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setVistaActual('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={vistaActual === 'clientes' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setVistaActual('clientes')}
        >
          👥 Clientes
        </button>
        <button 
          className={vistaActual === 'calendario' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setVistaActual('calendario')}
        >
          📅 Calendario
        </button>
        <button 
          className={vistaActual === 'mantenciones' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setVistaActual('mantenciones')}
        >
          🔧 Mantenciones
        </button>
      </nav>

      <main className="dashboard-content">
        {vistaActual === 'dashboard' && (
          <div className="dashboard-cards">
            <div className="card">
              <h3>Clientes Activos</h3>
              <p className="card-number">6</p>
              <span>Gestionar en sistema</span>
            </div>
            <div className="card">
              <h3>Equipos Registrados</h3>
              <p className="card-number">10</p>
              <span>Motores y bombas</span>
            </div>
            <div className="card">
              <h3>Eventos Hoy</h3>
              <p className="card-number">2</p>
              <span>Mantenciones programadas</span>
            </div>
            <div className="card">
              <h3>Alertas</h3>
              <p className="card-number">1</p>
              <span>Mantenciones próximas</span>
            </div>
          </div>
        )}

        {vistaActual === 'clientes' && (
          <div className="vista-contenido">
            <h2>👥 Gestión de Clientes</h2>
            <p>Lista de clientes cargándose desde API...</p>
            <button className="btn-primary">Cargar Clientes</button>
          </div>
        )}

        {vistaActual === 'calendario' && (
          <div className="vista-contenido">
            <h2>📅 Calendario de Eventos</h2>
            <p>Vista de calendario cargándose desde API...</p>
            <button className="btn-primary">Ver Eventos</button>
          </div>
        )}

        {vistaActual === 'mantenciones' && (
          <div className="vista-contenido">
            <h2>🔧 Registro de Mantenciones</h2>
            <p>Formulario de mantención cargándose...</p>
            <button className="btn-primary">Nueva Mantención</button>
          </div>
        )}
      </main>
    </div>
  )
}

// Componente Principal
function App() {
  const [usuario, setUsuario] = useState<any>(null)

  if (!usuario) {
    return <Login onLogin={setUsuario} />
  }

  return <Dashboard usuario={usuario} />
}

export default App