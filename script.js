document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURACIÓN DE MÚSICA ---
    const canciones = [
        'musica/cancion1.mp3',
        'musica/cancion2.mp3',
        'musica/cancion3.mp3'
    ];
    const audioPlayer = document.getElementById('audio-player');
    let musicStarted = false;
    let cancionActualIndex = -1;

    function playRandomSong() {
        if (musicStarted) return; // No hacer nada si ya está sonando
        
        let nuevoIndex;
        do {
            nuevoIndex = Math.floor(Math.random() * canciones.length);
        } while (nuevoIndex === cancionActualIndex && canciones.length > 1);
        
        cancionActualIndex = nuevoIndex;
        audioPlayer.src = canciones[cancionActualIndex];
        audioPlayer.play();
        musicStarted = true;
    }

    // Poner otra canción cuando termine
    audioPlayer.addEventListener('ended', () => {
        musicStarted = false; // Permitir que la función elija una nueva
        playRandomSong();
    });


    // --- 2. CONFIGURACIÓN DE NAVEGACIÓN (LA MAGIA) ---
    const vistaListaCartas = document.getElementById('vista-lista-cartas');
    const vistaCartaIndividual = document.getElementById('vista-carta-individual');
    const todosLosEnlacesDeCartas = document.querySelectorAll('.carta-link');

    // Función para mostrar la lista de cartas (oculta la carta)
    function mostrarListaCartas() {
        vistaCartaIndividual.style.display = 'none'; // Oculta la carta
        vistaCartaIndividual.innerHTML = ''; // Limpia el contenido
        vistaListaCartas.style.display = 'block'; // Muestra la lista
    }

    // Función para cargar y mostrar una carta
    async function cargarCarta(url) {
        try {
            // Inicia la música si es el primer clic
            if (!musicStarted) {
                playRandomSong();
            }

            // 1. Carga el archivo HTML de la carta en segundo plano
            const response = await fetch(url);
            if (!response.ok) throw new Error('No se pudo cargar la carta.');
            const cartaHtmlCompleto = await response.text();

            // 2. Extrae SÓLO el contenido que queremos de ese HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(cartaHtmlCompleto, 'text/html');
            const contenidoCarta = doc.querySelector('.carta-individual');
            const botonVolver = doc.querySelector('.btn-volver');

            if (!contenidoCarta || !botonVolver) {
                throw new Error('El archivo de la carta no tiene el formato correcto.');
            }

            // 3. Inserta el contenido y el botón en nuestra "Vista 2"
            vistaCartaIndividual.innerHTML = ''; // Limpia por si acaso
            vistaCartaIndividual.appendChild(contenidoCarta);
            vistaCartaIndividual.appendChild(botonVolver);

            // 4. Oculta la lista de cartas (Vista 1) y muestra la carta (Vista 2)
            vistaListaCartas.style.display = 'none';
            vistaCartaIndividual.style.display = 'block';

            // 5. IMPORTANTE: Le damos al nuevo "botón volver" su función
            // Este botón ahora no recarga la página, solo llama a nuestra función
            vistaCartaIndividual.querySelector('.btn-volver').addEventListener('click', (e) => {
                e.preventDefault(); // Previene que el enlace 'href' funcione
                mostrarListaCartas();
            });

        } catch (error) {
            console.error('Error al cargar la carta:', error);
            alert('Error al cargar la carta. Revisa la consola.');
        }
    }

    // 6. Asigna la función de cargar a CADA enlace de carta
    todosLosEnlacesDeCartas.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // ¡PREVIENE que el enlace abra una página nueva!
            const urlDeLaCarta = link.getAttribute('href');
            cargarCarta(urlDeLaCarta);
        });
    });

});