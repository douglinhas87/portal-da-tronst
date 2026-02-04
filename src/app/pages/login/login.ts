import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  ElementRef,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LanguageSelectorComponent } from '../../shared/components/language-selector/language-selector';
import { TranslationService, Translation } from '../../shared/services/translation';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LanguageSelectorComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  // Dados do formulário
  email = '';
  password = '';
  isLoading = false;

  // Textos traduzidos da interface
  translations: Translation | null = null;

  // Referências para os slides do carrossel
  @ViewChildren('slide') slideRefs!: QueryList<ElementRef>;
  slides: HTMLElement[] = [];
  currentIndex = 0; // Índice do slide atualmente visível

  // Configuração do carrossel - tempo entre transições automáticas
  slideInterval = 10000; // 10 segundos
  intervalId: any; // Identificador do intervalo automático

  // Sujeito para gerenciar a limpeza de inscrições
  private destroy$ = new Subject<void>();

  constructor(private translationService: TranslationService) {}

  /**
   * Método executado quando o componente é inicializado
   * Configura a escuta por mudanças nos textos traduzidos
   */
  ngOnInit(): void {
    this.translationService.translations$
      .pipe(takeUntil(this.destroy$))
      .subscribe(t => this.translations = t);
  }

  /**
   * Método executado após a renderização da view
   * Inicializa o carrossel de imagens
   */
  ngAfterViewInit(): void {
    requestAnimationFrame(() => this.initSlider());
  }

  /**
   * Método executado quando o componente é destruído
   * Realiza a limpeza de recursos para evitar vazamentos de memória
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearInterval();
  }

  /**
   * Configuração inicial do carrossel de imagens
   * Coleta as referências dos slides e inicia a transição automática
   */
  initSlider(): void {
    this.slides = this.slideRefs.map(ref => ref.nativeElement);
    if (!this.slides.length) return;

    this.showSlide(0, 'next');
    this.startInterval();
  }

  /**
   * Exibe um slide específico do carrossel com animação
   * @param index Posição do slide a ser exibido
   * @param direction Direção da animação ('next' para direita, 'prev' para esquerda)
   */
  showSlide(index: number, direction: 'next' | 'prev'): void {
    const total = this.slides.length;
    const safeIndex = (index + total) % total;

    // Remove todas as classes de animação dos slides
    this.slides.forEach(slide =>
      slide.classList.remove('active', 'enter-left', 'enter-right')
    );

    // Aplica a animação de entrada no slide selecionado
    const slide = this.slides[safeIndex];
    slide.classList.add(direction === 'next' ? 'enter-right' : 'enter-left');
    
    // Força uma reflow para garantir que a animação seja executada
    slide.offsetHeight;
    
    // Torna o slide visível
    slide.classList.add('active');

    this.currentIndex = safeIndex;
  }

  /**
   * Avança para o próximo slide do carrossel
   */
  nextSlide(): void {
    this.showSlide(this.currentIndex + 1, 'next');
  }

  /**
   * Volta para o slide anterior do carrossel
   */
  prevSlide(): void {
    this.showSlide(this.currentIndex - 1, 'prev');
  }

  /**
   * Avança para o próximo slide quando o usuário clica manualmente
   * Reinicia o intervalo automático para dar tempo ao usuário ver o slide
   */
  nextSlideManual(): void {
    this.nextSlide();
    this.restartInterval();
  }

  /**
   * Volta para o slide anterior quando o usuário clica manualmente
   * Reinicia o intervalo automático para dar tempo ao usuário ver o slide
   */
  prevSlideManual(): void {
    this.prevSlide();
    this.restartInterval();
  }

  /**
   * Pausa a transição automática do carrossel
   * Usado quando o usuário passa o mouse sobre o carrossel
   */
  pauseSlider(): void {
    this.clearInterval();
  }

  /**
   * Retoma a transição automática do carrossel
   * Usado quando o usuário retira o mouse do carrossel
   */
  resumeSlider(): void {
    this.startInterval();
  }

  /**
   * Inicia o intervalo para transição automática dos slides
   */
  startInterval(): void {
    this.clearInterval();
    this.intervalId = setInterval(() => this.nextSlide(), this.slideInterval);
  }

  /**
   * Reinicia o intervalo automático do carrossel
   */
  restartInterval(): void {
    this.startInterval();
  }

  /**
   * Limpa o intervalo automático atual
   * Previne múltiplos intervalos rodando simultaneamente
   */
  clearInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Processa o envio do formulário de login
   * @param event Evento opcional do formulário
   */
  onSubmit(event?: Event): void {
    event?.preventDefault();
    
    // Evita múltiplos envios simultâneos
    if (this.isLoading) return;

    this.isLoading = true;
    
    // Simula uma requisição de login (substituir por chamada real à API)
    setTimeout(() => this.isLoading = false, 1500);
  }
}