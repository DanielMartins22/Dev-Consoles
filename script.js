// =========================
// AGUARDA CARREGAMENTO DOS DADOS EXTERNOS
// =========================

// Função para aguardar o carregamento dos arquivos de dados
function waitForData() {
    return new Promise((resolve) => {
        const checkData = () => {
            if (typeof consoles !== 'undefined' && typeof gameList !== 'undefined') {
                resolve();
            } else {
                setTimeout(checkData, 50);
            }
        };
        checkData();
    });
}

// =========================
// CLASSE PRINCIPAL DA APLICAÇÃO
// =========================
class GameZoneApp {
    constructor() {
        this.currentIndex = 0;
        this.currentCards = [];
        this.carouselInitialized = false;
        this.allProducts = [];
        this.init();
    }

    // =========================
    // INICIALIZAÇÃO
    // =========================
    async init() {
        try {
            await waitForData();
            this.combineProducts();
            this.cacheElements();
            this.bindEvents();
            this.renderInitialProducts();
        } catch (error) {
            console.error('Erro ao inicializar a aplicação:', error);
            this.showErrorMessage();
        }
    }

    // =========================
    // COMBINA PRODUTOS DE DIFERENTES FONTES
    // =========================
    combineProducts() {
        this.allProducts = [];

        // Adiciona consoles se disponível
        if (typeof consoles !== 'undefined' && Array.isArray(consoles)) {
            this.allProducts.push(...consoles.map(item => ({ ...item, category: 'console' })));
        }

        // Adiciona jogos se disponível
        if (typeof gameList !== 'undefined' && Array.isArray(gameList)) {
            this.allProducts.push(...gameList.map(item => ({ ...item, category: 'game' })));
        }
    }

    // =========================
    // CACHE DOS ELEMENTOS DOM
    // =========================
    cacheElements() {
        // Navigation elements
        this.btnHome = document.querySelector('#liHome');
        this.btnConsoles = document.querySelector('#liConsoles');
        this.btnGames = document.querySelector('#liGames');
        this.btnSobre = document.querySelector('#liSobre');
        this.btnContact = document.querySelectorAll('.liContact');

        // Main sections
        this.homePage = document.querySelector('main');
        this.productsSection = document.querySelector('#produtos');

        // Product elements
        this.productGridContainer = document.querySelector('.product-grid');
        this.categoryCards = document.querySelectorAll('.category-card');

        // Carousel elements
        this.carousel = document.querySelector('.carrossel');
        this.carouselContainer = document.querySelector('.carrossel-container');
        this.prevBtn = document.querySelector('.prev');
        this.nextBtn = document.querySelector('.next');

        // Hero button
        this.heroBtn = document.querySelector('.btn');
    }

    // =========================
    // VINCULAÇÃO DE EVENTOS
    // =========================
    bindEvents() {
        // Hero button
        if (this.heroBtn) {
            this.heroBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToProducts();
            });
        }

        // Navigation buttons
        if (this.btnHome) {
            this.btnHome.addEventListener('click', (e) => {
                e.preventDefault();
                this.goHome();
            });
        }

        if (this.btnConsoles) {
            this.btnConsoles.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToProducts();
                setTimeout(() => this.showCarouselConsoles(), 300);
            });
        }

        if (this.btnGames) {
            this.btnGames.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToProducts();
                setTimeout(() => this.showCarouselGames(), 300);
            });
        }

        if (this.btnSobre) {
            this.btnSobre.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAboutSection();
            });
        }

        // Contact buttons
        this.btnContact.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showContactSection();
            });
        });

        // Category cards
        this.categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                this.showCategoryProducts(card.id);
                this.scrollToProducts();
            });
        });

        // Initialize carousel events
        this.initCarouselEvents();
    }

    // =========================
    // CAROUSEL EVENTS
    // =========================
    initCarouselEvents() {
        if (this.prevBtn && this.nextBtn && !this.carouselInitialized) {
            this.prevBtn.addEventListener('click', () => this.previousSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());

            // Touch events for mobile
            this.prevBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.previousSlide();
            });
            this.nextBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.nextSlide();
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (this.carousel.style.display !== 'none') {
                    if (e.key === 'ArrowLeft') this.previousSlide();
                    if (e.key === 'ArrowRight') this.nextSlide();
                }
            });

            this.carouselInitialized = true;
        }
    }

    // =========================
    // NAVIGATION METHODS
    // =========================
    scrollToProducts() {
        if (this.productsSection) {
            this.productsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    goHome() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => window.location.reload(), 800);
    }

    // =========================
    // CAROUSEL METHODS
    // =========================
    showCard(index) {
        if (!this.currentCards.length) return;

        this.currentCards.forEach(card => {
            card.classList.remove('active');
            card.style.display = 'none';
        });

        setTimeout(() => {
            if (this.currentCards[index]) {
                this.currentCards[index].style.display = 'flex';
                this.currentCards[index].classList.add('active');
            }
        }, 50);
    }

    previousSlide() {
        if (this.currentCards.length > 0) {
            this.currentIndex = (this.currentIndex - 1 + this.currentCards.length) % this.currentCards.length;
            this.showCard(this.currentIndex);
        }
    }

    nextSlide() {
        if (this.currentCards.length > 0) {
            this.currentIndex = (this.currentIndex + 1) % this.currentCards.length;
            this.showCard(this.currentIndex);
        }
    }

    createCarouselCard(item) {
        const card = document.createElement('div');
        card.classList.add('card');

        const price = typeof item.price === 'number' ?
            item.price.toFixed(2).replace('.', ',') :
            item.price || '0,00';

        card.innerHTML = `
                    <img src="${item.img || item.image || ''}" alt="${item.name || 'Produto'}" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMjEyNjJkIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOGI5NDllIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiI+SW1hZ2VtPC90ZXh0Pgo8L3N2Zz4='"/>
                    <h3>${item.name || 'Produto'}</h3>
                    <div class="price">R$ ${price}</div> 
                    <button type="button" class="product-btn" aria-label="Adicionar ${item.name || 'produto'} ao carrinho">
                        Adicionar ao Carrinho
                    </button>
                `;

        return card;
    }

    showCarouselConsoles() {
        this.resetCarousel();
        this.hideProductGrid();
        this.carousel.style.display = 'block';

        const consolesData = typeof consoles !== 'undefined' ? consoles : [];

        if (consolesData.length === 0) {
            this.showEmptyCarousel('Nenhum console disponível');
            return;
        }

        consolesData.forEach((console, index) => {
            const card = this.createCarouselCard(console);
            if (index === 0) card.classList.add('active');
            this.carouselContainer.appendChild(card);
            this.currentCards.push(card);
        });
    }

    showCarouselGames() {
        this.resetCarousel();
        this.hideProductGrid();
        this.carousel.style.display = 'block';

        const gamesData = typeof gameList !== 'undefined' ? gameList : [];

        if (gamesData.length === 0) {
            this.showEmptyCarousel('Nenhum jogo disponível');
            return;
        }

        gamesData.forEach((game, index) => {
            const card = this.createCarouselCard(game);
            if (index === 0) card.classList.add('active');
            this.carouselContainer.appendChild(card);
            this.currentCards.push(card);
        });
    }

    showEmptyCarousel(message) {
        this.carouselContainer.innerHTML = `
                    <div class="empty-carousel">
                        <p>${message}</p>
                    </div>
                `;
    }

    resetCarousel() {
        this.currentIndex = 0;
        this.currentCards = [];
        if (this.carouselContainer) {
            this.carouselContainer.innerHTML = '';
        }
    }

    hideProductGrid() {
        if (this.productGridContainer) {
            this.productGridContainer.style.display = 'none';
        }
    }

    showProductGrid() {
        if (this.carousel) {
            this.carousel.style.display = 'none';
        }
        if (this.productGridContainer) {
            this.productGridContainer.style.display = 'grid';
        }
    }

    // =========================
    // CONTENT SECTIONS
    // =========================
    showAboutSection() {
        this.showProductGrid();

        // Scroll to top and replace main content
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
            this.homePage.innerHTML = `
                        <section class="sobre" id="sobre">
                            <div class="sobre-content">
                                <h2>Sobre Nós</h2>
                                <p>Somos a <strong>GameZone</strong>, sua loja especializada em consoles e jogos, oferecendo os melhores produtos do universo gamer. Aqui você encontra <strong>PlayStation 4 e 5</strong>, <strong>Xbox One S, Series S e Series X</strong>, além dos clássicos <strong>Nintendo Switch</strong> — tudo com garantia, qualidade e preços que cabem no seu bolso.</p>
                                <p>Seja você um jogador casual que curte uma partida relaxante ou um gamer hardcore em busca dos últimos lançamentos, temos o que você precisa para elevar sua experiência de jogo. Porque aqui na GameZone, <em>jogar é mais que passatempo — é estilo de vida</em>.</p>
                                <p><strong>Nossa missão:</strong> Democratizar o acesso aos melhores games e consoles, conectando pessoas através da paixão pelos jogos.</p>
                            </div>
                        </section>
                    `;
        }, 300);
    }

    showContactSection() {
        this.showProductGrid();

        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
            this.homePage.innerHTML = `                  
                        <section class="contact" id="contact">                          
                            <div class="sobre-content">                                  
                                <h2>Contato</h2>                                  
                                <p>Tem alguma <strong>dúvida</strong>, sugestão ou quer simplesmente dizer um oi? <strong>Adoraríamos ouvir você!</strong> Entre em contato conosco através do e-mail <a href="mailto:contato@gamezone.com">contato@gamezone.com</a>.</p>                                  
                                <p>Estamos aqui para ajudar você a encontrar o console ou jogo perfeito. Seja para tirar dúvidas sobre produtos, suporte técnico ou apenas para trocar uma ideia sobre games, nossa equipe está sempre pronta para atender.</p>
                                <p><strong>Horário de Atendimento:</strong> Segunda a Sexta, das 9h às 18h.</p>                         
                            </div>                  
                        </section>               
                    `;
        }, 300);
    }

    // =========================
    // PRODUCT RENDERING
    // =========================
    renderInitialProducts() {
        if (!this.productGridContainer) return;

        // Pega uma mistura de produtos para exibição inicial
        const featuredProducts = this.allProducts.slice(0, 8);

        if (featuredProducts.length === 0) {
            this.productGridContainer.innerHTML = `
                        <div class="empty-message">
                            <p>Carregando produtos...</p>
                        </div>
                    `;
            return;
        }

        this.productGridContainer.innerHTML = featuredProducts.map(product =>
            this.createProductCard(product)
        ).join('');
    }

    createProductCard(product) {
        const price = typeof product.price === 'number' ?
            product.price.toFixed(2).replace('.', ',') :
            product.price || '0,00';

        return `
                    <div class="product-card" data-category="${product.category || 'unknown'}">
                        <div class="product-image" style="background-image: url('${product.img || product.image || ''}')" role="img" aria-label="${product.name || 'Produto'}" onerror="this.style.backgroundImage='url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMjEyNjJkIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOGI5NDllIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiI+SW1hZ2VtPC90ZXh0Pgo8L3N2Zz4=)'"></div>
                        <div class="product-info">
                            <h3 class="product-name">${product.name || 'Produto'}</h3>
                            <div class="product-price">R$ ${price}</div>
                            <button type="button" class="product-btn" aria-label="Adicionar ${product.name || 'produto'} ao carrinho">
                                Adicionar ao Carrinho
                            </button>
                        </div>
                    </div>
                `;
    }

    showCategoryProducts(categoryId) {
        this.showProductGrid();

        // Add fade-in animation
        this.productGridContainer.classList.remove('fade-in');
        this.productGridContainer.offsetHeight; // Force reflow
        this.productGridContainer.classList.add('fade-in');
        setTimeout(() => this.productGridContainer.classList.remove('fade-in'), 600);

        let products = [];
        let title = '';

        if (categoryId === 'consoles') {
            products = typeof consoles !== 'undefined' ? consoles : [];
            title = 'Consoles Disponíveis';
        } else if (categoryId === 'jogos') {
            products = typeof gameList !== 'undefined' ? gameList : [];
            title = 'Jogos Disponíveis';
        } else {
            this.productGridContainer.innerHTML = '<div class="empty-message"><p>Categoria não encontrada.</p></div>';
            return;
        }

        if (products.length === 0) {
            this.productGridContainer.innerHTML = `<div class="empty-message"><p>Nenhum produto disponível nesta categoria.</p></div>`;
            return;
        }

        // Update section title
        const sectionTitle = this.productsSection.querySelector('.section-title');
        if (sectionTitle) {
            sectionTitle.textContent = title;
        }

        this.productGridContainer.innerHTML = products.map(product =>
            this.createProductCard(product)
        ).join('');
    }

    // =========================
    // ERROR HANDLING
    // =========================
    showErrorMessage() {
        if (this.productGridContainer) {
            this.productGridContainer.innerHTML = `
                        <div class="error-message">
                            <p>Erro ao carregar os produtos. Verifique se os arquivos consoles.js e jogos.js estão carregados.</p>
                        </div>
                    `;
        }
    }
}

// =========================
// INICIALIZAÇÃO DA APLICAÇÃO
// =========================
document.addEventListener('DOMContentLoaded', () => {
    new GameZoneApp();
});

// =========================
// SMOOTH SCROLL POLYFILL
// =========================
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollPolyfill = function (element, to, duration) {
        const start = element.scrollTop;
        const change = to - start;
        let currentTime = 0;
        const increment = 20;

        const animateScroll = function () {
            currentTime += increment;
            const val = Math.easeInOutQuad(currentTime, start, change, duration);
            element.scrollTop = val;
            if (currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        animateScroll();
    };

    Math.easeInOutQuad = function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };
}