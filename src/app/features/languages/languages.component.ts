import { Component, OnInit } from '@angular/core';
import { InterviewService } from '../../core/services/interview.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Language, LanguageQuestionCount } from '../../shared/models/interview.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-languages',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule],
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {
  languages: Language[] = [];
  counts: LanguageQuestionCount[] = [];

  constructor(private interviewService: InterviewService, private router: Router) { }

  ngOnInit() {
    forkJoin({
      languages: this.interviewService.getAllLanguages(),
      counts: this.interviewService.getQuestionCountByLanguage()
    }).subscribe({
      next: ({ languages, counts }: any) => {
        this.languages = (languages.data || []).map((language: any) => {
          const count = (counts.data || []).find((c: any) => 
            c.languageId?.toString() === language.languageId?.toString()
          );
          return { 
            ...language, 
            questionCount: count?.questionCount ?? 0 // Fallback to 0 if no count is found
          };
        });

        console.log('Updated languages with counts:', this.languages); // Verify final result
      },
      error: (err) => {
        console.error('Failed to load data:', err);
        // Optionally handle error state
        this.languages = this.languages.map(l => ({ ...l, questionCount: 0 }));
      }
    });
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const container = img.parentElement;
    if (container) {
      const icon = document.createElement('mat-icon');
      icon.className = 'default-logo';
      icon.textContent = 'IMG';
      container.appendChild(icon);
    }
  }

  handleLanguageClick(languageId: number): void {
    debugger;
    this.router.navigate(['/topic', languageId,]);
  }

  handleQuestionClick(languageId: number): void {
    debugger;
    this.router.navigate(['/questions', languageId]);
  }
}