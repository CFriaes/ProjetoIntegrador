document.addEventListener("DOMContentLoaded", () => {
    const alunosContainer = document.querySelector(".alunos-container");

    // Função para buscar os dados
    async function fetchAlunos() {
        try {
            const response = await fetch("http://localhost:8080/api/alunos"); // Atualize com o endpoint correto
            if (response.ok) {
                const alunos = await response.json(); // Recebe os dados como JSON
                renderAlunos(alunos); // Renderiza os dados no DOM
            } else {
                console.error("Erro ao buscar dados:", response.statusText);
                alunosContainer.innerHTML = `<p>Erro ao carregar os dados dos alunos.</p>`;
            }
        } catch (error) {
            console.error("Erro de conexão:", error);
            alunosContainer.innerHTML = `<p>Erro de conexão. Tente novamente mais tarde.</p>`;
        }
    }

    // Função para renderizar os alunos na página
    function renderAlunos(alunos) {
        if (alunos.length === 0) {
            alunosContainer.innerHTML = `<p>Nenhum aluno encontrado.</p>`;
            return;
        }

        alunosContainer.innerHTML = ""; // Limpa o conteúdo anterior
        alunos.forEach(aluno => {
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
    }

    // Chama a função ao carregar a página
    fetchAlunos();
});
