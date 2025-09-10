document.addEventListener('DOMContentLoaded', function () {
    // Seletores principais
    const btn = document.querySelector('.btn');
    const productsSection = document.querySelector('#produtos');
    const list = document.querySelector('.products');
    const allProductCards = document.querySelectorAll('.product-card');
    const btnHome = document.querySelector('#liHome');
    const homePage = document.querySelector('#home');
    const btnConsoles = document.querySelector('#liConsoles');
    const btnGames = document.querySelector('#liGames')
    const divCarrosel = document.querySelector('.carrossel-container');
    const carrossel = document.querySelector('.carrossel');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const categoryCards = document.querySelectorAll('.category-card');

    // Variáveis globais do carrossel
    let currentIndex = 0;
    let currentCards = [];
    let eventosListener = false;

    // Scroll suave para seção de produtos
    if (btn && productsSection) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({ top: productsSection.offsetTop, left: 0, behavior: 'smooth' });
            } else {
                window.scrollTo(0, productsSection.offsetTop);
            }
        });
    }

    // Scroll para topo e recarrega a página
    if (btnHome && homePage) {
        btnHome.addEventListener('click', function (e) {
            e.preventDefault();
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                window.scrollTo(0, 0);
                window.location.reload();
            }
        });
    }

    // Função para mostrar um card específico
    function showCard(index) {
        currentCards.forEach((card, i) => {
            card.classList.remove('active');
        });

        // Pequeno delay para a animação de saída
        setTimeout(() => {
            if (currentCards[index]) {
                currentCards[index].classList.add('active');
            }
        }, 100);
    }

    // Configurar event listeners do carrossel (apenas uma vez)
    function setupCarroselEvents() {
        if (!eventosListener && prevBtn && nextBtn) {
            prevBtn.addEventListener('click', function () {
                currentIndex = (currentIndex - 1 + currentCards.length) % currentCards.length;
                showCard(currentIndex);
            });

            nextBtn.addEventListener('click', function () {
                currentIndex = (currentIndex + 1) % currentCards.length;
                showCard(currentIndex);
            });

            eventosListener = true;
        }
    }

    // Função para mostrar o carrossel de consoles
    function showCarroselConsoles() {
        currentIndex = 0;
        divCarrosel.innerHTML = '';
        currentCards = []; // Reset do array

        // Esconde os cards do grid
        allProductCards.forEach(card => card.style.display = 'none');

        // Mostra o carrossel
        carrossel.style.display = 'block';
        divCarrosel.style.display = 'block';

        // Cria apenas os cards de CONSOLES
        consoles.forEach((console, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            if (index === 0) card.classList.add('active');

            card.innerHTML = `
                <img src="${console.img}" alt="${console.name}"/>
                <h3>${console.name}</h3>
                <div class="price">R$ ${console.price.toFixed(2).replace('.', ',')}</div> 
                <button type="button" class="product-btn" aria-label="Adicionar ${console.name} ao carrinho">Adicionar ao Carrinho</button>
            `;
            
            divCarrosel.appendChild(card);
            currentCards.push(card); // Adiciona ao array de controle
        });

        // Configura os eventos apenas uma vez
        setupCarroselEvents();
    }

    // Função para mostrar o carrossel de jogos
    function showCarroselGames() {
        currentIndex = 0;
        divCarrosel.innerHTML = '';
        currentCards = []; // Reset do array

        // Esconde os cards do grid
        allProductCards.forEach(card => card.style.display = 'none');

        // Mostra o carrossel
        carrossel.style.display = 'block';
        divCarrosel.style.display = 'block';

        // Cria apenas os cards de JOGOS
        gameList.forEach((game, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            if (index === 0) card.classList.add('active');

            card.innerHTML = `
                <img src="${game.img}" alt="${game.name}"/>
                <h3>${game.name}</h3>
                <div class="price">R$ ${game.price.toFixed(2).replace('.', ',')}</div>
                <button type="button" class="product-btn" aria-label="Adicionar ${game.name} ao carrinho">Adicionar ao Carrinho</button>
            `;
            
            divCarrosel.appendChild(card);
            currentCards.push(card); // Adiciona ao array de controle
        });

        // Configura os eventos apenas uma vez
        setupCarroselEvents();
    }

    // Event listeners separados para cada botão
    if (btnConsoles) {
        btnConsoles.addEventListener('click', showCarroselConsoles);
    }

    if (btnGames) {
        btnGames.addEventListener('click', showCarroselGames);
    }

    // Função para mostrar todos os produtos
    function showAllProducts() {
        carrossel.style.display = 'none';
        divCarrosel.style.display = 'none';
        allProductCards.forEach(card => {
            card.style.display = 'flex';
        });
    }

    // Exibe produtos por categoria
    categoryCards.forEach(card => {
        card.addEventListener('click', function () {
            showAllProducts();
            
            // Animação fade-in corrigida
            list.classList.remove('fade-in');
            list.offsetHeight; // força reflow
            list.classList.add('fade-in');
            setTimeout(() => list.classList.remove('fade-in'), 400);
            
            list.innerHTML = '';

            if (card.id === 'consoles') {
                list.innerHTML = `
                    <div class="container">
                        <h2 class="section-title">Consoles Disponíveis</h2>
                        <div class="product-grid">
                            ${consoles.map(console => `
                                <div class="product-card">
                                    <div class="product-image" style="background-image: url('${console.img}')"></div>
                                    <div class="product-info">
                                        <h3 class="product-name">${console.name}</h3>
                                        <div class="product-price">R$ ${console.price.toFixed(2)}</div>
                                        <button class="product-btn">Adicionar ao Carrinho</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            } else if (card.id === 'jogos') {
                list.innerHTML = `
                    <div class="container">
                        <h2 class="section-title">Jogos Disponíveis</h2>
                        <div class="product-grid">
                            ${gameList.map(game => `
                                <div class="product-card">
                                    <div class="product-image" style="background-image: url('${game.img}')" role="img" aria-label="${game.name}"></div>
                                    <div class="product-info">
                                        <h3 class="product-name">${game.name}</h3>
                                        <div class="product-price">R$ ${game.price.toFixed(2)}</div>
                                        <button type="button" class="product-btn">Adicionar ao Carrinho</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            } else {
                list.innerHTML = `<p class="empty-message">Categoria não reconhecida.</p>`;
            }
        });
    });
});