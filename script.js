document.addEventListener('DOMContentLoaded', () => {
    const openLetterBtn = document.getElementById('open-letter-btn');
    const initialContent = document.querySelector('.initial-content');
    const letterContent = document.getElementById('letter-content');
    const birthdaySong = document.getElementById('birthday-song');

    // Variable para asegurar que la música solo se inicie una vez
    let isMusicPlaying = false;

    openLetterBtn.addEventListener('click', () => {
        // Inicia la música si aún no está sonando
        if (!isMusicPlaying) {
            birthdaySong.play();
            isMusicPlaying = true;
        }

        // Oculta el contenido inicial
        initialContent.style.display = 'none';

        // Muestra la carta con una bonita animación
        letterContent.classList.remove('letter-hidden');
        letterContent.classList.add('letter-visible');
    });
});
