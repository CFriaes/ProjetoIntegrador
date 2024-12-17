document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Pegar os valores dos campos do formulário
    const Iuser = document.getElementById('user').value; // Adicionado 'document.'
    const Isenha = document.getElementById('senha').value; // Adicionado 'document.'

    // Chamar a função de autenticação
    authenticateUser(Iuser, Isenha);
});

async function authenticateUser(username, password) {
    const credentials = btoa(`${username}:${password}`);

    try {
        // Fazer a requisição para o endpoint /current-user
        const response = await fetch('http://localhost:8080/api/current-user', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`, // Envia o Basic Auth no cabeçalho
                'Content-Type': 'application/json'
            }
        });

        localStorage.setItem('userCredentials', credentials);

        // Verifica se a requisição foi bem-sucedida
        if (!response.ok) {
            throw new Error('Falha na autenticação. Verifique suas credenciais.');
        }

        // Extrair a role do JSON retornado
        const data = await response.json();
        const userRole = data.role;

        // Redirecionar o usuário com base na role
        switch (userRole) {
            case 'ROLE_ADMIN':
                window.location.href = '/admin.html';
                break;
            case 'ROLE_RECEPCIONISTA':
                window.location.href = '/recepcionista.html';
                break;
            case 'ROLE_ALUNO':
                window.location.href = '/aluno/aluno.html';
                break;
            case 'ROLE_INSTRUTOR':
                window.location.href = '/professor/professor.html';
                break;
            default:
                alert('Contate o suporte técnico.');
        }
    } catch (error) {
        console.error('Erro durante a autenticação:', error);
        alert('Erro ao autenticar. Por favor, tente novamente.');
    }
}
