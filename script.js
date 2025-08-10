// Prerrequisitos de cada ramo (ramos que deben estar aprobados para desbloquear este)
const prerequisitos = {
  'CBCII': ['CienBasCuiI'],
  'CAPC': ['CBCII'],
  'CEAAMPE': ['CDH','CAPC'],
  'BEBE': ['SSC'],
  'PSPEHMA': ['PSPECVIF'],
  'CEAAMCSE': ['CEAAMPE'],
  'CENAPE': ['CEAAMCSE'],
  'ICE': ['BEBE'],
  'CENACSE': ['CENAPE'],
  'CEEU': ['CENACSE'],
  'GGC': ['GLE'],
  'IC': ['EGIII','CEEU','GGC','EPII'],
  'ICLI': ['EGIII','CEEU','GGC','EPII'],
  'AT': ['IC','ICLI'],
};

// Funciones para guardar y cargar progreso en localStorage
function obtenerAprobados() {
  const data = localStorage.getItem('mallaAprobados');
  return data ? JSON.parse(data) : [];
}

function guardarAprobados(aprobados) {
  localStorage.setItem('mallaAprobados', JSON.stringify(aprobados));
}

// Actualiza qué ramos están desbloqueados o bloqueados según prerrequisitos
function actualizarDesbloqueos() {
  const aprobados = obtenerAprobados();

  for (const [destino, reqs] of Object.entries(prerequisitos)) {
    const elem = document.getElementById(destino);
    if (!elem) continue;

    // Verificar si se cumplen prerrequisitos normales
    let puedeDesbloquear = reqs.every(r => aprobados.includes(r));

    if (!elem.classList.contains('aprobado')) {
      if (puedeDesbloquear) elem.classList.remove('bloqueado');
      else elem.classList.add('bloqueado');
    } else {
      // Si está aprobado, no debe estar bloqueado
      elem.classList.remove('bloqueado');
    }
  }
}

// Maneja el clic para aprobar o desaprobar un ramo (solo si no está bloqueado)
function aprobar(e) {
  const ramo = e.currentTarget;
  if (ramo.classList.contains('bloqueado')) return;

  ramo.classList.toggle('aprobado');

  const aprobados = obtenerAprobados();
  if (ramo.classList.contains('aprobado')) {
    if (!aprobados.includes(ramo.id)) aprobados.push(ramo.id);
  } else {
    const idx = aprobados.indexOf(ramo.id);
    if (idx > -1) aprobados.splice(idx, 1);
  }
  guardarAprobados(aprobados);

  actualizarDesbloqueos();
}

function crearMoñosDecorativos() {
  const contenedor = document.getElementById('moños-decorativos');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  const ancho = window.innerWidth;
  const alto = window.innerHeight;
  const moñoSize = 60;
  const espacioX = 200;
  const espacioY = 120;

  // Suma 1 a filas para cubrir el borde inferior
  const columnas = Math.floor(ancho / espacioX);
  const filas = Math.floor(alto / espacioY) + 1;

  for (let fila = 0; fila < filas; fila++) {
    for (let col = 0; col < columnas; col++) {
      const moño = document.createElement('img');
      moño.className = 'moño-svg';
      moño.src = 'moño'; // Cambia la ruta si tu imagen está en otra carpeta

      const offset = (fila % 2 === 0) ? 0 : espacioX / 2;
      const left = col * espacioX + offset;
      const top = fila * espacioY;

      if (left + moñoSize > ancho) continue;

      moño.style.left = left + 'px';
      moño.style.top = top + 'px';
      moño.style.transform = `rotate(-20deg) scale(0.9)`;
      contenedor.appendChild(moño);
    }
  }
}

// Al cargar la página, asignar eventos, cargar progreso y actualizar desbloqueos
window.addEventListener('DOMContentLoaded', () => {
  const todosRamos = document.querySelectorAll('.ramo');

  const aprobados = obtenerAprobados();
  todosRamos.forEach(ramo => {
    if (aprobados.includes(ramo.id)) {
      ramo.classList.add('aprobado');
    }
    crearMoñosDecorativos();
  });

  todosRamos.forEach(ramo => {
    ramo.addEventListener('click', aprobar);
  });

  actualizarDesbloqueos();
});

window.addEventListener('resize', () => {
  crearMoñosDecorativos();
});

// ...existing code...
function toggleRamoInfo(event, infoId) {
  event.stopPropagation(); // Evita que se apruebe el ramo
  const infoDiv = document.getElementById(infoId);
  infoDiv.classList.toggle('activo');
}
// ...existing code...
