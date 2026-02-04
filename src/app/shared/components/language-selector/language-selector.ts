import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation';

type LanguageCode = 'pt' | 'en' | 'es' | 'it';

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
  
  languages = [
    { 
      code: 'pt' as LanguageCode, 
      name: 'Português - BR', 
      flag: 'assets/icons/Brazil-flag.png',
      shortName: 'PT'
    },
    { 
      code: 'en' as LanguageCode, 
      name: 'English - US', 
      flag: 'assets/icons/USA-flag.png',
      shortName: 'EN'
    },
    { 
      code: 'es' as LanguageCode, 
      name: 'Español - ES', 
      flag: 'assets/icons/Spain-flag.png',
      shortName: 'ES'
    },
    { 
      code: 'it' as LanguageCode, 
      name: 'Italiano - IT', 
      flag: 'assets/icons/Italy-flag.png',
      shortName: 'IT'
    }
  ];

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    this.currentLang = this.translationService.getCurrentLang();
    
    this.translationService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
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
    if (event) {
      event.stopPropagation();
    }
    this.isOpen = !this.isOpen;
  }

  selectLanguage(lang: LanguageCode, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    if (this.currentLang === lang) {
      this.isOpen = false;
      return;
    }
    
    this.translationService.setLanguage(lang);
    this.isOpen = false;
  }

  onFlagError(event: Event): void {
    const img = event.target as HTMLImageElement;
    const parent = img.parentElement;
    
    if (parent && parent.classList.contains('flag-container')) {
      img.style.display = 'none';
      
      const emojiSpan = document.createElement('span');
      emojiSpan.className = 'flag-emoji';
      
      const emojiFlags = {
        'pt': '🇧🇷',
        'en': '🇺🇸',
        'es': '🇪🇸',
        'it': '🇮🇹'
      };
      
      emojiSpan.textContent = emojiFlags[this.currentLang] || '🏴';
      parent.appendChild(emojiSpan);
    }
  }

  getCurrentLanguage(): any {
    const lang = this.languages.find(l => l.code === this.currentLang) || this.languages[0];
    
    const fallbackFlags: Record<LanguageCode, string> = {
      'pt': 'https://flagcdn.com/24x18/br.png',
      'en': 'https://flagcdn.com/24x18/us.png',
      'es': 'https://flagcdn.com/24x18/es.png',
      'it': 'https://flagcdn.com/24x18/it.png'
    };
    
    return {
      ...lang,
      flag: lang.flag || fallbackFlags[lang.code]
    };
  }
}