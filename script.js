document.addEventListener('DOMContentLoaded', function () {
    const btn = document.querySelector('.btn');
    const productsSection = document.querySelector('#produtos');
    const list = document.querySelector('.products');
    const cardConsoles = document.querySelector('#consoles');
    const cardGames = document.querySelector('#jogos');

    if (btn && productsSection) {
        btn.addEventListener('click', function (event) {
            event.preventDefault();
            productsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            console.log('Scroll ativado');
        });
    } else {
        console.log('Elementos não encontrados', {
            btn: !!btn,
            productsSection: !!productsSection
        });
    }

    if (cardConsoles) {
        cardConsoles.onclick = function () {
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
        };
    } else {
        return alert('Erro ao carregar consoles');
    }

    if (cardGames) {
        cardGames.onclick = function () {
            list.innerHTML = `
            
            <div class="container">
                    <h2 class="section-title">Jogos Disponíveis</h2>
                    <div class="product-grid">
                        ${gameList.map(games => `
                            <div class="product-card">
                                <div class="product-image" style="background-image: url('${games.img}')"></div>
                                <div class="product-info">
                                    <h3 class="product-name">${games.name}</h3>
                                    <div class="product-price">R$ ${games.price.toFixed(2)}</div>
                                    <button class="product-btn">Adicionar ao Carrinho</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            
    
            `
        }
    } else {
        return alert('Erro ao carregar jogos');
    }
});