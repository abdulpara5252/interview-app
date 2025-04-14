import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InterviewService } from '../../../core/services/interview.service';
import { Question, QuestionsResponse } from '../../../shared/models/interview.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [
    CommonModule, 
    MatProgressSpinnerModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatSelectModule,
    MatSelect,
    MatOption
  ],
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss']
})
export class QuestionDetailComponent implements OnInit {
  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  allQuestions: Question[] = [];
  tags: string[] = [];
  uniqueTags: string[] = [];
  selectedTag: string = '';
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private interviewService: InterviewService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchTags();
    const languageTopicId = this.route.snapshot.params['id'];
    if (languageTopicId) {
      this.loadQuestions(+languageTopicId);
    }
  }
  fetchTags(): void {
    debugger;
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

  private loadQuestions(languageTopicId: number): void {
    this.loading = true;
    this.error = null;

    this.interviewService.getAllQuestionsByTopicId(languageTopicId).subscribe({
      next: (response: QuestionsResponse) => {
        this.questions = response.data
          .filter((topic: Question) => topic.languageTopicId === languageTopicId)
          .sort((a: Question, b: Question) => a.orderNo - b.orderNo);
        this.allQuestions = [...this.questions];
        this.filteredQuestions = [...this.questions];
        // Extract tags after loading questions
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load questions. Please try again later.';
        this.loading = false;
        console.error(err);
      }
    });
  }

}