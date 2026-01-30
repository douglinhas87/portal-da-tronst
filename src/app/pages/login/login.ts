import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  languageOpen = false;
  currentLanguage = 'pt';

  toggleLanguage() {
    this.languageOpen = !this.languageOpen;
  }

  selectLanguage(lang: string) {
    this.currentLanguage = lang;
    this.languageOpen = false;

    console.log('Idioma selecionado:', lang);
  }
}
