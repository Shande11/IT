document.addEventListener('DOMContentLoaded', () => {

    // Función de utilidad para debounce (optimización de rendimiento)
    const debounce = (func, wait = 20, immediate = true) => {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    // Lógica para el menú de hamburguesa
    const navSlide = () => {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-links li');
        const body = document.body;
        
        // Función para cerrar el menú
        const closeMenu = () => {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            body.classList.remove('menu-open');
            
            navLinks.forEach(link => {
                link.style.animation = '';
            });
        };

        burger.addEventListener('click', () => {
            // Activar el menú
            nav.classList.toggle('nav-active');
            
            // Bloquear scroll cuando el menú está abierto
            body.classList.toggle('menu-open');

            // Animar los enlaces
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`;
                }
            });

            // Animar el ícono de la hamburguesa
            burger.classList.toggle('toggle');
        });
        
        // Cerrar menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
        // Cerrar menú al hacer clic fuera del menú
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('nav-active') && 
                !nav.contains(e.target) && 
                !burger.contains(e.target)) {
                closeMenu();
            }
        });
    }
    
    // Efecto de scroll para la barra de navegación
    const navScroll = () => {
        const navbar = document.querySelector('.navbar');
        
        // Usar debounce para mejorar el rendimiento
        window.addEventListener('scroll', debounce(() => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 10));
    }

    // Lógica para las preguntas frecuentes (FAQ)
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');
            const toggle = item.querySelector('.faq-toggle');
            
            // Cierra cualquier otra pregunta abierta
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    otherItem.querySelector('.faq-toggle').textContent = '+';
                }
            });

            // Expande o contrae la pregunta actual
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                toggle.textContent = '-';
            } else {
                answer.style.maxHeight = null;
                toggle.textContent = '+';
            }
        });
    });
    
    // Animación de elementos al hacer scroll usando Intersection Observer para mejor rendimiento
    const animateOnScroll = () => {
        // Seleccionar todos los elementos que queremos animar
        const elements = document.querySelectorAll('section, .faq-item, .download-button');
        
        // Configurar el Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Cuando un elemento es visible en el viewport
                if (entry.isIntersecting) {
                    // Añadir un pequeño retraso basado en el índice para crear un efecto en cascada
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, 50);
                    
                    // Dejar de observar el elemento una vez que se ha animado
                    observer.unobserve(entry.target);
                }
            });
        }, {
            // Configuración del observer: el elemento debe estar al menos 10% visible
            threshold: 0.1,
            // Margen negativo para activar la animación un poco antes de que el elemento sea completamente visible
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Preparar y observar cada elemento
        elements.forEach((element, index) => {
            // Añadir la clase que prepara el elemento para la animación
            element.classList.add('animate-ready');
            // Comenzar a observar el elemento
            observer.observe(element);
        });
    }

    navSlide();
    navScroll();
    animateOnScroll();
});