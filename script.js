function mostrarSeccion(id) {
  // Oculta todas las secciones
  const secciones = document.querySelectorAll('.contenido-tab');
  secciones.forEach(section => section.classList.remove('activo'));

  // Desactiva todos los tabs
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.classList.remove('active'));

  // Activa la sección y el tab correspondiente
  document.getElementById(id).classList.add('activo');
  document.querySelector(`.tab[onclick*="${id}"]`).classList.add('active');
}
