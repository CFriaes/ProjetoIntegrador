// Elementos HTML
const menuItems = document.querySelectorAll('.item-menu'); // Itens do menu lateral
const contentArea = document.querySelector('.text-space'); // Área de texto principal

// Função para limpar a área de conteúdo
function clearContentArea() {
    contentArea.innerHTML = '';
}

// Função para exibir dados na área de conteúdo
function displayData(title, data) {
    clearContentArea();

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    contentArea.appendChild(titleElement);

    if (Array.isArray(data)) {
        const list = document.createElement('ul');
        data.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = JSON.stringify(item);
            list.appendChild(listItem);
        });
        contentArea.appendChild(list);
    } else {
        const paragraph = document.createElement('p');
        paragraph.textContent = JSON.stringify(data);
        contentArea.appendChild(paragraph);
    }
}

// Função genérica para realizar requisições e exibir dados
async function fetchData(endpoint, title) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do endpoint: ' + endpoint);
        }
        const data = await response.json();
        displayData(title, data);
    } catch (error) {
        console.error(error);
        alert('Não foi possível carregar os dados.');
    }
}

// Evento de clique para ativar um item do menu e carregar os dados correspondentes
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove a classe "ativo" de todos os itens
        menuItems.forEach(menuItem => menuItem.classList.remove('ativo'));

        // Adiciona a classe "ativo" ao item clicado
        item.classList.add('ativo');

        // Determina o endpoint com base no atributo "data-endpoint"
        const endpoint = item.getAttribute('data-endpoint');

        // Mapeia os endpoints para os métodos do backend
        switch (endpoint) {
            case 'alunos':
                fetchData('http://localhost:8080/aluno', 'Lista de Alunos');
                break;
            case 'treinos':
                const matricula = prompt('Digite a matrícula do aluno:');
                if (matricula) {
                    fetchData(`http://localhost:8080/imprimir/${matricula}`, 'Ficha de Treino');
                }
                break;
            case 'mensalidades':
                fetchData('http://localhost:8080/mensalidades', 'Mensalidades');
                break;
            default:
                alert('Opção inválida!');
        }
    });
});
