document.addEventListener('DOMContentLoaded', () => {
    const alunosContainer = document.querySelector('.alunos-container');
    const credentials = localStorage.getItem('userCredentials'); // Obtém as credenciais de login
    let cpf = null;

    // Mova esta linha para dentro do DOMContentLoaded:
    const conteudoAlunos = document.querySelector('.conteudo-alunos'); // Seleciona a nova div

    // Função para obter o CPF do instrutor logado
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
            return data.cpf; // Retorna o CPF do instrutor

        } catch (error) {
            console.error('Erro ao obter o CPF do instrutor:', error);
            // Trate o erro, exiba uma mensagem na tela, etc.
        }
    }
    
    // Função para buscar dados da API e exibir na tela
    async function fetchData(url, title, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                },
                ...options
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(`Erro ao buscar dados da API: ${message}`);
            }

            const data = await response.json();

            let contentHTML = `<h2>${title}</h2>`;
            if (Array.isArray(data)) {
                contentHTML += '<ul>';
                data.forEach(item => {
                    contentHTML += `<li>${JSON.stringify(item)}</li>`;
                });
                contentHTML += '</ul>';
            } else {
                contentHTML += `<p>${JSON.stringify(data)}</p>`;
            }

            conteudoAlunos.innerHTML = contentHTML; // Define o conteúdo na div correta

        } catch (error) {
            console.error(error);
            conteudoAlunos.innerHTML = `<p>Erro ao carregar os dados: ${error.message}</p>`;
        }
    }

    // Metodo responsável por buscar alunos
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
                    // Captura a mensagem de erro do backend
                    const message = await response.text(); 
            
                    if (response.status === 404) {
                        // Verifica se a mensagem de erro é sobre a ficha de treino
                        if (message.includes("Ficha de treino não encontrada")) {  
                            conteudoAlunos.innerHTML = `<p>${message}</p>`; // Exibe a mensagem do backend
                        } else {
                            conteudoAlunos.innerHTML = `<p>Nenhum aluno encontrado com a matrícula ${matricula}.</p>`;
                        }
                    } else {
                        // Exibe a mensagem de erro do backend na tela
                        conteudoAlunos.innerHTML = `<p>${message}</p>`; 
                    }
                } else {
                    const aluno = await response.json();
                    const alunoCard = `
                        <div class="aluno-card">
                            <h3>${aluno.nome}</h3>
                            <p>Matrícula: ${aluno.matricula}</p>
                            <p>CPF: ${aluno.cpf}</p>
                            <button class="btn-ver-treino" data-matricula="${aluno.matricula}">Ver Treino</button>
                        </div>
                    `;
                    conteudoAlunos.innerHTML = alunoCard;

                    const botoesVerTreino = document.querySelectorAll('.btn-ver-treino');
                    botoesVerTreino.forEach(botao => {
                        botao.addEventListener('click', () => {
                            const matricula = botao.getAttribute('data-matricula');
                            // Chama a função para buscar a ficha de treino do aluno
                            buscarFichaTreinoAluno(matricula);
                        });
                    });
                }
            } else {
                conteudoAlunos.innerHTML = "<p>Nenhuma matrícula informada.</p>";
            }

        } catch (error) {
            console.error('Erro ao buscar alunos:', error);
            conteudoAlunos.innerHTML = '<p>Erro ao carregar os dados.</p>';
        }
    }

    // Buscar dados do instrutor logado
    async function buscarInstrutor() {
        try {
            if (cpf === null) { // Verifica se o CPF já foi obtido
                cpf = await obterCpfInstrutor(); // Obtém o CPF do instrutor
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


    // Cadastrar senha para instrutor (Exemplo) - Este endpoint é acessado pelo Recepcionista
    async function cadastrarSenhaInstrutor(cpf, senha) {
        try {
            const response = await fetch('http://localhost:8080/instrutor/recepcionista/usuariocadastro', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cpf, senha }) // Ajustar o body conforme a necessidade
            });

            if (!response.ok) {
                throw new Error('Erro ao cadastrar senha para o instrutor.');
            }

            // Exibir mensagem de sucesso (adapte para a sua necessidade)
            alert('Senha do instrutor cadastrada com sucesso!');

        } catch (error) {
            console.error('Erro ao cadastrar senha para o instrutor:', error);
            alert('Erro ao cadastrar senha para o instrutor.');
        }
    }

    // Atualizar dados do instrutor (Exemplo) - Este endpoint é acessado pelo Recepcionista
    async function atualizarInstrutor(cpf, dadosAtualizados) {
        try {
            const response = await fetch(`http://localhost:8080/instrutor/recepcionista/atualizar/cpf/${cpf}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosAtualizados)
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar dados do instrutor.');
            }

            // Exibir mensagem de sucesso (adapte para a sua necessidade)
            alert('Dados do instrutor atualizados com sucesso!');

        } catch (error) {
            console.error('Erro ao atualizar instrutor:', error);
            alert('Erro ao atualizar dados do instrutor.');
        }
    }


    // Criar nova ficha de treino para um aluno (Exemplo)
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

    // Atualizar ficha de treino de um aluno (Exemplo)
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

    // Deletar ficha de treino de um aluno (Exemplo)
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

     // Chamar a função buscarInstrutor ao carregar a página
     buscarInstrutor();

     // Adicionar evento de clique ao item do menu "Alunos"
     const menuItemAlunos = document.querySelector('.item-menu[data-endpoint="buscarAlunos"]');
     menuItemAlunos.addEventListener('click', () => {
         conteudoAlunos.innerHTML = '';
         buscarAlunos();
     });

     // Adicionar evento de clique ao botão "Meus Dados"
     const botaoMeusDados = document.querySelector('.item-menu[data-endpoint="buscarInstrutor"]');
if (botaoMeusDados) {
    botaoMeusDados.addEventListener('click', () => {
        conteudoAlunos.innerHTML = ''; // Limpa o conteúdo atual
        buscarInstrutor(); // Chama a função para buscar os dados do instrutor
    });
}
 
     // Adicionar evento de clique ao item do menu "Criar Ficha de Treino"
     const menuItemCriarFicha = document.querySelector('.item-menu[data-endpoint="criarFichaTreino"]');
     menuItemCriarFicha.addEventListener('click', () => {
         const matricula = prompt("Digite a matrícula do aluno para criar a ficha de treino:");
         if (matricula) {
             // Implementar a lógica para criar a ficha de treino
             // ... (chamar a função criarFichaTreino com a matrícula e os dados da ficha) ...
         } else {
             conteudoAlunos.innerHTML = "<p>Nenhuma matrícula informada.</p>";
         }
     });
 });