:root {
  --rosa: #fce4ec;
  --uva: #d8a1c4;
  --texto: #4e2c3b;
  --lavanda: #f7f2f9;
  --borde: #d8a1c4;
  --sombra: rgba(124, 76, 87, 0.05);
  --fuente: 'Segoe UI', sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--fuente);
  background: var(--lavanda);
  color: var(--texto);
}

.page {
  display: flex;
  justify-content: center;
  background: white;
}

/* Margen izquierdo simula perforaciones */
.perforaciones {
  width: 2.5cm;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  background: white;
  border-right: 1px dashed var(--borde);
  padding-top: 2cm;
  padding-bottom: 2cm;
}

.hole {
  width: 10px;
  height: 10px;
  background: white;
  border: 2px solid var(--borde);
  border-radius: 50%;
}

.cuaderno {
  width: 18.5cm;
  min-height: 29.7cm;
  padding: 2cm;
  background: white;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--borde);
  margin-bottom: 1rem;
}

.subtitulo {
  font-size: 0.9rem;
  color: #946880;
  margin: 0.2rem 0;
}

.acciones .btn {
  padding: 0.5rem 1rem;
  background: var(--uva);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.tabs {
  display: flex;
  border-bottom: 2px solid var(--lavanda);
  margin-bottom: 1rem;
}

.tab {
  background: none;
  border: none;
  padding: 0.8rem 1.2rem;
  font-weight: bold;
  cursor: pointer;
  color: var(--texto);
  border-bottom: 3px solid transparent;
}

.tab.active {
  border-color: var(--borde);
}

main {
  padding-bottom: 3rem;
}

.contenido-tab {
  display: none;
}

.contenido-tab.activo {
  display: block;
}

h1 {
  margin: 0;
  color: var(--texto);
}

h2 {
  color: var(--texto);
  border-bottom: 1px solid var(--borde);
  padding-bottom: 0.2rem;
  margin-top: 2rem;
}

h3 {
  color: var(--texto);
  margin-top: 1.5rem;
}

label {
  font-weight: bold;
  display: block;
  margin-top: 1.2rem;
}

input[type="text"],
input[type="number"],
textarea,
select {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid var(--borde);
  border-radius: 5px;
  background-color: #fff7fb;
  color: var(--texto);
  font-size: 1rem;
}

textarea {
  min-height: 60px;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 0.5rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
}

.checkbox-item input {
  margin-right: 0.3rem;
}

.sociograma {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.sociograma svg {
  width: 300px;
  height: 300px;
}

@media print {
  .tabs, .btn {
    display: none !important;
  }

  body {
    background: white;
  }

  .page {
    display: block;
  }

  .cuaderno {
    width: 100%;
    padding: 2cm 2cm 2cm 3cm;
  }

  .perforaciones {
    position: absolute;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: -1;
  }
}
