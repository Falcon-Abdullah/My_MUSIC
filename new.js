document.addEventListener('DOMContentLoaded', function() {
    const heading = document.getElementById('name');
    const skillCards = document.querySelectorAll('.skill-card');
    let currentIndex = 0;

    function animateHeading() {
        heading.classList.add('animate__animated', 'animate__jackInTheBox');
        
        setTimeout(() => {
            heading.classList.remove('animate__jackInTheBox');
            heading.classList.add('animate__fadeOutDown');
        }, 5000);

        setTimeout(() => {
            heading.classList.remove('animate__fadeOutDown');
            heading.classList.add('animate__jackInTheBox');
        }, 7000);
    }
    animateHeading();
    setInterval(animateHeading, 12000);
});
