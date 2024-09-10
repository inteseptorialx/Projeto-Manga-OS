// ============================
// Função para abrir a janela flutuante
// Responsabilidade: Exibir a janela modal associada ao ícone clicado, definir o tamanho padrão da janela, centralizá-la na tela, e atualizar seu z-index para trazê-la ao primeiro plano.
// ============================
document.querySelectorAll('#aplicativos_da_barra_de_ferramentas span').forEach(icon => {
    icon.addEventListener('click', function() {
        let modalId = this.getAttribute('data-modal');
        let modal = document.getElementById(modalId);
        
        setModalSizeBasedOnViewport(modal, 300, 150, 600, 300, 768);

        // Mostrar a janela modal
        modal.style.display = 'block';

        // Centralizar a janela modal
        centerModal(modal);

        // Atualizar o z-index
        updateModalZIndex(modal);

    });
});

function setModalSizeBasedOnViewport(modal, mobileWidth, mobileHeight, desktopWidth, desktopHeight, mobileFactorSize){
    // Definir o tamanho padrão da janela modal
    if (window.innerWidth <= mobileFactorSize ) {
        // Modo mobile
        setDefaultModalSize(modal, mobileWidth , mobileHeight, 200, 80, 600, 80); 
    } else {
        // Modo desktop
        setDefaultModalSize(modal, desktopWidth , desktopHeight, 200, 80, 600, 80); 
    }
};



// Função para centralizar a janela modal
// Responsabilidade: Posicionar a janela modal no centro da tela.
function centerModal(modal) {
    const modalWidth = modal.offsetWidth;
    const modalHeight = modal.offsetHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const top = ((viewportHeight - modalHeight)/2) + (modalHeight/2);
    const left = ((viewportWidth - modalWidth)/2) + (modalWidth/2) ;

    modal.style.position = 'fixed';
    modal.style.left = `${left}px`;
    modal.style.top = `${top}px`;

    
}

// Função para atualizar o z-index da janela modal
// Responsabilidade: Gerenciar o z-index de cada janela modal para garantir que a janela ativa esteja sempre no primeiro plano.
function updateModalZIndex(activeModal) {
    let maxZIndex = Math.max(
        ...Array.from(document.querySelectorAll('.modal')).map(modal => parseInt(window.getComputedStyle(modal).zIndex, 10))
    );

    document.querySelectorAll('.modal').forEach(modal => {
        let currentZIndex = parseInt(window.getComputedStyle(modal).zIndex, 10);
        if (modal !== activeModal) {
            modal.style.zIndex = Math.max(2, currentZIndex - 1); // Garantir que não seja menor que 2 (barra de ferramentas)
        }
    });

    activeModal.style.zIndex = maxZIndex + 1;
}

// Função para definir o tamanho padrão da janela modal
// Responsabilidade: Definir a largura e altura padrão para a janela modal.
function setDefaultModalSize(modal, width, height, heightMIN, heightMAX, widthMIN, widthMAX) {
    modal.style.width = `${width}px`;
    modal.style.height = `${height}px`;

    // Definir altura mínima e máxima
    modal.style.minHeight = `${heightMIN}px`; // Altura mínima
    modal.style.maxHeight = `${heightMAX}vh`;  // Altura máxima

    // Definir largura mínima e máxima (opcional)
    modal.style.minWidth = `${widthMIN}px`;  // Largura mínima
    modal.style.maxWidth = `${widthMAX}vw`;    // Largura máxima
}

// Função para fechar a janela flutuante
// Responsabilidade: Ocultar a janela modal quando o botão de fechar for clicado.
document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('touchstart', closeModal);

    function closeModal(event) {
        event.preventDefault();
        let modalId = this.getAttribute('data-modal');
        document.getElementById(modalId).style.display = 'none';
    }
});

// Função para permitir arrastar a janela flutuante
// Responsabilidade: Habilitar o arraste das janelas modais com atualização em tempo real da posição durante o arraste.
function dragElement(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = el.querySelector('.modal-header');

    if (header) {
        header.addEventListener('mousedown', dragStart);
        header.addEventListener('touchstart', dragStart);
    }

    function dragStart(e) {
        e.preventDefault();

        if (e.type === 'touchstart') {
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
            document.addEventListener('touchend', closeDragElement);
            document.addEventListener('touchmove', elementDrag);
        } else {
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.addEventListener('mouseup', closeDragElement);
            document.addEventListener('mousemove', elementDrag);
        }
    }

    function elementDrag(e) {
        e.preventDefault();

        let newPos1, newPos2;

        if (e.type === 'touchmove') {
            newPos1 = e.touches[0].clientX;
            newPos2 = e.touches[0].clientY;
        } else {
            newPos1 = e.clientX;
            newPos2 = e.clientY;
        }

        pos1 = newPos1 - pos3;
        pos2 = newPos2 - pos4;
        pos3 = newPos1;
        pos4 = newPos2;

        // Obter as dimensões da modal e da viewport
        const modalWidth = el.offsetWidth; 
        const modalHeight = el.offsetHeight; 
        const viewportWidth = window.innerWidth; 
        const viewportHeight = window.innerHeight; 

        // Calcular nova posição da modal
        let newTop = el.offsetTop + pos2;
        let newLeft = el.offsetLeft + pos1;
        
        // Limitar a nova posição para que a modal não saia da viewport
        newTop = Math.max(0, Math.min(newTop, viewportHeight - (modalHeight/2))); 
        newLeft = Math.max(0, Math.min(newLeft, viewportWidth  - (modalWidth/2))); 
        //newRight = Math.min(viewportWidth, newRight);
        //newBottom = Math.min(viewportHeight, newBottom);
        // Atualizar a posição da modal
        el.style.top = `${newTop}px`;
        el.style.left = `${newLeft}px`;
    }


    function closeDragElement() {
        document.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('touchend', closeDragElement);
        document.removeEventListener('touchmove', elementDrag);
    }
}

// Inicializa o arrasto para cada modal
// Responsabilidade: Configurar a funcionalidade de arrastar e clicar para cada janela modal ao carregar a página.
document.querySelectorAll('.modal').forEach(modal => {
    dragElement(modal);
    modal.addEventListener('click', function() {
        updateModalZIndex(this);
    });
});

// Função para aplicar altura total em vh
// Responsabilidade: Ajustar a altura de um elemento baseado na soma das alturas de outras divs em relação à altura da viewport.
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

// Função para ajustar o texto
// Responsabilidade: Configurar a exibição de textos dentro de um limite de linhas, aplicando quebra de linhas e a elipse ("...") quando necessário.
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

// Evento de carregamento do DOM
// Responsabilidade: Garantir que o ajuste do texto ocorra após o carregamento completo do conteúdo da página.
document.addEventListener('DOMContentLoaded', function() {
    ajustarTexto('.texto-modulo-manga-all-manga p', 4);
    ajustarTexto('.texto-modulo-manga-all-manga h3', 1);
    centralizarModaisNoPontoReferencia('.ponto-referencia');
});
