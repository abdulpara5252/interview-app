import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../../pipes/filter.pipe';
import { InterviewService } from '../../../core/services/interview.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FilterPipe,
  ],
})
export class NavbarComponent {
  showMobileSearch = false;
  isMobile = false;
  searchResults: any[] = [];
  searchQuery: string = '';

  constructor(
    private router: Router, 
    private http: HttpClient,
    private interviewService: InterviewService
  ) {
    this.updateIsMobile();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.updateIsMobile();
  }

  private updateIsMobile() {
    this.isMobile = window.innerWidth <= 768; // Adjust breakpoint as needed
  }

  onSearch(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.querySelector('input') as HTMLInputElement;
    this.searchQuery = input.value.trim();

    if (this.searchQuery) {
      this.interviewService.searchQuestions(this.searchQuery)
        .subscribe(response => {
          if (response.result) {
            this.searchResults = response.data;
            this.router.navigate(['/search'], { 
              queryParams: { 
                q: this.searchQuery
              }
            });
          }
        });
    }

    this.showMobileSearch = false;
    input.value = '';
  }

  toggleMobileSearch() {
    this.showMobileSearch = !this.showMobileSearch;
  }

  toggleSidenav() {
    // Implement your sidenav toggle logic here
    console.log('Sidenav toggled');
  }
}