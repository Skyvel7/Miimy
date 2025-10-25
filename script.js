document.addEventListener('DOMContentLoaded', () => {

    // 1. Lista de tus canciones
    const canciones = [
        'musica/cancion1.mp3',
        'musica/cancion2.mp3',
        'musica/cancion3.mp3'
        // ... añade más aquí
    ];

    // 2. Obtener el reproductor de audio
    const audioPlayer = document.getElementById('audio-player');
    
    // Esta variable 'bandera' nos dice si la música ya ha empezado
    let musicStarted = false; 
    let cancionActualIndex = -1;

    // 3. Función para tocar una canción aleatoria
    function playRandomSong() {
        let nuevoIndex;
        do {
            nuevoIndex = Math.floor(Math.random() * canciones.length);
        } while (nuevoIndex === cancionActualIndex && canciones.length > 1);
        
        cancionActualIndex = nuevoIndex;
        audioPlayer.src = canciones[cancionActualIndex];
        audioPlayer.play();
        
        // Marcamos que la música ya ha empezado
        musicStarted = true; 
    }

    // 4. Función para cuando una canción termina
    audioPlayer.addEventListener('ended', playRandomSong);

    // 5. ¡LA MAGIA! 
    // Buscamos TODAS las cartas (todos los enlaces con la clase 'carta-link')
    const cardLinks = document.querySelectorAll('.carta-link');

    // Añadimos un "oyente" de clic a CADA carta
    cardLinks.forEach(link => {
        
        link.addEventListener('click', () => {
            // Revisamos nuestra 'bandera'
            // Si la música NO ha empezado...
            if (!musicStarted) {
                // ...¡la iniciamos!
                playRandomSong();
            }
            // Si 'musicStarted' es 'true', este bloque se ignora
            // y la música simplemente sigue sonando.
        });

    });

});