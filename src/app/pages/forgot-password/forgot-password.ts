import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LanguageSelectorComponent } from '../../shared/components/language-selector/language-selector';
import { TranslationService, Translation } from '../../shared/services/translation';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LanguageSelectorComponent],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  email = '';
  isLoading = false;
  message = '';
  isSuccess = false;
  
  translations: Translation | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private translationService: TranslationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.translationService.translations$
      .pipe(takeUntil(this.destroy$))
      .subscribe(t => this.translations = t);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    
    if (this.isLoading) return;
    
    if (!this.email || !this.email.includes('@')) {
      this.message = this.translations?.recoveryError || 'Por favor, insira um e-mail válido.';
      this.isSuccess = false;
      return;
    }
    
    this.isLoading = true;
    this.message = '';
   
    setTimeout(() => {
      this.isLoading = false;
      this.isSuccess = true;
      this.message = this.translations?.recoverySuccess || 'Instruções enviadas com sucesso! Verifique seu e-mail.';
      
      setTimeout(() => {
        this.message = '';
      }, 5000);
    }, 1500);
  }

  voltarParaLogin(): void {
    this.router.navigate(['/login']);
  }
}