// =========================
// AGUARDA CARREGAMENTO DOS DADOS EXTERNOS
// =========================

// Esta função espera os dados serem carregados antes de continuar
// É uma função ASSÍNCRONA - ou seja, ela não bloqueia o resto do código
function waitForData() {
    // Promise = Promessa. É como dizer "eu prometo que vou fazer isso, mas pode demorar"
    // resolve = função que será chamada quando tudo estiver pronto
    return new Promise((resolve) => {

        // Função que verifica se os dados já foram carregados
        const checkData = () => {
            // typeof = verifica o TIPO de uma variável
            // 'undefined' = não existe ainda
            // !== = diferente de
            // Traduzindo: "se consoles E gameList NÃO são indefinidos, então existem!"
            if (typeof consoles !== 'undefined' && typeof gameList !== 'undefined') {
                resolve(); // Dados prontos! Chama resolve() para liberar a Promise
            } else {
                // Se ainda não estão prontos, espera 50 milissegundos e tenta de novo
                setTimeout(checkData, 50); // Chama checkData() novamente após 50ms
            }
        };

        checkData(); // Inicia a verificação pela primeira vez
    });
}

// =========================
// CLASSE PRINCIPAL DA APLICAÇÃO
// =========================
// class = molde/template para criar objetos
class GameZoneApp {
    // constructor = função especial que roda quando criamos um novo objeto desta classe
    constructor() {
        // this = "este objeto atual"
        // this.currentIndex = propriedade deste objeto específico
        this.currentIndex = 0; // Índice do card atual no carrossel (começa em 0)
        this.currentCards = []; // Array vazio que vai guardar os cards do carrossel
        this.carouselInitialized = false; // Marca se o carrossel já foi configurado
        this.allProducts = []; // Array que vai guardar todos os produtos (consoles + jogos)
        this.init(); // Chama a função de inicialização
    }

    // =========================
    // INICIALIZAÇÃO
    // =========================
    // async = marca que esta função é ASSÍNCRONA
    // Funções assíncronas podem usar 'await' dentro delas
    async init() {
        try { // try = tenta fazer isso
            // await = ESPERA esta função terminar antes de continuar
            // Pausa aqui até waitForData() terminar
            await waitForData();

            // Só continua quando os dados estiverem prontos
            this.combineProducts(); // Junta consoles e jogos em um array só
            this.cacheElements(); // Guarda referências dos elementos HTML
            this.bindEvents(); // Configura os eventos (cliques, etc)
            this.renderInitialProducts(); // Mostra os produtos na tela
        } catch (error) { // catch = se der erro, faz isso
            console.error('Erro ao inicializar a aplicação:', error); // Mostra erro no console
            this.showErrorMessage(); // Mostra mensagem de erro na tela
        }
    }

    // =========================
    // COMBINA PRODUTOS DE DIFERENTES FONTES
    // =========================
    combineProducts() {
        this.allProducts = []; // Reseta o array de produtos

        // typeof consoles = verifica se a variável 'consoles' existe
        // !== 'undefined' = não é indefinida (existe)
        // Array.isArray() = verifica se é um array (lista)
        if (typeof consoles !== 'undefined' && Array.isArray(consoles)) {
            // .map() = transforma cada item do array
            // item => ({...item, category: 'console'}) = para cada item, cria novo objeto
            // ...item = spread operator - copia todas as propriedades do item
            // category: 'console' = adiciona nova propriedade 'category'
            // .push(...array) = adiciona todos os itens do array de uma vez
            this.allProducts.push(...consoles.map(item => ({ ...item, category: 'console' })));
        }

        // Faz o mesmo com os jogos
        if (typeof gameList !== 'undefined' && Array.isArray(gameList)) {
            this.allProducts.push(...gameList.map(item => ({ ...item, category: 'game' })));
        }
    }

    // =========================
    // CACHE DOS ELEMENTOS DOM
    // =========================
    // "Cachear" = guardar em variáveis para não precisar buscar no HTML toda hora
    cacheElements() {
        // document.querySelector() = busca UM elemento no HTML pelo seletor CSS
        // this.btnHome = guarda o botão Home nesta propriedade do objeto
        this.btnHome = document.querySelector('#liHome'); // # = busca por ID
        this.btnConsoles = document.querySelector('#liConsoles');
        this.btnGames = document.querySelector('#liGames');
        this.btnSobre = document.querySelector('#liSobre');

        // .querySelectorAll() = busca TODOS os elementos que correspondem ao seletor
        // Retorna um NodeList (parecido com array)
        this.btnContact = document.querySelectorAll('.liContact'); // . = busca por classe

        // Guarda as seções principais
        this.homePage = document.querySelector('main');
        this.productsSection = document.querySelector('#produtos');

        // Guarda elementos dos produtos
        this.productGridContainer = document.querySelector('.product-grid');
        this.categoryCards = document.querySelectorAll('.category-card');

        // Guarda elementos do carrossel
        this.carousel = document.querySelector('.carrossel');
        this.carouselContainer = document.querySelector('.carrossel-container');
        this.prevBtn = document.querySelector('.prev'); // Botão anterior
        this.nextBtn = document.querySelector('.next'); // Botão próximo

        // Guarda botão do hero
        this.heroBtn = document.querySelector('.btn');
    }

    // =========================
    // VINCULA EVENTOS
    // =========================
    bindEvents() {
        // Hero button
        // if = se o botão existir (foi encontrado no HTML)
        if (this.heroBtn) {
            // .addEventListener() = escuta por um evento
            // 'click' = quando clicar
            // (e) => {} = arrow function - função anônima moderna
            // e = evento (objeto com informações sobre o clique)
            this.heroBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Previne comportamento padrão do link
                this.scrollToProducts(); // Chama função para rolar até produtos
            });
        }

        // Navigation buttons (Botões de navegação)
        if (this.btnHome) {
            this.btnHome.addEventListener('click', (e) => {
                e.preventDefault(); // Para o comportamento padrão
                this.goHome(); // Vai para o topo e recarrega
            });
        }

        if (this.btnConsoles) {
            this.btnConsoles.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToProducts(); // Rola até seção de produtos
                // setTimeout() = espera X milissegundos antes de executar
                // 300 = 300 milissegundos = 0.3 segundos
                setTimeout(() => this.showCarouselConsoles(), 300); // Espera rolar, depois mostra carrossel
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
                this.showAboutSection(); // Mostra seção "Sobre"
            });
        }

        // Contact buttons - pode ter vários botões de contato
        // .forEach() = para cada item da lista, executa esta função
        this.btnContact.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showContactSection(); // Mostra seção de contato
            });
        });

        // Category cards - cards de categorias (consoles/jogos)
        this.categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                this.showCategoryProducts(card.id); // Mostra produtos da categoria clicada
                this.scrollToProducts();
            });
        });

        // Initialize carousel events
        this.initCarouselEvents(); // Configura eventos do carrossel
    }

    // =========================
    // CAROUSEL EVENTS (Eventos do Carrossel)
    // =========================
    initCarouselEvents() {
        // Verifica se os botões existem E se ainda não foi inicializado
        // && = E (operador lógico)
        // ! = NÃO (inverte o valor booleano)
        if (this.prevBtn && this.nextBtn && !this.carouselInitialized) {
            // Botão anterior
            this.prevBtn.addEventListener('click', () => this.previousSlide());
            // Botão próximo
            this.nextBtn.addEventListener('click', () => this.nextSlide());

            // Touch events for mobile (Eventos de toque para celular)
            this.prevBtn.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Previne scroll acidental
                this.previousSlide();
            });
            this.nextBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.nextSlide();
            });

            // Keyboard navigation (Navegação por teclado)
            // Escuta evento no documento inteiro
            document.addEventListener('keydown', (e) => {
                // Se o carrossel estiver visível
                if (this.carousel.style.display !== 'none') {
                    // e.key = qual tecla foi pressionada
                    if (e.key === 'ArrowLeft') this.previousSlide(); // Seta esquerda
                    if (e.key === 'ArrowRight') this.nextSlide(); // Seta direita
                }
            });

            this.carouselInitialized = true; // Marca como inicializado para não repetir
        }
    }

    // =========================
    // NAVIGATION METHODS (Métodos de Navegação)
    // =========================
    scrollToProducts() {
        if (this.productsSection) { // Se a seção existe
            // .scrollIntoView() = rola a página até este elemento
            this.productsSection.scrollIntoView({
                behavior: 'smooth', // Rolagem suave (animada)
                block: 'start' // Alinha no topo
            });
        }
    }

    goHome() {
        // window.scrollTo() = rola a janela para uma posição
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Vai para o topo
        // Espera 800ms e recarrega a página
        setTimeout(() => window.location.reload(), 800);
    }

    // =========================
    // CAROUSEL METHODS (Métodos do Carrossel)
    // =========================
    showCard(index) {
        // Se não há cards, não faz nada
        if (!this.currentCards.length) return;

        // Para cada card da lista
        this.currentCards.forEach(card => {
            // .classList.remove() = remove a classe CSS
            card.classList.remove('active'); // Remove classe 'active'
            card.style.display = 'none'; // Esconde o card
        });

        // setTimeout = espera um pouco antes de executar
        setTimeout(() => {
            // Se o card no índice especificado existe
            if (this.currentCards[index]) {
                this.currentCards[index].style.display = 'flex'; // Mostra o card
                // .classList.add() = adiciona classe CSS
                this.currentCards[index].classList.add('active'); // Adiciona classe 'active'
            }
        }, 50); // Espera 50 milissegundos
    }

    previousSlide() {
        if (this.currentCards.length > 0) {
            // Operador % = módulo (resto da divisão)
            // Exemplo: se currentIndex = 0 e length = 5
            // (0 - 1 + 5) % 5 = 4 % 5 = 4 (vai para o último)
            this.currentIndex = (this.currentIndex - 1 + this.currentCards.length) % this.currentCards.length;
            this.showCard(this.currentIndex); // Mostra o card calculado
        }
    }

    nextSlide() {
        if (this.currentCards.length > 0) {
            // Exemplo: se currentIndex = 4 e length = 5
            // (4 + 1) % 5 = 5 % 5 = 0 (volta para o primeiro)
            this.currentIndex = (this.currentIndex + 1) % this.currentCards.length;
            this.showCard(this.currentIndex);
        }
    }

    createCarouselCard(item) {
        // document.createElement() = cria um elemento HTML novo
        const card = document.createElement('div'); // Cria uma <div>
        card.classList.add('card'); // Adiciona classe 'card'

        // Operador ternário: condição ? se_verdadeiro : se_falso
        // typeof item.price === 'number' = verifica se price é um número
        const price = typeof item.price === 'number' ?
            item.price.toFixed(2).replace('.', ',') : // Se for número: formata com 2 casas decimais e troca . por ,
            item.price || '0,00'; // Se não for: usa o valor que tem OU '0,00' se estiver vazio

        // .innerHTML = define o conteúdo HTML interno
        // Template literals (`` com ${}) = strings que permitem variáveis dentro
        card.innerHTML = `
            <img src="${item.img || item.image || ''}" 
                 alt="${item.name || 'Produto'}" 
                 loading="lazy" 
                 onerror="this.src='data:image/svg+xml;base64,...'"/>
            <h3>${item.name || 'Produto'}</h3>
            <div class="price">R$ ${price}</div> 
            <button type="button" class="product-btn" 
                    aria-label="Adicionar ${item.name || 'produto'} ao carrinho">
                Adicionar ao Carrinho
            </button>
        `;

        return card; // Retorna o card criado
    }

    showCarouselConsoles() {
        this.resetCarousel(); // Limpa o carrossel
        this.hideProductGrid(); // Esconde a grade de produtos
        this.carousel.style.display = 'block'; // Mostra o carrossel

        // Operador ternário: se consoles existe, usa ele, senão usa array vazio []
        const consolesData = typeof consoles !== 'undefined' ? consoles : [];

        // Se não há consoles
        if (consolesData.length === 0) {
            this.showEmptyCarousel('Nenhum console disponível');
            return; // Para a execução da função aqui
        }

        // Para cada console, com índice
        consolesData.forEach((console, index) => {
            const card = this.createCarouselCard(console); // Cria o card
            if (index === 0) card.classList.add('active'); // Primeiro card fica ativo
            this.carouselContainer.appendChild(card); // Adiciona card ao container
            this.currentCards.push(card); // Adiciona card ao array
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
        // Define HTML diretamente (substitui tudo que estava lá)
        this.carouselContainer.innerHTML = `
            <div class="empty-carousel">
                <p>${message}</p>
            </div>
        `;
    }

    resetCarousel() {
        this.currentIndex = 0; // Volta para o primeiro
        this.currentCards = []; // Limpa array de cards
        if (this.carouselContainer) {
            this.carouselContainer.innerHTML = ''; // Remove todo o conteúdo HTML
        }
    }

    hideProductGrid() {
        if (this.productGridContainer) {
            this.productGridContainer.style.display = 'none'; // Esconde
        }
    }

    showProductGrid() {
        if (this.carousel) {
            this.carousel.style.display = 'none'; // Esconde carrossel
        }
        if (this.productGridContainer) {
            this.productGridContainer.style.display = 'grid'; // Mostra grade
        }
    }

    // =========================
    // CONTENT SECTIONS (Seções de Conteúdo)
    // =========================
    showAboutSection() {
        this.showProductGrid();

        // Rola para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Espera 300ms e substitui o conteúdo
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
    // PRODUCT RENDERING (Renderização de Produtos)
    // =========================
    renderInitialProducts() {
        if (!this.productGridContainer) return; // Se não existe, sai da função

        // .slice(0, 8) = pega os primeiros 8 itens do array
        const featuredProducts = this.allProducts.slice(0, 8);

        if (featuredProducts.length === 0) {
            this.productGridContainer.innerHTML = `
                <div class="empty-message">
                    <p>Carregando produtos...</p>
                </div>
            `;
            return;
        }

        // .map() = transforma cada produto em HTML
        // .join('') = junta todos os HTMLs em uma string só
        this.productGridContainer.innerHTML = featuredProducts.map(product =>
            this.createProductCard(product)
        ).join('');
    }

    createProductCard(product) {
        // Formata o preço
        const price = typeof product.price === 'number' ?
            product.price.toFixed(2).replace('.', ',') :
            product.price || '0,00';

        // Retorna string HTML do card
        return `
            <div class="product-card" data-category="${product.category || 'unknown'}">
                <div class="product-image" 
                     style="background-image: url('${product.img || product.image || ''}')" 
                     role="img" 
                     aria-label="${product.name || 'Produto'}"></div>
                <div class="product-info">
                    <h3 class="product-name">${product.name || 'Produto'}</h3>
                    <div class="product-price">R$ ${price}</div>
                    <button type="button" class="product-btn" 
                            aria-label="Adicionar ${product.name || 'produto'} ao carrinho">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        `;
    }

    showCategoryProducts(categoryId) {
        this.showProductGrid();

        // Remove e adiciona classe para animar
        this.productGridContainer.classList.remove('fade-in');
        this.productGridContainer.offsetHeight; // Force reflow (truque para resetar animação)
        this.productGridContainer.classList.add('fade-in');
        setTimeout(() => this.productGridContainer.classList.remove('fade-in'), 600);

        let products = []; // Vai guardar os produtos filtrados
        let title = ''; // Vai guardar o título da seção

        // Decide qual categoria mostrar baseado no ID
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

        // Atualiza o título da seção
        const sectionTitle = this.productsSection.querySelector('.section-title');
        if (sectionTitle) {
            sectionTitle.textContent = title; // .textContent = texto puro (sem HTML)
        }

        // Renderiza os produtos
        this.productGridContainer.innerHTML = products.map(product =>
            this.createProductCard(product)
        ).join('');
    }

    // =========================
    // ERROR HANDLING (Tratamento de Erros)
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
// Espera o DOM (HTML) estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // new = cria uma nova instância da classe GameZoneApp
    // Isso executa o constructor(), que por sua vez executa init()
    new GameZoneApp();
});

// =========================
// SMOOTH SCROLL POLYFILL
// =========================
// Polyfill = código que adiciona funcionalidade que navegadores antigos não têm
// Verifica se o navegador já suporta scrollBehavior
if (!('scrollBehavior' in document.documentElement.style)) {
    // Se não suporta, cria função personalizada
    const smoothScrollPolyfill = function (element, to, duration) {
        const start = element.scrollTop; // Posição atual do scroll
        const change = to - start; // Quanto precisa mover
        let currentTime = 0; // Tempo decorrido
        const increment = 20; // Incremento de tempo

        // Função que anima o scroll
        const animateScroll = function () {
            currentTime += increment;
            // Calcula próxima posição usando easing (suavização)
            const val = Math.easeInOutQuad(currentTime, start, change, duration);
            element.scrollTop = val; // Define nova posição
            // Se ainda não terminou, continua animando
            if (currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        animateScroll(); // Inicia a animação
    };

    // Função de easing (suavização) - cria efeito de aceleração/desaceleração
    // t = tempo atual, b = valor inicial, c = mudança total, d = duração
    Math.easeInOutQuad = function (t, b, c, d) {
        t /= d / 2; // Divide tempo pela metade
        if (t < 1) return c / 2 * t * t + b; // Primeira metade: acelera
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b; // Segunda metade: desacelera
    };
}