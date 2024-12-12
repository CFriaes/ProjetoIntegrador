document.getElementById(`form`).addEventListener(`submit`, function(event){
    event.preventDefault();

    //pegar os valores dos campos do formulario
    const Iuser = getElementById(`user`).value;
    const Isenha = getElementById(`senha`).value;
})


async function authenticateUser(username, password) {
    const credentials = btoa(`${username}:${password}`);

    try {
        // Fazer a requisição para o endpoint /current-user
        const response = await fetch('http://localhost:8080/current-user', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`, // Envia o Basic Auth no cabeçalho
                'Content-Type': 'application/json'
            }
        });

        // Verifica se a requisição foi bem-sucedida
        if (!response.ok) {
            throw new Error('Falha na autenticação. Verifique suas credenciais.');
        }

        // Extrair a role do JSON retornado
        const data = await response.json();
        const userRole = data.role;

        // Redirecionar o usuário com base na role
        switch (userRole) {
            case 'ADMIN':
                window.location.href = '/admin.html';
                break;
            case 'RECEPCIONISTA':
                window.location.href = '/recepcionista.html';
                break;
            case 'ALUNO':
                window.location.href = '/aluno.html';
                break;
            case 'INSTRUTOR':
                window.location.href = '/instrutor.html';
                break;
            default:
                alert('Contate o suporte técnico.');
        }
    } catch (error) {
        console.error('Erro durante a autenticação:', error);
        alert('Erro ao autenticar. Por favor, tente novamente.');
    }
}