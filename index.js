// scripts.js

// Função para abrir a janela flutuante
document.querySelectorAll('#aplicativos_da_barra_de_ferramentas span').forEach(icon => {
    icon.addEventListener('click', function() {
        let modalId = this.getAttribute('data-modal');
        let modal = document.getElementById(modalId);
        
        // Mostrar a janela modal
        modal.style.display = 'block';

        // Atualizar o z-index
        updateModalZIndex(modal);
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

    // Adiciona o evento de clique para atualizar o z-index
    modal.addEventListener('click', function() {
        updateModalZIndex(this);
    });
});

// Função para atualizar o z-index das modais
function updateModalZIndex(activeModal) {
    // Encontre o maior z-index atual
    let maxZIndex = Math.max(
        ...Array.from(document.querySelectorAll('.modal')).map(modal => parseInt(window.getComputedStyle(modal).zIndex, 10))
    );

    // Ajuste o z-index das modais
    document.querySelectorAll('.modal').forEach(modal => {
        let currentZIndex = parseInt(window.getComputedStyle(modal).zIndex, 10);
        if (modal !== activeModal) {
            modal.style.zIndex = Math.max(2, currentZIndex - 1); // Garantir que não seja menor que 2 (barra de ferramentas)
        }
    });

    // Defina o z-index da modal ativa como o maior
    activeModal.style.zIndex = maxZIndex + 1;
}
