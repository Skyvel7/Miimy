// Función para cargar y mostrar una carta
    async function cargarCarta(url) {
        try {
            // Inicia la música si es el primer clic
            if (!musicStarted) {
                playRandomSong();
            }

            // 1. Carga el archivo HTML de la carta
            const response = await fetch(url);
            if (!response.ok) throw new Error('No se pudo cargar la carta.');
            const cartaHtmlCompleto = await response.text();

            // 2. Extrae el contenido y el botón
            const parser = new DOMParser();
            const doc = parser.parseFromString(cartaHtmlCompleto, 'text/html');
            const contenidoCarta = doc.querySelector('.carta-individual');
            const botonVolverOriginal = doc.querySelector('.btn-volver'); // Botón 1

            if (!contenidoCarta || !botonVolverOriginal) {
                throw new Error('El archivo de la carta no tiene el formato correcto.');
            }

            // --- ¡AQUÍ ESTÁ EL CAMBIO! ---
            // 3. Clonamos el botón para tener uno arriba
            const botonVolverClonado = botonVolverOriginal.cloneNode(true); // Botón 2 (clon)

            // 4. Limpiamos la vista e insertamos los elementos
            vistaCartaIndividual.innerHTML = ''; // Limpia el contenedor
            
            vistaCartaIndividual.appendChild(botonVolverClonado);    // Añade el botón ARRIBA
            vistaCartaIndividual.appendChild(contenidoCarta);       // Añade el texto de la carta
            vistaCartaIndividual.appendChild(botonVolverOriginal);  // Añade el botón ABAJO

            // 5. Oculta la lista y muestra la carta
            vistaListaCartas.style.display = 'none';
            vistaCartaIndividual.style.display = 'block';

            // 6. Asignamos la función de "volver" a AMBOS botones
            // Usamos querySelectorAll para encontrar todos los .btn-volver
            vistaCartaIndividual.querySelectorAll('.btn-volver').forEach(boton => {
                boton.addEventListener('click', (e) => {
                    e.preventDefault(); 
                    mostrarListaCartas();
                });
            });
            // --- FIN DEL CAMBIO ---

        } catch (error) {
            console.error('Error al cargar la carta:', error);
            alert('Error al cargar la carta. Revisa la consola.');
        }
    }