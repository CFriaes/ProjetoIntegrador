const menuItems = document.querySelectorAll('.item-menu');
const contentArea = document.querySelector('.text-space');

// Adiciona evento no menu
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(menuItem => menuItem.classList.remove('ativo'));
        item.classList.add('ativo');

        const endpoint = item.getAttribute('data-endpoint');

        switch (endpoint) {
            case 'criarFichaTreino':
                clearContentArea();
                document.getElementById('ficha-treino-form').style.display = 'block';
                break;

            default:
                clearContentArea();
                contentArea.textContent = 'Opção inválida!';
        }
    });
});

// Evento de envio do formulário (para salvar ficha de treino)
document.getElementById('enviarFichaTreino').addEventListener('click', async () => {
    const matricula = document.getElementById('matricula').value;

    // Coleta os exercícios de cada treino A, B, C, D
    const treinos = ['A', 'B', 'C', 'D'].map(tipo => {
        const exercicios = Array.from(document.querySelectorAll(`.exercicio[data-tipo="${tipo}"]`))
            .map(input => input.value.trim())
            .filter(value => value !== '');
        return { tipo, exercicios };
    });

    try {
        const response = await fetch(`http://localhost:8080/instrutor/criarFichaTreino/${matricula}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${credentials}` // Substitua com autenticação real
            },
            body: JSON.stringify(treinos)
        });

        if (response.ok) {
            alert('Ficha de treino criada com sucesso!');
        } else {
            const error = await response.text();
            alert(`Erro ao criar ficha de treino: ${error}`);
        }
    } catch (err) {
        console.error('Erro ao enviar ficha de treino:', err);
        alert('Erro ao enviar os dados. Verifique a conexão.');
    }
});

// Método para APAGAR uma ficha de treino
async function apagarFichaTreino() {
    const matricula = document.getElementById('matricula').value;

    if (!matricula) {
        alert('Digite a matrícula do aluno para apagar a ficha.');
        return;
    }

    if (confirm('Tem certeza que deseja apagar a ficha de treino? Esta ação não pode ser desfeita.')) {
        try {
            const response = await fetch(`http://localhost:8080/instrutor/apagarFichaTreino/${matricula}`, {
                method: 'DELETE', // Método HTTP para apagar dados
                headers: {
                    'Authorization': `Basic ${credentials}` // Autenticação
                }
            });

            if (response.ok) {
                alert('Ficha de treino apagada com sucesso!');
                clearForm(); // Limpa o formulário após apagar
            } else {
                const error = await response.text();
                alert(`Erro ao apagar ficha: ${error}`);
            }
        } catch (err) {
            console.error('Erro ao apagar ficha:', err);
            alert('Erro ao tentar apagar a ficha. Verifique a conexão.');
        }
    }
}

// Função auxiliar para limpar o formulário
function clearForm() {
    document.getElementById('matricula').value = '';
    document.querySelectorAll('.exercicio').forEach(input => input.value = '');
}

// Adicionando botões para apagar no formulário
const formContainer = document.getElementById('ficha-treino-form');
const deleteButton = document.createElement('button');
deleteButton.textContent = 'Apagar Ficha';
deleteButton.id = 'apagarFicha';
deleteButton.addEventListener('click', apagarFichaTreino);

// Adiciona o botão de apagar ao formulário
formContainer.appendChild(deleteButton);

document.addEventListener('DOMContentLoaded', () => {
    const alunosContainer = document.querySelector('.alunos-container');
    const credentials = localStorage.getItem('userCredentials');
    let cpf = null;

    const conteudoAlunos = document.querySelector('.conteudo-alunos');

    async function obterCpfInstrutor() {
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
            console.error('Erro ao obter o CPF do instrutor:', error);
        }
    }


    // Função para exibir os dados na tela (adaptada)
    function displayData(title, data) {
        conteudoAlunos.innerHTML = ''; // Limpa a área de conteúdo

        const titleElement = document.createElement('h2');
        titleElement.textContent = title;
        conteudoAlunos.appendChild(titleElement);

        if (Array.isArray(data)) {
            const dataList = document.createElement('ul');
            data.forEach((item, index) => {
                const listItem = document.createElement('li');

                if (typeof item === 'object') {
                    listItem.textContent = `Item ${index + 1}:`;
                    const nestedList = document.createElement('ul');
                    Object.entries(item).forEach(([key, value]) => {
                        const nestedListItem = document.createElement('li');
                        nestedListItem.textContent = `${key}: ${value}`;
                        nestedList.appendChild(nestedListItem);
                    });
                    listItem.appendChild(nestedList);
                } else {
                    listItem.textContent = item;
                }

                dataList.appendChild(listItem);
            });
            conteudoAlunos.appendChild(dataList);

        } else if (typeof data === 'object') {
            const dataList = document.createElement('ul');
            Object.entries(data).forEach(([key, value]) => {
                const listItem = document.createElement('li');

                if (Array.isArray(value) && value.every(item => typeof item === 'object')) {
                    listItem.textContent = `${key}:`;
                    const nestedList = document.createElement('ul');
                    value.forEach((item, index) => {
                        const nestedListItem = document.createElement('li');
                        nestedListItem.textContent = `Item ${index + 1}:`;
                        const innerList = document.createElement('ul');
                        Object.entries(item).forEach(([innerKey, innerValue]) => {
                            const innerListItem = document.createElement('li');
                            innerListItem.textContent = `${innerKey}: ${innerValue}`;
                            innerList.appendChild(innerListItem);
                        });
                        nestedListItem.appendChild(innerList);
                        nestedList.appendChild(nestedListItem);
                    });
                    listItem.appendChild(nestedList);
                } else {
                    listItem.textContent = `${key}: ${value}`;
                }

                dataList.appendChild(listItem);
            });
            conteudoAlunos.appendChild(dataList);
        } else {
            const messageElement = document.createElement('p');
            messageElement.textContent = data;
            conteudoAlunos.appendChild(messageElement);
        }
    }

    async function buscarFichaTreinoAluno(matricula) {
        try {
            const response = await fetch(`http://localhost:8080/fichas/instrutor/exercicios/${matricula}`, {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(`Erro ao buscar ficha de treino: ${message}`);
            }

            const data = await response.json();
            displayData('Ficha de Treino do Aluno', data); // Chama a função displayData para exibir a ficha de treino

        } catch (error) {
            console.error('Erro ao buscar ficha de treino do aluno:', error);
            conteudoAlunos.innerHTML = `<p>Erro ao carregar os dados: ${error.message}</p>`;
        }
    }


    async function buscarAlunos() {
        try {
            const matricula = prompt("Digite o número de matrícula do aluno:");
            if (matricula) {
                const response = await fetch(`http://localhost:8080/fichas/instrutor/exercicios/${matricula}`, {
                    headers: {
                        'Authorization': `Basic ${credentials}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const message = await response.text();
                    if (response.status === 404) {
                        if (message.includes("Ficha de treino não encontrada")) {
                            conteudoAlunos.innerHTML = `<p>${message}</p>`;
                        } else {
                            conteudoAlunos.innerHTML = `<p>Nenhum aluno encontrado com a matrícula ${matricula}.</p>`;
                        }
                    } else {
                        conteudoAlunos.innerHTML = `<p>${message}</p>`;
                    }
                } else {
                    const aluno = await response.json();
                    const alunoCard = `
                        <div class="aluno-card">
                            <h3>${aluno.nome}</h3>
                            <p>Matrícula: ${aluno.matricula}</p>
                            <p>CPF: ${aluno.cpf}</p>
                        </div>
                    `;
                    conteudoAlunos.innerHTML = alunoCard;

                    // Chama a ficha de treino diretamente
                    buscarFichaTreinoAluno(aluno.matricula);
                }
            } else {
                conteudoAlunos.innerHTML = "<p>Nenhuma matrícula informada.</p>";
            }

        } catch (error) {
            console.error('Erro ao buscar alunos:', error);
            conteudoAlunos.innerHTML = '<p>Erro ao carregar os dados.</p>';
        }
    }


    async function buscarInstrutor() {
        try {
            if (cpf === null) {
                cpf = await obterCpfInstrutor();
            }
            const response = await fetch(`http://localhost:8080/instrutor/recepcionista/cpf/${cpf}`, {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar dados do instrutor.');
            }

            const instrutor = await response.json();
            const instrutorInfo = `
                    <h2>Meus Dados</h2>
                    <p>Nome: ${instrutor.nome}</p>
                    <p>CPF: ${instrutor.cpf}</p>
                    <p>Email: ${instrutor.email}</p>
                    <p>Telefone: ${instrutor.telefone}</p>
                `;
            conteudoAlunos.innerHTML = instrutorInfo;

        } catch (error) {
            console.error('Erro ao buscar instrutor:', error);
            conteudoAlunos.innerHTML = `<p>Erro ao carregar os dados: ${error.message}</p>`;
        }
    }

    async function criarFichaTreino(matricula, dadosFicha) {
        try {
            const response = await fetch(`http://localhost:8080/fichas/instrutor/criar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosFicha)
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(`Erro ao criar ficha de treino: ${message}`);
            }

            alert('Ficha de treino criada com sucesso!');

        } catch (error) {
            console.error('Erro ao criar ficha de treino:', error);
            alert(error.message);
        }
    }


    async function atualizarFichaTreino(matricula, dadosFicha) {
        try {
            const response = await fetch(`http://localhost:8080/fichas/instrutor/atualizar/${matricula}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosFicha)
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar ficha de treino.');
            }

            alert('Ficha de treino atualizada com sucesso!');

        } catch (error) {
            console.error('Erro ao atualizar ficha de treino:', error);
            alert('Erro ao atualizar ficha de treino.');
        }
    }


    async function deletarFichaTreino(matricula) {
        try {
            const response = await fetch(`http://localhost:8080/fichas/instrutor/${matricula}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar ficha de treino.');
            }

            alert('Ficha de treino deletada com sucesso!');

        } catch (error) {
            console.error('Erro ao deletar ficha de treino:', error);
            alert('Erro ao deletar ficha de treino.');
        }
    }

    // Chama a função buscarInstrutor ao carregar a página
    buscarInstrutor(); 

    const menuItemAlunos = document.querySelector('.item-menu[data-endpoint="buscarAlunos"]');
    menuItemAlunos.addEventListener('click', () => {
        conteudoAlunos.innerHTML = '';
        buscarAlunos();
    });


    const botaoMeusDados = document.querySelector('.item-menu[data-endpoint="buscarInstrutor"]');
    if (botaoMeusDados) {
        botaoMeusDados.addEventListener('click', () => {
            conteudoAlunos.innerHTML = '';
            buscarInstrutor();
        });
    }


    const menuItemCriarFicha = document.querySelector('.item-menu[data-endpoint="criarFichaTreino"]');
    menuItemCriarFicha.addEventListener('click', () => {
        const matricula = prompt("Digite a matrícula do aluno para criar a ficha de treino:");
        if (matricula) {
            // Implementar a lógica para criar a ficha de treino
            // ... (chamar a função criarFichaTreino com a matrícula e os dados da ficha) ...
            // Exemplo:
            const dadosFicha = {
                // ... dados da ficha de treino ...
            };
            criarFichaTreino(matricula, dadosFicha); 
        } else {
            conteudoAlunos.innerHTML = "<p>Nenhuma matrícula informada.</p>";
        }
    });
});