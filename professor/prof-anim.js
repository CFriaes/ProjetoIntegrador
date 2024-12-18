var menuItem = document.querySelectorAll(".item-menu");

function selectLink() {
    menuItem.forEach((item) =>
        item.classList.remove('ativo')
    );
    this.classList.add('ativo');
}

menuItem.forEach((item) =>
    item.addEventListener('click', selectLink)
);

var btnExp = document.querySelector("#btn-exp");
var menuSide = document.querySelector('.menu-lateral');
var textSpace = document.querySelector('.text-space');

btnExp.addEventListener('click', function() {
    menuSide.classList.toggle('expandir');
    textSpace.classList.toggle('expandir');
});

var tipoTreino = document.querySelectorAll(".tipoTreino");

function selectSquare() {
    tipoTreino.forEach((item) => {
        item.querySelector('.square').classList.remove('ativo'); // Remove a classe do quadrado anterior
    });
    this.querySelector('.square').classList.add('ativo'); // Adiciona a classe no quadrado clicado
}

tipoTreino.forEach((item) =>
    item.addEventListener('click', selectSquare)
);