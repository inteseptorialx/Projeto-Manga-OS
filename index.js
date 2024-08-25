// scripts.js

// Função para abrir a janela flutuante
document.querySelectorAll('#aplicativos_da_barra_de_ferramentas span').forEach(icon => {
    icon.addEventListener('click', function() {
        let modalId = this.getAttribute('data-modal');
        document.getElementById(modalId).style.display = 'block';
    });
});

// Função para fechar a janela flutuante
document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        let modalId = this.getAttribute('data-modal');
        document.getElementById(modalId).style.display = 'none';
    });
});

// Função para permitir arrastar a janela flutuante
function dragElement(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (el.querySelector('.modal-header')) {
        // Se o cabeçalho existir, iniciar o arrasto
        el.querySelector('.modal-header').onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Inicializa o arrasto para cada modal
document.querySelectorAll('.modal').forEach(modal => {
    dragElement(modal);
});
