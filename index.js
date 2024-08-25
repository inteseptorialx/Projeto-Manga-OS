// Função para abrir a janela flutuante
document.querySelectorAll('#aplicativos_da_barra_de_ferramentas span').forEach(icon => {
    icon.addEventListener('click', function() {
        let modalId = this.getAttribute('data-modal');
        let modal = document.getElementById(modalId);
        
        if (modal) {
            modal.style.display = 'block';
            updateModalZIndex(modal);
        }
    });
});

// Função para fechar a janela flutuante
document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        let modalId = this.getAttribute('data-modal');
        let modal = document.getElementById(modalId);
        
        if (modal) {
            modal.style.display = 'none';
        }
    });
});

// Função para permitir arrastar a janela flutuante
function dragElement(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (el.querySelector('.modal-header')) {
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

    modal.addEventListener('click', function() {
        updateModalZIndex(this);
    });
});

// Função para atualizar o z-index das modais
function updateModalZIndex(activeModal) {
    let maxZIndex = Math.max(
        ...Array.from(document.querySelectorAll('.modal')).map(modal => parseInt(window.getComputedStyle(modal).zIndex, 10))
    );

    document.querySelectorAll('.modal').forEach(modal => {
        let currentZIndex = parseInt(window.getComputedStyle(modal).zIndex, 10);
        if (modal !== activeModal) {
            modal.style.zIndex = Math.max(2, currentZIndex - 1);
        }
    });

    activeModal.style.zIndex = maxZIndex + 1;
}

// Ajustar altura total em vh
function aplicarAlturaTotalEmVh(classeDivs, classeModal) {
    const divs = document.querySelectorAll(classeDivs);
    let totalHeight = 0;
    divs.forEach(div => {
        totalHeight += div.offsetHeight;
    });
    const viewportHeight = window.innerHeight;
    const totalHeightInVh = (totalHeight / viewportHeight) * 100;
    const modalBody = document.querySelector(classeModal);
    if (modalBody) {
        modalBody.style.height = `${totalHeightInVh}vh`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    aplicarAlturaTotalEmVh('.titulo-texto-modulo-manga-all-manga', '.texto-modulo-manga-all-manga');
    aplicarAlturaTotalEmVh('.sinopse-texto-modulo-manga-all-manga', '.texto-modulo-manga-all-manga');
    ajustarTexto('.texto-modulo-manga-all-manga p', 3);
    ajustarTexto('.texto-modulo-manga-all-manga h3', 1);
});

function ajustarTexto(classeTexto, linhasMaximas) {
    const textos = document.querySelectorAll(classeTexto);
    textos.forEach(texto => {
        texto.style.display = '-webkit-box';
        texto.style.webkitBoxOrient = 'vertical';
        texto.style.webkitLineClamp = linhasMaximas;
        texto.style.overflow = 'hidden';
        texto.style.textOverflow = 'ellipsis';
        texto.style.whiteSpace = 'normal';
        texto.style.wordBreak = 'break-word';
        const lineHeight = parseFloat(getComputedStyle(texto).lineHeight);
        texto.style.maxHeight = `${lineHeight * linhasMaximas}px`;
    });
}
