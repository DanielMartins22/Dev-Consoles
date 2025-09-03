document.addEventListener('DOMContentLoaded', function () {
    const btn = document.querySelector('.btn');
    const productsSection = document.querySelector('#produtos');
    const list = document.querySelector('.products');
    const cardConsoles = document.querySelector('#consoles');
    const cardGames = document.querySelector('#jogos');
    const allProductCards = document.querySelectorAll('.product-card'); // ← MUDANÇA: Seleciona TODOS os cards
    const btnHome = document.querySelector('#liHome')
    const homePage = document.querySelector('#home')
    const btnConsoles = document.querySelector('#liConsoles')
    const divCarrosel = document.querySelector('.carrossel-container');
    const carrossel = document.querySelector('.carrossel'); // ← MUDANÇA: Seleciona o carrossel completo
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');



    if (btn && productsSection) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({ top: productsSection.offsetTop, left: 0, behavior: 'smooth' });
            }
        })



    } else {

    }

    if (btnHome && homePage) {
        btnHome.addEventListener('click', function (e) {
            e.preventDefault();
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }
        })
    } else {
        // falback para navegadores antigos

        window.scrollTo(0, 0)
    }

    let addEventListener = false

    // Mosta os cards
    function showCarroselConsoles() {
        let currentIndex = 0;
        divCarrosel.innerHTML = ''; // Limpa o conteudo 

        allProductCards.forEach(card => {
            card.style.display = 'block'; // ← MUDANÇA: Mostra todos os cards

        });

        carrossel.style.display = 'block'; // ← MUDANÇA: Mostra o carrossel completo
        divCarrosel.style.display = 'block'; // ← MUDANÇA: Mostra o contêiner do carrossel

        btnConsoles.forEach((console, index) => {
            const card = document.createElement('div');
            card.classList.add(card)
            if (index === 0) card.classList.add('active');

            card.innerHTML`
            <img src="${console.img}" alt="${console.name}"/>
            <h3>${console.name}</h3>
            <div class="price">R$ ${console.price.toFixed(2).replace('.', ',')}</div> 
            <button type="button" class="product-btn" aria-label="Adicionar ${console.name} ao carrinho">Adicionar ao Carrinho</button>
            `
            divCarrosel.appendChild(card);


        })

        const cards = document.querySelectorAll('.card')

        function showCard(index) {
            cards.forEach((card, i) => {
                card.classList.toggle('active', i === index);
            })
        }

        if (!addEventListener) {
            prevBtn.addEventListener('click', function () {
                currentIndex = (currentIndex - 1 + cards.length) % cards.length
                showCard(currentIndex)
            })

            nextBtn.addEventListener('click', function () {
                currentIndex = (currentIndex + 1) % cards.length
                showCard(currentIndex)
            })
            addEventListener = true
        }
    }

    btnConsoles.addEventListener('click', showCarroselConsoles);



    document.querySelectorAll('.category-card').forEach(card => {

        card.addEventListener('click', function () {

            list.classList.add('fade-in')
            setTimeout(() => list.classList.remove('fade-ind'), 400)
            list.innerHTML = ''; // Limpa a lista de produtos

            if (card.id === 'consoles') {
                list.innerHTML = `
            <div class="container">
                <h2 class= "section-title">Consoles Disponíveis</h2>
                <div class= "product-grid">
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

            `
            } else if (card.id === 'jogos') {

                list.innerHTML = `
            <div class="container">
                <h2 class= "section-title">Jogos Disponíveis</h2>
                <div class= "product-grid">
                 ${gameList.map(game => `
                            <div class="product-card">
                                <div class="product-image" style="background-image: url('${game.img}')" role="img" aria-label="${game.name}"></div>
                                <div class="product-info">
                                    <h3 class="product-name">${game.name}</h3>
                                    <div class="product-price">R$ ${game.price.toFixed(2)}</div>
                                    <button type= "button" class="product-btn">Adicionar ao Carrinho</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
            </div>
`
            } else {
                list.innerHTML = `<p class="empty-message">Categoria não reconhecida.</p>`;
            }
        })

    })


});