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
import { RouterLink } from '@angular/router';

import { LanguageSelectorComponent } from '../../shared/components/language-selector/language-selector';
import { TranslationService, Translation } from '../../shared/services/translation';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LanguageSelectorComponent, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {

  email = '';
  password = '';
  isLoading = false;

  translations: Translation | null = null;

  @ViewChildren('slide') slideRefs!: QueryList<ElementRef>;
  slides: HTMLElement[] = [];
  currentIndex = 0;

  slideInterval = 10000;
  intervalId: any;

  private destroy$ = new Subject<void>();

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    this.translationService.translations$
      .pipe(takeUntil(this.destroy$))
      .subscribe(t => this.translations = t);
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => this.initSlider());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearInterval();
  }

  initSlider(): void {
    this.slides = this.slideRefs.map(ref => ref.nativeElement);
    if (!this.slides.length) return;
    this.showSlide(0, 'next');
    this.startInterval();
  }

  showSlide(index: number, direction: 'next' | 'prev'): void {
    const total = this.slides.length;
    const safeIndex = (index + total) % total;

    this.slides.forEach(slide =>
      slide.classList.remove('active', 'enter-left', 'enter-right')
    );

    const slide = this.slides[safeIndex];
    slide.classList.add(direction === 'next' ? 'enter-right' : 'enter-left');
    slide.offsetHeight;
    slide.classList.add('active');

    this.currentIndex = safeIndex;
  }

  nextSlide(): void {
    this.showSlide(this.currentIndex + 1, 'next');
  }

  prevSlide(): void {
    this.showSlide(this.currentIndex - 1, 'prev');
  }

  nextSlideManual(): void {
    this.nextSlide();
    this.restartInterval();
  }

  prevSlideManual(): void {
    this.prevSlide();
    this.restartInterval();
  }

  pauseSlider(): void {
    this.clearInterval();
  }

  resumeSlider(): void {
    this.startInterval();
  }

  startInterval(): void {
    this.clearInterval();
    this.intervalId = setInterval(() => this.nextSlide(), this.slideInterval);
  }

  restartInterval(): void {
    this.startInterval();
  }

  clearInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  onSubmit(event?: Event): void {
    event?.preventDefault();
    if (this.isLoading) return;
    this.isLoading = true;
    setTimeout(() => this.isLoading = false, 1500);
  }
}