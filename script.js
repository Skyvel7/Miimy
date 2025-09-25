document.addEventListener('DOMContentLoaded', () => {
    const openLetterBtn = document.getElementById('open-letter-btn');
    const initialContent = document.querySelector('.initial-content');
    const letterContent = document.getElementById('letter-content');

    openLetterBtn.addEventListener('click', () => {
        // Oculta el contenido inicial
        initialContent.style.display = 'none';

        // Muestra la carta con una bonita animación
        letterContent.classList.remove('letter-hidden');
        letterContent.classList.add('letter-visible');
    });
});
