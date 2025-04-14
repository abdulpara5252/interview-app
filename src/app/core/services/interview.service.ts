import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments';
import { Question, QuestionsResponse, TopicsResponse } from '../../shared/models/interview.model';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getQuestionCountByLanguage(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetQuestionCountByLanguage`);
  }

  getTags(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getTags`);
  }

  getAllLanguages(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetAllLanguage`);
  }

  searchQuestions(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search?query=${query}`);
  }

  getAllQuestions(): Observable<QuestionsResponse> {
    return this.http.get<QuestionsResponse>(`${this.baseUrl}/GetAllQuestions`);
  }

  getAllQuestionsByLanguageId(languageId: number): Observable<QuestionsResponse> {
    return this.http.get<QuestionsResponse>(`${this.baseUrl}/GetAllQuestionsByLanguageId?id=${languageId}`);
  }

  getAllQuestionsByTopicId(id: number): Observable<QuestionsResponse> {
    return this.http.get<QuestionsResponse>(`${this.baseUrl}/GetQuestionByTopicId?=${id}`);
  }

  getQuestionsByTag(tag: string): Observable<QuestionsResponse> {
    return this.http.get<QuestionsResponse>(`${this.baseUrl}/GetQuestionsByTag?tag=${tag}`);
  }
  
  getLanguageTopics(): Observable<TopicsResponse> {
    return this.http.get<TopicsResponse>(`${this.baseUrl}/GetLanguageTopic`);
  }
}
