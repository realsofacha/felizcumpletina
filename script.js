function mostrarSeccion(id) {
  const secciones = document.querySelectorAll('.contenido-tab');
  secciones.forEach(s => s.classList.remove('activo'));

  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(t => t.classList.remove('active'));

  document.getElementById(id).classList.add('activo');
  document.querySelector(`.tab[onclick*="${id}"]`).classList.add('active');
}
