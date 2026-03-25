document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURACIÓN DE MÚSICA ---
    const canciones = [
        'musica/cancion5.mp3'

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


    // --- 3. LÓGICA DEL JUEGO DE SAN VALENTÍN ---
    let gameInterval;
    let gameActive = false;
    let score = 0;
    const WINNING_SCORE = 50;
    let player = { x: 135, y: 340, width: 50, height: 50, speed: 5 }; // Ajustado para canvas 320x400
    let items = []; // Corazones y obstáculos
    let canvas, ctx;

    // Imágenes (usaremos emojis para simplificar y no depender de archivos externos por ahora)
    const PLAYER_EMOJI = "🧺"; // Cesta
    const HEART_EMOJI = "❤️";
    const BAD_EMOJI = "😢";

    function initGame() {
        canvas = document.getElementById('gameCanvas');
        if (!canvas) return; // Si no hay canvas, no es la carta del juego
        ctx = canvas.getContext('2d');

        const btnStart = document.getElementById('btn-start-game');
        const btnRestart = document.getElementById('btn-restart-game');
        const btnRestartWon = document.getElementById('btn-restart-game-won');

        if (btnStart) btnStart.addEventListener('click', startGame);
        if (btnRestart) btnRestart.addEventListener('click', startGame);
        if (btnRestartWon) btnRestartWon.addEventListener('click', startGame);

        // Controles Táctiles y Ratón
        // Controles Táctiles y Ratón
        const handleInput = (clientX) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width; // Factor de escala por si el CSS reduce el canvas
            const touchX = (clientX - rect.left) * scaleX;

            player.x = touchX - player.width / 2;
            // Limites
            if (player.x < 0) player.x = 0;
            if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
        };

        canvas.addEventListener('mousemove', (e) => {
            if (!gameActive) return;
            handleInput(e.clientX);
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!gameActive) return;
            handleInput(e.touches[0].clientX);
        }, { passive: false });
    }

    function startGame() {
        gameActive = true;
        score = 0;
        items = [];
        player.x = canvas.width / 2 - player.width / 2;
        updateScore();

        document.getElementById('game-ui').style.pointerEvents = 'none'; // Permitir juego
        document.getElementById('btn-start-game').style.display = 'none';
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('game-won').style.display = 'none';

        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 20); // ~50 FPS
    }

    function stopGame() {
        gameActive = false;
        clearInterval(gameInterval);
        const gameUI = document.getElementById('game-ui');
        if (gameUI) {
            gameUI.style.pointerEvents = 'auto';
        }
    }

    function movePlayer(e) {
        if (!gameActive) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        player.x = mouseX - player.width / 2;

        // Limites
        if (player.x < 0) player.x = 0;
        if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
    }

    function gameLoop() {
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar Jugador
        ctx.font = "40px Arial";
        ctx.fillText(PLAYER_EMOJI, player.x, player.y + 40);

        // Generar items aleatorios
        if (Math.random() < 0.05) { // Probabilidad de spawn
            const type = Math.random() < 0.3 ? 'bad' : 'good'; // 30% malos, 70% buenos
            items.push({
                x: Math.random() * (canvas.width - 30),
                y: -30,
                type: type,
                speed: Math.random() * 2 + 2
            });
        }

        // Actualizar y dibujar items
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            item.y += item.speed;

            // Dibujar
            ctx.font = "30px Arial";
            ctx.fillText(item.type === 'good' ? HEART_EMOJI : BAD_EMOJI, item.x, item.y + 30);

            // Colisiones
            if (
                item.x < player.x + player.width &&
                item.x + 30 > player.x &&
                item.y < player.y + player.height &&
                item.y + 30 > player.y
            ) {
                // Tocado
                if (item.type === 'good') {
                    score++;
                    updateScore();
                    // Eliminar item
                    items.splice(i, 1);
                    i--;

                    if (score >= WINNING_SCORE) {
                        gameWin();
                    }
                } else {
                    gameOver();
                }
            } else if (item.y > canvas.height) {
                // Salió de pantalla
                items.splice(i, 1);
                i--;
            }
        }
    }

    function updateScore() {
        document.getElementById('score-display').innerText = `Puntos: ${score}`;
    }

    function gameOver() {
        stopGame();
        document.getElementById('game-message').innerText = `¡Oh no! Atrapaste una carita triste 😢. \nPuntaje final: ${score}`;
        document.getElementById('game-over').style.display = 'block';
    }

    function gameWin() {
        stopGame();
        document.getElementById('game-won').style.display = 'block';

        // --- GUARDAR PROGRESO ---
        localStorage.setItem('valentin_won', 'true');

        // Cambiar comportamiento del botón para ir a la carta
        const btnWon = document.getElementById('btn-restart-game-won');
        if (btnWon) {
            btnWon.innerText = "💌 Leer mi Carta 💌";
            // Clonamos el botón para eliminar listeners anteriores (como startGame)
            const newBtn = btnWon.cloneNode(true);
            btnWon.parentNode.replaceChild(newBtn, btnWon);

            newBtn.addEventListener('click', () => {
                cargarCarta('cartas/carta-san-valentin-recompensa.html');
            });
        }
    }

    // --- 4. CONFIGURACIÓN DE NAVEGACIÓN (MODIFICADA) ---

    // Función para mostrar la lista de cartas (oculta la carta)
    function mostrarListaCartas() {
        stopGame(); // DETIENE EL JUEGO AL SALIR
        vistaCartaIndividual.style.display = 'none';
        vistaCartaIndividual.innerHTML = '';
        vistaListaCartas.style.display = 'block';
    }

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

            // 2. Extrae SÓLO .carta-individual
            const parser = new DOMParser();
            const doc = parser.parseFromString(cartaHtmlCompleto, 'text/html');
            const contenidoCarta = doc.querySelector('.carta-individual');

            if (!contenidoCarta) {
                throw new Error('El archivo de la carta no tiene la clase .carta-individual.');
            }

            // 3. Limpia e inserta
            vistaCartaIndividual.innerHTML = '';
            vistaCartaIndividual.appendChild(contenidoCarta);

            // 4. Cambia las vistas
            vistaListaCartas.style.display = 'none';
            vistaCartaIndividual.style.display = 'block';

            // --- INICIALIZAR JUEGO SI EXISTE ---
            // Pequeño timeout para asegurar que el DOM se ha pintado
            setTimeout(() => {
                if (document.getElementById('gameCanvas')) {
                    initGame();
                }
            }, 50);

            // 5. Asigna la función de "volver"
            vistaCartaIndividual.querySelectorAll('.btn-volver').forEach(boton => {
                // Si es el botón de jugar de nuevo
                if (boton.id === 'btn-replay-game') {
                    boton.addEventListener('click', (e) => {
                        e.preventDefault();
                        cargarCarta('cartas/carta-san-valentin.html');
                    });
                } else {
                    // Si es el botón de volver normal
                    boton.addEventListener('click', (e) => {
                        e.preventDefault();
                        mostrarListaCartas();
                    });
                }
            });

        } catch (error) {
            console.error('Error al cargar la carta:', error);
            alert('Error al cargar la carta. Revisa la consola.');
        }
    }

    // 6. Asigna la función de cargar a CADA enlace de carta
    todosLosEnlacesDeCartas.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            let urlDeLaCarta = link.getAttribute('href');

            // --- VERIFICACIÓN DE RECOMPENSA ---
            // Si intenta abrir la carta de San Valentín Y ya ganó antes...
            if (urlDeLaCarta.includes('carta-san-valentin.html')) {
                const yaGano = localStorage.getItem('valentin_won') === 'true';
                if (yaGano) {
                    // ... le mostramos directamente la carta de recompensa
                    urlDeLaCarta = 'cartas/carta-san-valentin-recompensa.html';
                }
            }

            cargarCarta(urlDeLaCarta);
        });
    });

    // --- INSTAGRAM UI LOGIC ---

    // Funcionalidad de dar "Me gusta"
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation(); // Evitar comportamientos extraños
            this.classList.toggle('liked');
            if (this.classList.contains('liked')) {
                this.setAttribute('fill', '#ed4956');
                this.setAttribute('stroke', '#ed4956');
            } else {
                this.setAttribute('fill', 'none');
                this.setAttribute('stroke', 'currentColor');
            }
        });
    });

    // Funcionalidad de la historia de música
    const playMusicStory = document.getElementById('play-music-story');
    if (playMusicStory) {
        playMusicStory.addEventListener('click', () => {
            const ring = playMusicStory.querySelector('.ig-story-ring');
            if (!musicStarted) {
                playRandomSong();
                ring.classList.add('playing');
            } else {
                audioPlayer.pause();
                musicStarted = false;
                ring.classList.remove('playing');
            }
        });
    }

    // Funcionalidad de Carruseles (Dots)
    document.querySelectorAll('.ig-post-carousel-container').forEach(container => {
        const carousel = container.querySelector('.ig-post-carousel');
        const dots = container.querySelectorAll('.ig-carousel-dots .dot');

        if (carousel && dots.length > 0) {
            carousel.addEventListener('scroll', () => {
                const scrollLeft = carousel.scrollLeft;
                const clientWidth = carousel.clientWidth;
                // Calculamos el índice de la foto actual redondeando la posición
                const activeIndex = Math.round(scrollLeft / clientWidth);
                
                dots.forEach((dot, index) => {
                    if (index === activeIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            });
        }
    });

});
