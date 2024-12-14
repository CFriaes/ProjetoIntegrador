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
        // ... (código para array permanece o mesmo) ...
    } else {
        const dataList = document.createElement('ul'); // Cria uma lista não ordenada
        Object.entries(data).forEach(([key, value]) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${key}: ${value}`;
            dataList.appendChild(listItem);
        });
        contentArea.appendChild(dataList);
    }
}

// Função genérica para realizar requisições e exibir dados
async function fetchData(endpoint, title) {
    const credentials = localStorage.getItem('userCredentials'); // Recupera as credenciais

    try {
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': `Basic ${credentials}`, // Inclui as credenciais no cabeçalho
                'Content-Type': 'application/json'
            }
        });
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

// Função para obter o CPF do usuário logado
async function getCpf() {
    const credentials = localStorage.getItem('userCredentials');
    try {
        const response = await fetch('http://localhost:8080/api/current-user', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Erro ao obter dados do usuário.');
        }
        const data = await response.json();
        return data.cpf; // Retorna o CPF do usuário
    } catch (error) {
        console.error('Erro ao obter o CPF:', error);
        // Tratar o erro adequadamente (ex: exibir mensagem, redirecionar)
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
            case 'Dados':
                (async () => { // Usando uma função assíncrona imediata
                    const cpf = await getCpf(); // Aguarda a obtenção do CPF
                    if (cpf) {
                        fetchData(`http://localhost:8080/aluno/recepcionista/cpf/${cpf}`, 'Lista de Alunos');
                    }
                })();
                break;
            case 'treinos':
                const matricula = prompt('Digite a matrícula do aluno:');
                if (matricula) {
                    fetchData(`http://localhost:8080/fichas/aluno/exercicios/${matricula}`, 'Ficha de Treino'); // Corrigido endpoint para treinos
                }
                break;
            case 'Mensalidade': // Corrigido para 'Mensalidade'
                (async () => {
                    const cpf = await getCpf();
                    if (cpf) {
                        fetchData(`http://localhost:8080/aluno/recepcionista/verificarVencimento/${cpf}`, 'Mensalidades'); // Corrigido endpoint para mensalidades
                    }
                })();
                break;
            default:
                alert('Opção inválida!');
        }
    });
});