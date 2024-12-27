const menuItems = document.querySelectorAll('.item-menu');
const contentArea = document.querySelector('.text-space');

// Função para limpar a área de conteúdo
function clearContentArea() {
    contentArea.innerHTML = '';
}

// Função para adicionar elementos personalizados com base no data-endpoint
function displayContent(endpoint) {
    clearContentArea();

    switch (endpoint) {
        case 'adicionarAluno':
            contentArea.innerHTML = `
                <div class="adicionar-aluno-container">
                    <span>Adicionar Novo Aluno</span>
                    
                    <form id="adicionarAlunoForm">
                        <label for="nome">Nome:</label>
                        <input type="text" id="nome" name="nome" required>

                        <label for="cpf">CPF:</label>
                        <input type="text" id="cpf" name="cpf" required>

                        <label for="matricula">Matrícula:</label>
                        <input type="text" id="matricula" name="matricula" required>

                        <button type="submit" class="btn-submit">Adicionar Aluno</button>
                    </form>

                </div>
            `;
            break;

        case 'adicionarInstrutor':
            contentArea.innerHTML = `
                <div class="adicionar-instrutor-container">
                    <span>Adicionar Novo Instrutor</span>
                    <form id="adicionarInstrutorForm">
                        <label for="nomeInstrutor">Nome:</label>
                        <input type="text" id="nomeInstrutor" name="nome" required>
                        
                        <label for="especialidade">Email:</label>
                        <input type="text" id="emailInstrutor" name="email" required>

                        <label for="cpfInstrutor">Telefone:</label>
                        <input type="text" id="celularInstrutor" name="celular" required>

                        <label for="cpfInstrutor">CPF:</label>
                        <input type="text" id="cpfInstrutor" name="cpf" required>


                        <button type="submit" class="btn-submit">Adicionar Instrutor</button>
                    </form>
                </div>
            `;
            break;

        case 'procurarAluno':
            contentArea.innerHTML = `
                <div class="procurar-aluno-container">
                    <span>Procurar Aluno</span>
                    
                    <form id="procurarAlunoForm">
                        <label for="cpfBuscarAluno">CPF do Aluno:</label>
                        <input type="text" id="cpfBuscarAluno" name="cpfBuscarAluno" required>
                        <button type="submit" class="btn-submit">Buscar Aluno</button>  
                    </form>
                    <div id="resultadoBusca"></div>
                </div>
            `;
            break;

        case 'apagarAluno':
            contentArea.innerHTML = `
                <div class="apagar-aluno-container">
                    <span>Apagar Aluno</span>
                    <form id="apagarAlunoForm">
                        <label for="cpfApagarAluno">CPF do Aluno:</label>
                        <input type="text" id="cpfApagarAluno" name="cpfApagarAluno" required>
                        <button type="submit" class="btn-submit">Apagar Aluno</button>
                    </form>
                </div>
            `;
            break;

        default:
            contentArea.innerHTML = `<h3>Opção inválida!</h3>`;
    }
}

// Evento de clique nos itens do menu
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(menuItem => menuItem.classList.remove('ativo'));
        item.classList.add('ativo');

        const endpoint = item.getAttribute('data-endpoint');
        displayContent(endpoint);
    });
});