import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation';

type LanguageCode = 'pt' | 'en' | 'es' | 'it';

interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
  shortName: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.html',
  styleUrls: ['./language-selector.css']
})
export class LanguageSelectorComponent implements OnInit {
  isOpen = false;
  currentLang: LanguageCode = 'pt';

  languages: Language[] = [
    { code: 'pt', name: 'Português - BR', flag: 'assets/icons/Brazil-flag.png', shortName: 'PT' },
    { code: 'en', name: 'English - US', flag: 'assets/icons/USA-flag.png', shortName: 'EN' },
    { code: 'es', name: 'Español - ES', flag: 'assets/icons/Spain-flag.png', shortName: 'ES' },
    { code: 'it', name: 'Italiano - IT', flag: 'assets/icons/Italy-flag.png', shortName: 'IT' }
  ];

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    this.currentLang = this.translationService.getCurrentLang() as LanguageCode;

    this.translationService.currentLang$.subscribe(lang => {
      this.currentLang = lang as LanguageCode;
      this.isOpen = false;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.language')) {
      this.isOpen = false;
    }
  }

  toggleDropdown(event?: Event): void {
    event?.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  selectLanguage(lang: Language): void {
    if (this.currentLang === lang.code) {
      this.isOpen = false;
      return;
    }
    this.translationService.setLanguage(lang.code);
    this.isOpen = false;
  }

  onFlagError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  getCurrentLanguage(): Language {
    return this.languages.find(l => l.code === this.currentLang) || this.languages[0];
  }

  getLanguageText(): string {
    const lang = this.getCurrentLanguage();
    return window.innerWidth <= 768 ? lang.shortName : lang.name;
  }
}