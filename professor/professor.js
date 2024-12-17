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