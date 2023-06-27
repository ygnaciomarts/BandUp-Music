// Variable para almacenar la ruta anterior
let previousPath = '';

function router() {
  // Obtener la ruta actual
  const path = window.location.hash;

  // Verificar si la ruta actual es igual a la ruta anterior
  if (path === previousPath) {
    return;
  }

  // Asignar una acción a cada ruta
  switch (path) {
    // Página de artista
    case '#/artist':
      cargarContenido('artist.html');
      break;
    // Prueba
    case '#/a3':
      cargarContenido('a3.html');
      break;
    case '#/':
      cargarContenido('app.html');
      break;
    // Página default/inicio
    default:
      cargarContenido('app.html');
  }

  // Actualizar la ruta anterior
  previousPath = path;
}


function cargarContenido(url) {
  // Obtener el contenedor del icono de carga
  const loaderContainer = document.querySelector('#loader-container');

  // Mostrar el icono de carga
  loaderContainer.style.display = 'block';

  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (xhr.status === 200) {
      // Obtener el contenido de la página
      const content = xhr.responseText;

      // Crear un objeto HTML con el contenido de la respuesta
      const range = document.createRange();
      const fragment = range.createContextualFragment(content);

      // Contar el número de imágenes en el contenido
      const images = fragment.querySelectorAll('img');
      let count = images.length;

      // Ocultar el contenido hasta que todas las imágenes se hayan cargado
      const target = document.querySelector('#content');
      target.classList.add('hidden');

      // Cargar todas las imágenes antes de mostrar el contenido
      images.forEach(img => {
        img.addEventListener('load', () => {
          count--;

          if (count === 0) {
            // Todas las imágenes se han cargado, mostrar el contenido
            // Ocultar el icono de carga con animación de salida
            loaderContainer.classList.add('fade-out-i');
            setTimeout(function() {
              loaderContainer.classList.add('fade-out-delayed');
              setTimeout(function() {
                loaderContainer.style.display = 'none';
                loaderContainer.classList.remove('fade-out-i');
                loaderContainer.classList.remove('fade-out-delayed');
              }, 1000);
            }, 1000);

            // Animar el contenido actual con estilos CSS
            target.classList.add('fade-out');
            target.addEventListener('animationend', function () {
              // Eliminar la clase de animación
              target.classList.remove('fade-out');

              // Ocultar el contenido
              target.classList.add('hidden');

              // Insertar el contenido en la plantilla
              target.innerHTML = '';
              target.appendChild(fragment);

              // Mostrar el contenido con animación de entrada
              target.classList.remove('hidden');
              target.classList.add('fade-in');
            }, {once: true, duration: 1000});
          }
        });
      });
    }
  };

  xhr.open('GET', url);
  xhr.send();
}


// Evento para el cambio de rutas
window.addEventListener('hashchange', router);

// Evento para la carga inicial de la página
window.addEventListener('load', router);