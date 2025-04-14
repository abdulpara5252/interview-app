import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { InterviewService } from '../../../core/services/interview.service';
import { LanguageTopic, TopicsResponse } from '../../../shared/models/interview.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlayCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-language-topic',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatListModule, 
    MatIconModule, 
    MatButtonModule,
    MatProgressSpinnerModule,
    FontAwesomeModule
  ],
  templateUrl: './language-topic.component.html',
  styleUrls: ['./language-topic.component.scss']
})
export class LanguageTopicComponent implements OnInit {
  topics: LanguageTopic[] = [];
  languageName: string = '';
  isLoading: boolean = true;
  error: string | null = null;
  faPlayCircle = faPlayCircle;
  faQuestionCircle = faQuestionCircle;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private InterviewService: InterviewService
  ) {}

  ngOnInit() {
    const languageId = this.route.snapshot.params['id'];
    this.loadTopics(languageId);
  }

  private loadTopics(languageId: number): void {
    this.isLoading = true;
    this.error = null;
    
    this.InterviewService.getLanguageTopics().subscribe({
      next: (response: TopicsResponse) => {
        // Filter topics by languageId and sort by orderNo
        this.topics = response.data
          .filter(topic => topic.languageId === Number(languageId))
          .sort((a, b) => a.orderNo - b.orderNo);
        
        this.languageName = response.data.find(topic => topic.languageId === Number(languageId))?.languageName || 'Programming Language';
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load topics. Please try again later.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  openYoutubeVideo(url: string): void {
    window.open(`https://www.youtube.com/watch?v=${url}`, '_blank');
  }

  navigateToAllQuestions(): void {
    this.router.navigate(['/question-list']);
  }

  navigateToTopicDetail(languageTopicId: number): void {
    debugger;
    this.router.navigate(['/question-detail', languageTopicId,]);
  }
}
