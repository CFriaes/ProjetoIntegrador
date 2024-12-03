document.addEventListener("DOMContentLoaded", () => {
    const alunosContainer = document.querySelector(".text-space"); // Espaço onde os dados aparecerão
    const menuItems = document.querySelectorAll(".item-menu"); // Itens do menu lateral

    // Função para buscar dados específicos
    async function fetchData(endpoint) {
        try {
            const response = await fetch(`http://localhost:8080/api/${endpoint}`); // Endpoint dinâmico
            if (response.ok) {
                const data = await response.json();
                renderContent(endpoint, data); // Renderiza os dados com base no endpoint
            } else {
                console.error("Erro ao buscar dados:", response.statusText);
                alunosContainer.innerHTML = `<p>Erro ao carregar os dados.</p>`;
            }
        } catch (error) {
            console.error("Erro de conexão:", error);
            alunosContainer.innerHTML = `<p>Erro de conexão. Tente novamente mais tarde.</p>`;
        }
    }

    // Função para renderizar os dados no espaço
    function renderContent(endpoint, data) {
        alunosContainer.innerHTML = ""; // Limpa o conteúdo anterior
        if (data.length === 0) {
            alunosContainer.innerHTML = `<p>Nenhuma informação encontrada.</p>`;
            return;
        }

        if (endpoint === "alunos") {
            data.forEach(aluno => {
                const alunoCard = document.createElement("div");
                alunoCard.classList.add("aluno-card");
                alunoCard.innerHTML = `
                    <h3>${aluno.nome}</h3>
                    <p><strong>Nascimento:</strong> ${aluno.nascimento}</p>
                    <p><strong>Email:</strong> ${aluno.email}</p>
                    <p><strong>Telefone:</strong> ${aluno.telefone}</p>
                    <p><strong>CPF:</strong> ${aluno.cpf}</p>
                    <p><strong>Menor:</strong> ${aluno.menor ? "Sim" : "Não"}</p>
                    ${aluno.menor ? `<p><strong>Responsável CPF:</strong> ${aluno.responsavelCpf}</p>` : ""}
                    <p><strong>Matrícula:</strong> ${aluno.matricula}</p>
                `;
                alunosContainer.appendChild(alunoCard);
            });
        } else if (endpoint === "mensalidades") {
            alunosContainer.innerHTML = `<p>Mensalidades: ${JSON.stringify(data)}</p>`;
        } else if (endpoint === "treinos") {
            alunosContainer.innerHTML = `<p>Treinos: ${JSON.stringify(data)}</p>`;
        }
    }

    // Função para gerenciar o clique no menu
    function selectLink() {
        menuItems.forEach(item => item.classList.remove("ativo")); // Remove a classe 'ativo' de todos
        this.classList.add("ativo"); // Adiciona a classe 'ativo' no item clicado

        // Identifica qual item foi selecionado
        const endpoint = this.getAttribute("data-endpoint");
        if (endpoint) {
            fetchData(endpoint); // Busca os dados relacionados ao endpoint
        }
    }

    // Adiciona o evento de clique a cada item do menu
    menuItems.forEach(item => {
        item.addEventListener("click", selectLink);
    });
});