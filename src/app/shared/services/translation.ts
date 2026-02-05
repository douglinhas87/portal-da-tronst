import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export interface Translation {
  // Títulos principais
  headline1: string;
  headline2: string;
  description1: string;
  description2: string;
  
  // Formulário de login
  loginTitle: string;
  personalData: string;
  emailLabel: string;
  passwordLabel: string;
  forgotPassword: string;
  loginButton: string;
  supportButton: string;
  
  // Recuperação de senha
  recoveryTitle: string;
  recoveryInstructions: string;
  recoveryEmailLabel: string;
  recoveryButton: string;
  backToLogin: string;
  recoverySuccess: string;
  recoveryError: string;
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
      supportButton: 'Falar com o suporte',
      recoveryTitle: 'Recuperar Senha',
      recoveryInstructions: 'Digite seu email cadastrado e enviaremos as instruções para redefinir sua senha.',
      recoveryEmailLabel: 'Email cadastrado',
      recoveryButton: 'Recuperar senha',
      backToLogin: 'Voltar para o login',
      recoverySuccess: 'Instruções enviadas com sucesso! Verifique seu e-mail.',
      recoveryError: 'Por favor, insira um email válido.'
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
      supportButton: 'Contact support',
      recoveryTitle: 'Password Recovery',
      recoveryInstructions: 'Enter your registered email and we will send instructions to reset your password.',
      recoveryEmailLabel: 'Registered email',
      recoveryButton: 'Recover Password',
      backToLogin: 'Back to login',
      recoverySuccess: 'Recovery instructions sent to your email. Check your inbox.',
      recoveryError: 'Please enter a valid email address.'
    },
    es: {
      headline1: 'Una nueva era comienza con',
      headline2: '¡transformación!',
      description1: 'Soluciones tecnológicas para el mercado',
      description2: 'de higiene profesional.',
      loginTitle: 'Iniciar sesión',
      personalData: 'Datos personales',
      emailLabel: 'Correo electrónico',
      passwordLabel: 'Contraseña',
      forgotPassword: '¿Olvidó su contraseña? Haga clic aquí',
      loginButton: 'Iniciar sesión',
      supportButton: 'Hablar con soporte',
      recoveryTitle: 'Recuperar Contraseña',
      recoveryInstructions: 'Ingrese su correo electrónico registrado y le enviaremos instrucciones para restablecer su contraseña.',
      recoveryEmailLabel: 'Correo electrónico registrado',
      recoveryButton: 'Recuperar Contraseña',
      backToLogin: 'Volver al inicio de sesión',
      recoverySuccess: 'Instrucciones de recuperación enviadas a su correo electrónico. Revise su bandeja de entrada.',
      recoveryError: 'Por favor, ingrese un correo electrónico válido.'
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
      supportButton: 'Contatta il supporto',
      recoveryTitle: 'Recupera Password',
      recoveryInstructions: 'Inserisci la tua email registrata e ti invieremo le istruzioni per reimpostare la password.',
      recoveryEmailLabel: 'Email registrata',
      recoveryButton: 'Recupera Password',
      backToLogin: 'Torna all\'accesso',
      recoverySuccess: 'Istruzioni di recupero inviate alla tua email. Controlla la tua casella di posta.',
      recoveryError: 'Inserisci un\'indirizzo email valido.'
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

  getTranslation(key: keyof Translation): string {
    const translations = this.translations.value;
    return translations ? translations[key] : '';
  }
}