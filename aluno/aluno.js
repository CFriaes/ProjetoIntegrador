// Elementos HTML
const menuItems = document.querySelectorAll('.item-menu');
const contentArea = document.querySelector('.text-space');

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
        // ... (código para array) ...
    } else if (typeof data === 'object') { // Verifica se é um objeto
        const dataList = document.createElement('ul');
        Object.entries(data).forEach(([key, value]) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${key}: ${value}`;
            dataList.appendChild(listItem);
        });
        contentArea.appendChild(dataList);
    } else { // Caso seja uma string (mensagem de erro)
        const messageElement = document.createElement('p'); 
        messageElement.textContent = data; 
        contentArea.appendChild(messageElement); 
    }
}

// Declara a variável credentials globalmente
const credentials = localStorage.getItem('userCredentials'); 

// Função genérica para realizar requisições e exibir dados
async function fetchData(endpoint, title) {
    const credentials = localStorage.getItem('userCredentials');

    try {
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                displayData(title, "Ficha de treino não encontrada");
            } else if (response.status === 400) {
                const message = await response.text(); // Lê a resposta como texto
                displayData(title, message); // Exibe a mensagem
            } else {
                throw new Error('Erro ao buscar dados do endpoint: ' + endpoint);
            }
        } else {
            // Lê a resposta como texto apenas se o status for 200 (OK) e o endpoint for verificarVencimento
            if (response.status === 200 && endpoint.includes('verificarVencimento')) { 
                const data = await response.text();
                displayData(title, data);
            } else {
                const data = await response.json(); // Tenta ler como JSON para outros status
                displayData(title, data);
            }
        }

        const data = await response.json();
        displayData(title, data);

    } catch (error) {
        console.error(error);
        if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
            displayData(title, "Erro ao analisar a resposta JSON."); // Ou uma mensagem de erro genérica
        } 
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
        return data.cpf;
    } catch (error) {
        console.error('Erro ao obter o CPF:', error);
    }
}

// Evento de clique para ativar um item do menu e carregar os dados correspondentes
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(menuItem => menuItem.classList.remove('ativo'));
        item.classList.add('ativo');

        const endpoint = item.getAttribute('data-endpoint');

        switch (endpoint) {
            case 'Dados':
                (async () => {
                    const cpf = await getCpf();
                    if (cpf) {
                        fetchData(`http://localhost:8080/aluno/recepcionista/cpf/${cpf}`, 'Lista de Alunos');
                    }
                })();
                break;

                case 'treinos':
                    (async () => {
                        const cpf = await getCpf(); // Obtém o CPF do usuário logado
                        if (cpf) {
                            try {
                                // Faz uma requisição para obter os dados do aluno
                                const response = await fetch(`http://localhost:8080/aluno/recepcionista/cpf/${cpf}`, {
                                    headers: {
                                        'Authorization': `Basic ${credentials}`,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                if (!response.ok) {
                                    throw new Error('Erro ao buscar dados do aluno.');
                                }
                                const aluno = await response.json();
                                const matricula = parseInt(aluno.matricula); // Obtém a matrícula do aluno
            
                                fetchData(`http://localhost:8080/fichas/aluno/exercicios/${matricula}`, 'Ficha de Treino');
            
                            } catch (error) {
                                console.error('Erro ao obter dados do aluno:', error);
                                alert('Não foi possível carregar os dados.');
                            }
                        }
                    })();
                    break;

              case 'Mensalidade':
                (async () => {
                    const cpf = await getCpf();
                    if (cpf) {
                        // Chama fetchData com o endpoint correto para mensalidade
                        fetchData(`http://localhost:8080/aluno/recepcionista/verificarVencimento/${cpf}`, 'Mensalidades'); 
                    }
                })();
                break;

                case 'imprimirTreino':
                    (async () => {
                        const cpf = await getCpf(); // Obtém o CPF do usuário logado
                        if (cpf) {
                            try {
                                // Faz uma requisição para obter os dados do aluno
                                const response = await fetch(`http://localhost:8080/aluno/recepcionista/cpf/${cpf}`, {
                                    headers: {
                                        'Authorization': `Basic ${credentials}`,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                if (!response.ok) {
                                    throw new Error('Erro ao buscar dados do aluno.');
                                }
                                const aluno = await response.json();
                                const matricula = aluno.matricula; // Obtém a matrícula do aluno
    
                                // Chama fetchData com a matrícula do aluno
                                fetchData(`http://localhost:8080/fichas/imprimir/${matricula}`, 'Imprimir Treino');
    
                            } catch (error) {
                                console.error('Erro ao obter dados do aluno:', error);
                                alert('Não foi possível carregar os dados.');
                            }
                        }
                    })();
                    break;

            default:
                alert('Opção inválida!');
        }
    });
});