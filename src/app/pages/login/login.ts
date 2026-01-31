import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  animations: [
    // Animação para abrir/fechar a lista de idiomas
    trigger('dropdownAnimation', [
      state('closed', style({ opacity: 0, transform: 'translateY(10px) scaleY(0.95)' })),
      state('open', style({ opacity: 1, transform: 'translateY(0) scaleY(1)' })),
      transition('closed <=> open', animate('350ms cubic-bezier(0.25, 1.5, 0.5, 1)'))
    ])
  ]
})
export class LoginComponent implements AfterViewInit, OnDestroy {

  // Controla se a lista de idiomas está aberta ou fechada
  languageOpen = false;
  // Idioma atualmente selecionado
  currentLanguage = 'pt';

  // Abre ou fecha a lista de idiomas
  toggleLanguage() {
    this.languageOpen = !this.languageOpen;
  }

  // Seleciona um idioma e fecha a lista
  selectLanguage(lang: string) {
    this.currentLanguage = lang;
    this.languageOpen = false;
  }

  // Referências para as imagens do slider
  slides!: HTMLElement[];
  // Índice da imagem atual (começa na primeira)
  currentIndex = 0;
  // Tempo em milissegundos para trocar as imagens automaticamente (10 segundos)
  slideInterval = 10000;
  // Guarda a referência do temporizador
  intervalId: any = null;

  // Após a tela carregar, configura o slider
  ngAfterViewInit() {
    // Pega todas as imagens do slider
    this.slides = Array.from(document.querySelectorAll('.slide'));
    // Mostra a primeira imagem
    this.showSlide(0);
    // Começa a trocar as imagens automaticamente
    this.startInterval();
  }

  // Limpa o temporizador quando sair da tela
  ngOnDestroy() {
    this.clearInterval();
  }

  // Mostra uma imagem específica do slider
  showSlide(index: number) {
    // Se não encontrar imagens, sai da função
    if (!this.slides || this.slides.length === 0) return;
    
    // Remove a classe 'active' de todas e adiciona apenas na imagem atual
    this.slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    
    // Atualiza qual imagem está visível
    this.currentIndex = index;
  }

  // Vai para a próxima imagem
  nextSlide() {
    // Calcula o índice da próxima imagem (volta para a primeira se chegar no final)
    const next = (this.currentIndex + 1) % this.slides.length;
    this.showSlide(next);
  }

  // Vai para a imagem anterior
  prevSlide() {
    // Calcula o índice da imagem anterior (vai para a última se estiver na primeira)
    const prev = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.showSlide(prev);
    // Reinicia o temporizador para não trocar logo após o usuário clicar
    this.restartInterval();
  }

  // Próxima imagem quando o usuário clica manualmente
  nextSlideManual() {
    this.nextSlide();
    this.restartInterval();
  }

  // Pausa a troca automática (quando o mouse entra no slider)
  pauseSlider() {
    this.clearInterval();
  }

  // Retoma a troca automática (quando o mouse sai do slider)
  resumeSlider() {
    this.startInterval();
  }

  // Para e começa o temporizador novamente
  restartInterval() {
    this.clearInterval();
    this.startInterval();
  }

  // ------------------------------------------------------
  // Funções internas para controlar o temporizador
  // ------------------------------------------------------

  // Inicia a troca automática de imagens
  private startInterval() {
    // Para qualquer temporizador que já exista
    this.clearInterval();
    // Cria um novo temporizador que chama nextSlide a cada X segundos
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, this.slideInterval);
  }

  // Para o temporizador atual
  private clearInterval() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}