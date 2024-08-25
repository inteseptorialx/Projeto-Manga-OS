// ============================
// Função para abrir a janela flutuante
// Responsabilidade: Exibir a janela modal associada ao ícone clicado e atualizar seu z-index para trazê-la ao primeiro plano.
// ============================
document.querySelectorAll('#aplicativos_da_barra_de_ferramentas span').forEach(icon => {
    icon.addEventListener('click', function() {
        let modalId = this.getAttribute('data-modal');
        let modal = document.getElementById(modalId);
        
        // Mostrar a janela modal
        modal.style.display = 'block';
        
        // Centralizar a janela modal
        centerModal(modal);
        
        // Atualizar o z-index
        updateModalZIndex(modal);
    });
});

// ============================
// Função para fechar a janela flutuante
// Responsabilidade: Ocultar a janela modal quando o botão de fechar for clicado.
// ============================
document.querySelectorAll('.modal-close').forEach(closeBtn => {
    // Adicionar evento de clique (mouse)
    closeBtn.addEventListener('click', closeModal);
    // Adicionar evento de toque (touch)
    closeBtn.addEventListener('touchstart', closeModal);
    
    function closeModal(event) {
        event.preventDefault(); // Evita o comportamento padrão (especialmente útil para toque)
        let modalId = this.getAttribute('data-modal');
        document.getElementById(modalId).style.display = 'none';
    }
});

// ============================
// Função para permitir arrastar a janela flutuante
// Responsabilidade: Habilitar o arraste das janelas modais tanto em dispositivos móveis quanto em desktops, com atualização em tempo real da posição da janela durante o arraste.
// ============================
function dragElement(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    const header = el.querySelector('.modal-header');
    if (header) {
        // Adicionar os ouvintes de evento para touch e mouse
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

        if (e.type === 'touchmove') {
            let newPos1 = e.touches[0].clientX;
            let newPos2 = e.touches[0].clientY;
            pos1 = newPos1 - pos3;
            pos2 = newPos2 - pos4;
            pos3 = newPos1;
            pos4 = newPos2;
        } else {
            let newPos1 = e.clientX;
            let newPos2 = e.clientY;
            pos1 = newPos1 - pos3;
            pos2 = newPos2 - pos4;
            pos3 = newPos1;
            pos4 = newPos2;
        }

        el.style.top = (el.offsetTop + pos2) + "px";
        el.style.left = (el.offsetLeft + pos1) + "px";
    }

    function closeDragElement() {
        document.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('touchend', closeDragElement);
        document.removeEventListener('touchmove', elementDrag);
    }
}

// ============================
// Inicializa o arrasto para cada modal
// Responsabilidade: Configurar a funcionalidade de arrastar e clicar para cada janela modal ao carregar a página.
// ============================
document.querySelectorAll('.modal').forEach(modal => {
    dragElement(modal);

    // Adiciona o evento de clique para atualizar o z-index
    modal.addEventListener('click', function() {
        updateModalZIndex(this);
    });
});

// ============================
// Função para atualizar o z-index das modais
// Responsabilidade: Gerenciar o z-index de cada janela modal para garantir que a janela ativa esteja sempre no primeiro plano.
// ============================
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

// ============================
// Função para centralizar a janela modal
// Responsabilidade: Posicionar a janela modal no centro da tela
// ============================
function centerModal(modal) {
    // Obter a largura e altura do modal
    const modalWidth = modal.offsetWidth;
    const modalHeight = modal.offsetHeight;

    // Calcular a posição central
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calcular a posição do modal
    const top = (viewportHeight - modalHeight) / 0.7;
    const left = (viewportWidth - modalWidth) / 1.1;

    // Definir a posição do modal
    modal.style.position = 'fixed'; // Garantir que o modal seja posicionado em relação à tela
    modal.style.top = `${top}px`;
    modal.style.left = `${left}px`;
}

// ============================
// Função para aplicar altura total em vh
// Responsabilidade: Ajustar a altura de um elemento baseado na soma das alturas de outras divs em relação à altura da viewport.
// ============================
function aplicarAlturaTotalEmVh(classeDivs, classeModal) {
    // Obter todas as divs com a classe especificada
    const divs = document.querySelectorAll(classeDivs);
  
    // Somar a altura de todas as divs
    let totalHeight = 0;
    divs.forEach(div => {
      totalHeight += div.offsetHeight;
    });
  
    // Obter a altura da viewport
    const viewportHeight = window.innerHeight;
  
    // Converter a altura total para vh
    const totalHeightInVh = (totalHeight / viewportHeight) * 100;
  
    // Aplicar o valor de altura em vh ao modal-body
    const modalBody = document.querySelector(classeModal);
    if (modalBody) {
      modalBody.style.height = `${totalHeightInVh}vh`;
    }
}
  
// ============================
// Chamada das funções para aplicar altura total em vh
// Responsabilidade: Aplicar as alturas ajustadas em vh ao conteúdo das janelas modais baseadas nas classes fornecidas.
// ============================
aplicarAlturaTotalEmVh('.titulo-texto-modulo-manga-all-manga', '.texto-modulo-manga-all-manga');
aplicarAlturaTotalEmVh('.sinopse-texto-modulo-manga-all-manga', '.texto-modulo-manga-all-manga');

// ============================
// Função para ajustar o texto
// Responsabilidade: Configurar a exibição de textos dentro de um limite de linhas, aplicando quebra de linhas e a elipse ("...") quando necessário.
// ============================
function ajustarTexto(classeTexto, linhasMaximas) {
    const textos = document.querySelectorAll(classeTexto);
  
    textos.forEach(texto => {
      // Definindo estilos para o contêiner de texto
      texto.style.display = '-webkit-box';
      texto.style.webkitBoxOrient = 'vertical';
      texto.style.webkitLineClamp = linhasMaximas;
      texto.style.overflow = 'hidden';
      texto.style.textOverflow = 'ellipsis';
      texto.style.whiteSpace = 'normal';
      texto.style.wordBreak = 'break-word';
  
      // Ajustando a altura para permitir quebras de linha e mostrar "..."
      const lineHeight = parseFloat(getComputedStyle(texto).lineHeight);
      texto.style.maxHeight = `${lineHeight * linhasMaximas}px`;
    });
}
  
// ============================
// Evento de carregamento do DOM
// Responsabilidade: Garantir que o ajuste do texto ocorra após o carregamento completo do conteúdo da página.
// ============================
document.addEventListener('DOMContentLoaded', function() {
    ajustarTexto('.texto-modulo-manga-all-manga p', 3); // Exemplo para parágrafos
    ajustarTexto('.texto-modulo-manga-all-manga h3', 1); // Exemplo para títulos
});
