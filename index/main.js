const formulario = document.getElementById('form-al'); // Captura o formulário

formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    // Captura os valores dos campos
    const Iuser = document.getElementById("aluno").value;
    const Isenha = document.getElementById("senha").value;

    // Verifica se os campos estão vazios
    if (Iuser == "" || Isenha == "") {
        alert('Por favor, preencha todos os campos!');
        return; // Interrompe a execução se os campos estiverem vazios
    }

    // Faz a requisição ao servidor
    fetch(`http://localhost:8080/aluno`, {
        method: 'POST', // Método HTTP
        headers: {
            'Content-Type': 'application/json' // Cabeçalho indicando JSON
        },
        body: JSON.stringify({ Iuser, Isenha }) // Converte os dados em JSON
    })

    .then((response) => {
        if (response.ok) {
            return response.json(); // Converte a resposta em JSON
            window.location.href = "./aluno/aluno.html";
            
        } else {
            throw new Error('Número de cadastro ou senha inválidos'); // Lança erro
        }
    })

    .then((data) => {
        // Manipula a resposta bem-sucedida
        alert('Login realizado com sucesso!');
        console.log(data);

    })
    .catch((error) => {
        // Trata erros, como falhas na conexão ou resposta inválida
        alert(error.message);
        console.error('Erro:', error);
    });
});