import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { InterviewService } from '../../../core/services/interview.service';
import { QuestionsResponse, Question } from '../../../shared/models/interview.model'; // Ensure these models are correctly defined and exported

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  questionsResponse: QuestionsResponse | null = null; // Use the specific model
  errorMessage: string = '';
  loading: boolean = false; // Flag for loading state
  languageName: string = ''; // To display the language name

  constructor(
    private interviewService: InterviewService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const languageId = +params['id']; // Retrieve languageId from URL, convert to number
      if (isNaN(languageId)) {
        this.errorMessage = 'Invalid Language ID provided in the URL.';
        console.error('Invalid Language ID:', params['id']);
        return; // Stop execution if ID is not a valid number
      }
      this.loadQuestions(languageId);
    });
  }

  loadQuestions(languageId: number): void {
    this.loading = true; // Set loading to true before the request
    this.errorMessage = ''; // Clear previous errors
    this.questionsResponse = null; // Clear previous data

    this.interviewService.getAllQuestionsByLanguageId(languageId).subscribe({
      next: (response) => {
        if (response && response.result) {
          this.questionsResponse = response;
          // Extract language name from the first question if available
          if (response.data && response.data.length > 0) {
            this.languageName = response.data[0].language;
          } else {
             this.languageName = 'Selected Language'; // Fallback name
          }
        } else {
          // Handle cases where API returns result: false or unexpected structure
          this.errorMessage = response?.message || 'Failed to load questions: Invalid response format.';
          console.error('API Error or Invalid Response:', response);
        }
        this.loading = false; // Set loading to false after processing
      },
      error: (error) => {
        console.error('HTTP Error fetching questions:', error); // Log the actual error object
        // Provide a user-friendly error message
        this.errorMessage = 'An error occurred while fetching questions. Please check the console or try again later.';
        this.loading = false; // Set loading to false on error
      }
    });
  }
}
