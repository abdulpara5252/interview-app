import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router'; // Import RouterLink if needed in template
import { InterviewService } from '../../../core/services/interview.service'; // Adjust path
import { Subscription, of } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // For loading indicator
import { MatListModule } from '@angular/material/list'; // Example for display
import { MatCardModule } from '@angular/material/card'; // Example for display
import { MatButtonModule } from '@angular/material/button'; // Example for display
import { FilterPipe } from '../../../shared/pipes/filter.pipe';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatProgressSpinnerModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    FilterPipe
  ],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  searchResults: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  private routeSub: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private interviewService: InterviewService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.queryParamMap.pipe(
      tap(params => {
        this.searchQuery = params.get('q') || '';
        this.searchResults = []; // Clear previous results
        this.error = null;
        this.isLoading = !!this.searchQuery; // Set loading true before fetching
        // console.log('Search Query:', this.searchQuery); // Debugging
      }),
      // Only proceed if searchQuery is not empty
      switchMap(params => {
        const query = params.get('q');
        if (query) {
          return this.interviewService.searchQuestions(query).pipe(
            catchError(err => {
              console.error('Search service error:', err);
              this.error = 'Failed to fetch search results. Please try again later.';
              this.isLoading = false;
              return of({ result: false, data: [] }); // Return empty observable or throw error if needed elsewhere
            })
          );
        } else {
          this.isLoading = false; // No query, stop loading
          return of({ result: false, data: [] }); // Return empty observable
        }
      })
    ).subscribe(response => {
      // console.log('Search Response:', response); // Debugging
      // Assuming response structure is { result: boolean, data: any[] }
      if (response && response.result) {
        this.searchResults = response.data || [];
        if (this.searchResults.length === 0) {
            // Optional: Set a specific message if API returns success but empty data
            // this.error = "No results found matching your query.";
        }
      } else if (this.searchQuery && !this.error) {
         // Handle cases where the API might return result:false or unexpected structure
         this.searchResults = [];
         // Optionally set an error if response structure is wrong but no HTTP error occurred
         // this.error = "Received an unexpected response from the server.";
      }
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}
