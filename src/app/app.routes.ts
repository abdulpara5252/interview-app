import { Routes } from '@angular/router';
import { LanguagesComponent } from './features/languages/languages.component';
import { LanguageTopicComponent } from './features/languages/language-topic/language-topic.component';
import { QuestionListComponent } from './features/questions/question-list/question-list.component';
import { QuestionDetailComponent } from './features/questions/question-detail/question-detail.component';
import { QuestionsComponent } from './features/questions/questions/questions.component';
import { SearchPageComponent } from './features/search/search-page/search-page.component';

export const routes: Routes = [
  { path: '', component: LanguagesComponent },
  { path: 'topic/:id', component: LanguageTopicComponent },
  { path: 'languages/questions', component: QuestionListComponent },
  { path: 'questions/:id', component: QuestionsComponent },
  { path: 'question-detail/:id', component: QuestionDetailComponent },
  { path: 'question-list', component: QuestionListComponent },
  { path: 'search', component: SearchPageComponent },
  { path: '**', redirectTo: '' }
];
