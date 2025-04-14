import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterviewService } from '../../../core/services/interview.service';
import { ActivatedRoute } from '@angular/router';
import { Question, QuestionsResponse } from '../../../shared/models/interview.model';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelect,
    MatOption,
    MatIconModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.scss'
})
export class QuestionListComponent implements OnInit {
  questions: Question[] = [];
  allQuestions: Question[] = []; // Backup of all questions
  tags: string[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private interviewService: InterviewService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
    this.fetchTags();
  }

  fetchTags(): void {
    this.interviewService.getTags().subscribe(
      (response) => {
        if (response && Array.isArray(response.data)) {
          const uniqueTags = new Set(
            response.data.filter((tag: string | null): tag is string => tag !== null && tag !== '')
          );
          this.tags = Array.from(uniqueTags) as string[];
        } else {
          this.tags = [];
          console.error('Unexpected response format:', response);
        }
      },
      (error) => {
        this.tags = [];
        console.error('Failed to fetch tags:', error);
      }
    );
  }

  onTagSelect(tag: string): void {
    debugger;
    if (tag) {
      this.questions = this.allQuestions.filter((question) =>
        question.tags?.includes(tag)
      );
    } else {
      this.questions = [...this.allQuestions]; // Reset to all questions if no tag is selected
    }
  }

  loadQuestions(): void {
    this.loading = true;
    this.error = null;

    const topicId = this.route.snapshot.queryParams['topicId'];
    const languageId = this.route.snapshot.queryParams['languageId'];
    const tag = this.route.snapshot.queryParams['tag'];

    const fetchQuestions$ = tag
      ? this.interviewService.getQuestionsByTag(tag) // Fetch questions by tag
      : topicId
      ? this.interviewService.getAllQuestionsByTopicId(topicId)
      : languageId
      ? this.interviewService.getAllQuestionsByLanguageId(languageId)
      : this.interviewService.getAllQuestions();

    fetchQuestions$.subscribe({
      next: (response: QuestionsResponse) => {
        if (response.result && Array.isArray(response.data)) {
          this.questions = response.data;
          this.allQuestions = response.data; // Store a backup of all questions
        } else {
          this.error = response.message || 'Failed to load questions';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load questions. Please try again later.';
        this.loading = false;
        console.error('Error loading questions:', error);
      }
    });
  }
}
