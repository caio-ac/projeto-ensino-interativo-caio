function showTooltip(evt, title, imageURL, description, area, color) {
        let tooltip = document.getElementById("tooltip");
        tooltip.innerHTML = ""; // Limpa o conteúdo anterior do tooltip

        // Criar elementos para o título, imagem e descrição
        let tooltipTitle = document.createElement("div");
        tooltipTitle.textContent = title;
        tooltipTitle.classList.add("tooltip-title"); // Aplica a classe ao título

        let tooltipImg = document.createElement("img");
        tooltipImg.src = imageURL;
        tooltipImg.classList.add("tooltip-image"); // Adiciona a classe para centralizar a imagem

        let tooltipDescription = document.createElement("div");
        tooltipDescription.textContent = description;
        tooltipDescription.classList.add("tooltip-text"); // Aplica a classe ao texto

        // Adiciona os elementos ao tooltip
        tooltip.appendChild(tooltipTitle);
        tooltip.appendChild(tooltipImg);
        tooltip.appendChild(tooltipDescription);

        tooltip.style.display = "block"; // Exibe o tooltip

        // Define a posição do tooltip
        let tooltipWidth = tooltip.offsetWidth;
        let tooltipHeight = tooltip.offsetHeight;

        let left = evt.pageX + 10; // Posição horizontal
        let top = evt.pageY + 10; // Posição vertical

        // Ajusta a posição se o tooltip sair da tela
        if (left + tooltipWidth > window.innerWidth) {
          left = window.innerWidth - tooltipWidth - 10;
        }
        if (top + tooltipHeight > window.innerHeight) {
          top = window.innerHeight - tooltipHeight - 10;
        }

        tooltip.style.left = left + "px";
        tooltip.style.top = top + "px";

        // Alterar cor do elemento ou dos elementos dentro do grupo
        if (area.tagName === "g") {
          changeGroupColor(area, color);
        } else {
          area.style.fill = color;
        }
      }

      function hideTooltip() {
        var tooltip = document.getElementById("tooltip");
        tooltip.style.display = "none"; // Oculta o tooltip
      }

      function originalColor(area) {
        // Restaurar a cor original para grupos e elementos
        if (area.tagName === "g") {
          resetGroupColor(area);
        } else {
          area.style.fill = "#ececec";
        }
      }

      function changeGroupColor(group, color) {
        // Itera sobre todos os filhos do grupo e altera a cor
        const elements = group.querySelectorAll("*");
        elements.forEach((element) => {
          if (element.tagName === "path") {
            element.style.fill = color;
          }
        });
      }

      function resetGroupColor(group) {
        // Itera sobre todos os filhos do grupo e restaura a cor original
        const elements = group.querySelectorAll("*");
        elements.forEach((element) => {
          if (element.tagName === "path") {
            element.style.fill = "#ececec"; // Cor original
          }
        });
      }

      const events = [
        { year: 1914, label: "Início da Primeira Guerra Mundial" },
        { year: 1919, label: "Período pós-Guerra" },
        { year: 1921, label: "Guerra Civil Russa" },
        { year: 1922, label: "Formação da URSS" },
      ];

      const minYear = events[0].year;
      const maxYear = events[events.length - 1].year;
      const totalDuration = maxYear - minYear;

      const markersContainer = document.getElementById("markers");
      const slider = document.getElementById("myRange");

      // Função para calcular a posição proporcional
      function getProportionalPosition(year) {
        let position = ((year - minYear) / totalDuration) * 100;
        return position;
      }

      // Função para criar os marcadores de eventos
      function createMarkers() {
        markersContainer.innerHTML = ""; // Limpa os marcadores anterioress
        events.forEach((event) => {
          const marker = document.createElement("span");
          marker.className = "marker";
          let position = getProportionalPosition(event.year); // Obtém a posição proporcional

          if (event.year == 1914) {
            position += 0.5; // Incrementa a posição em 1% (ainda como número)
          } else if (event.year == 1921) {
            position -= 0.25; // Diminui a posição em 1% (ainda como número)
          } else if (event.year == 1922) {
            position -= 0.75; // Diminui a posição em 1% (ainda como número)
          }

          marker.style.left = `${position}%`; // Converte a posição em string com '%' para o estilo
          marker.innerHTML = `
            <span class="marker-title">${event.year}</span>
            <span class="marker-subtitle">${event.label}</span>
        `;
          markersContainer.appendChild(marker); // Adiciona o marcador ao contêiner
        });
      }

      createMarkers();

      // Função para encontrar o índice do evento mais próximo com base no valor do slider
      function getClosestEventIndex(value) {
        let closestIndex = 0;
        let closestDifference = Infinity;
        events.forEach((event, index) => {
          if (!event.markerOnly) {
            // Apenas considere eventos que não sejam apenas marcadores
            const eventPosition = getProportionalPosition(event.year);
            const difference = Math.abs(value - eventPosition);
            if (difference < closestDifference) {
              closestDifference = difference;
              closestIndex = index;
            }
          }
        });
        return closestIndex;
      }

      // Atualiza o fundo do slider e movimenta conforme o evento mais próximo
      slider.addEventListener("input", function () {
        const value = parseFloat(this.value);
        const selectedIndex = getClosestEventIndex(value);
        const selectedEvent = events[selectedIndex];
        const eventPosition = getProportionalPosition(selectedEvent.year);
        this.value = eventPosition; // Salta para o valor correto
      });

      // Faz o slider saltar para o evento correto ao final da movimentação
      slider.addEventListener("change", function () {
        const selectedIndex = getClosestEventIndex(parseFloat(this.value));
        const selectedEvent = events[selectedIndex];
        window.location.href = `pagina_${selectedEvent.year}.html`;
      });

      // Função para obter o ano atual da página
      function getCurrentYearFromURL() {
        const currentPage = window.location.href;
        const yearMatch = currentPage.match(/pagina_(\d+)\.html/);
        if (yearMatch && yearMatch[1]) {
          return parseInt(yearMatch[1], 10);
        }
        return null; // Retorna null se não encontrar um ano válido
      }

      // Define o valor inicial do slider baseado no ano atual
      function initializeSlider() {
        const currentYear = getCurrentYearFromURL();
        if (currentYear !== null) {
          const initialPosition = getProportionalPosition(currentYear);
          slider.value = initialPosition;
        }
      }

      // Chama a função para inicializar o slider quando a página for carregada
      window.addEventListener("load", initializeSlider);

      function openModal(country) {
        const data = countryData[country.toLowerCase()]; // Ajustado para converter o nome do país para minúsculas
        if (data) {
          document.getElementById("modalTitle").textContent = `${data.title}`;
          document.getElementById("modalImage").src = data.imageURL;
          document
            .getElementById("modalDescription")
            .querySelector("p").textContent = data.description;
          document.getElementById("image1").src = data.image;
          document.getElementById("image1Caption").textContent =
            data.imageCaption; // Atualiza a legenda aqui
          document
            .getElementById("modalDescription2")
            .querySelector("p").textContent = data.description2;
          document.getElementById("modalSources").innerHTML = `
            Fontes: 
            <a href="${data.sources[0].url}" target="_blank">${data.sources[0].name}</a> 
            e 
            <a href="${data.sources[1].url}" target="_blank">${data.sources[1].name}</a> 
        `;
          $("#infoModal").modal("show");
        } else {
          console.error("Dados do país não encontrados.");
        }
      }

      document.addEventListener("DOMContentLoaded", () => {
        const steps = document.querySelectorAll(".tutorial-step");
        const nextBtn = document.getElementById("nextStep");
        const prevBtn = document.getElementById("prevStep");
        const finishBtn = document.getElementById("finishTutorial");
        const dontShowAgainContainer = document.getElementById("dontShowAgainContainer");
        const dontShowAgainCheckbox = document.getElementById("dontShowAgain");
        const openTutorialBtn = document.getElementById("openTutorial");
      
        let currentStep = 0;
      
        const tutorialModal = new bootstrap.Modal(document.getElementById('tutorialModal'));
      
        const updateSteps = () => {
          steps.forEach((step, index) => {
            step.classList.toggle("d-none", index !== currentStep);
          });
      
          // Atualizar estado dos botões
          prevBtn.disabled = currentStep === 0;
          nextBtn.classList.toggle("d-none", currentStep === steps.length - 1);
          finishBtn.classList.toggle("d-none", currentStep !== steps.length - 1);
      
          // Mostrar/ocultar checkbox no footer
          dontShowAgainContainer.classList.toggle("d-none", currentStep !== steps.length - 1);
        };
      
        nextBtn.addEventListener("click", () => {
          if (currentStep < steps.length - 1) {
            currentStep++;
            updateSteps();
          }
        });
      
        prevBtn.addEventListener("click", () => {
          if (currentStep > 0) {
            currentStep--;
            updateSteps();
          }
        });
      
        finishBtn.addEventListener("click", () => {
          if (dontShowAgainCheckbox.checked) {
            localStorage.setItem("tutorialDisabled", "true");
          }
        });
      
        openTutorialBtn.addEventListener("click", () => {
          // Reseta o tutorial ao abrir novamente
          currentStep = 0;
          updateSteps();
          tutorialModal.show();
        });
      
        updateSteps();
      });
      
      document.addEventListener("DOMContentLoaded", () => {
        const tutorialCheckbox = document.getElementById("tutorialCheckbox");
        const dontShowAgainCheckbox = document.getElementById("dontShowAgain");
      
        // Inicializa o estado dos checkboxes com base no localStorage
        const tutorialDisabled = localStorage.getItem("tutorialDisabled") === "true";
        
        // O checkbox "Não Mostrar Novamente" será ativado inicialmente
        dontShowAgainCheckbox.checked = true;
      
        // O estado do checkbox "Ativar Tutorial" será definido com base no localStorage
        tutorialCheckbox.checked = !tutorialDisabled;
      
        // Atualiza dinamicamente o estado do checkbox "Não mostrar novamente"
        dontShowAgainCheckbox.addEventListener("change", (event) => {
          if (event.target.checked) {
            localStorage.setItem("tutorialDisabled", "true");
            tutorialCheckbox.checked = false;
          } else {
            localStorage.removeItem("tutorialDisabled");
            tutorialCheckbox.checked = true;
          }
        });
      
        // Atualiza dinamicamente o estado do checkbox "Ativar Tutorial"
        tutorialCheckbox.addEventListener("change", (event) => {
          if (event.target.checked) {
            localStorage.removeItem("tutorialDisabled");
            dontShowAgainCheckbox.checked = false;
          } else {
            localStorage.setItem("tutorialDisabled", "true");
            dontShowAgainCheckbox.checked = true;
          }
        });
      });
      
