import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Translation {
  headline1: string;
  headline2: string;
  description1: string;
  description2: string;
  loginTitle: string;
  personalData: string;
  emailLabel: string;
  passwordLabel: string;
  forgotPassword: string;
  loginButton: string;
  supportButton: string;
}

type LanguageCode = 'pt' | 'en' | 'es' | 'it';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = new BehaviorSubject<LanguageCode>('pt');
  private translations = new BehaviorSubject<Translation | null>(null);
  
  currentLang$ = this.currentLang.asObservable();
  translations$ = this.translations.asObservable();

  private localTranslations: Record<LanguageCode, Translation> = {
    pt: {
      headline1: 'Uma nova era se inicia com',
      headline2: 'transformação!',
      description1: 'Soluções de tecnologia para o mercado',
      description2: 'de higiene profissional.',
      loginTitle: 'Login',
      personalData: 'Dados pessoais',
      emailLabel: 'Email',
      passwordLabel: 'Senha',
      forgotPassword: 'Esqueceu a senha? Clique aqui',
      loginButton: 'Login',
      supportButton: 'Falar com o suporte'
    },
    en: {
      headline1: 'A new era begins with',
      headline2: 'transformation!',
      description1: 'Technology solutions for the professional',
      description2: 'hygiene market.',
      loginTitle: 'Login',
      personalData: 'Personal data',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      forgotPassword: 'Forgot password? Click here',
      loginButton: 'Login',
      supportButton: 'Contact support'
    },
    es: {
      headline1: 'Una nueva era comienza con',
      headline2: '¡transformación!',
      description1: 'Soluciones tecnológicas para o mercado',
      description2: 'de higiene profissional.',
      loginTitle: 'Iniciar sesión',
      personalData: 'Datos personales',
      emailLabel: 'Correo electrónico',
      passwordLabel: 'Contraseña',
      forgotPassword: '¿Olvidó su contraseña? Haga clic aquí',
      loginButton: 'Iniciar sesión',
      supportButton: 'Hablar com soporte'
    },

    it: {
      headline1: 'Una nuova era inizia con la',
      headline2: 'trasformazione!',
      description1: 'Soluzioni tecnologiche per il mercato',
      description2: 'dell\'igiene professionale.',
      loginTitle: 'Accesso',
      personalData: 'Dati personali',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      forgotPassword: 'Password dimenticata? Clicca qui',
      loginButton: 'Accedi',
      supportButton: 'Contatta il supporto'
    }
  };

  constructor(private http: HttpClient) {
    this.initialize();
  }

  private initialize(): void {
    const savedLang = localStorage.getItem('tron_lang') as LanguageCode;
    if (savedLang && ['pt', 'en', 'es', 'it'].includes(savedLang)) {
      this.setLanguage(savedLang, false);
    } else {
      this.setLanguage('pt', false);
    }
  }

  setLanguage(lang: LanguageCode, save: boolean = true): void {
    if (save) {
      localStorage.setItem('tron_lang', lang);
    }
    
    this.currentLang.next(lang);
    
    // Tenta carregar do JSON, se falhar usa local
    this.http.get<Translation>(`assets/i18n/${lang}.json`)
      .subscribe({
        next: (translations) => {
          this.translations.next(translations);
        },
        error: () => {
          // Fallback para traduções locais
          this.translations.next(this.localTranslations[lang]);
        }
      });
  }

  getCurrentLang(): LanguageCode {
    return this.currentLang.value;
  }
}