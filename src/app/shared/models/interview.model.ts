// shared/models/interview.model.ts
export interface LanguageTopic {
  languageTopicId: number;
  languageId: number;
  topicName: string;
  orderNo: number;
  youtubeVideoUrl: string | null;
  languageName?: string; // We'll add this dynamically
}

export interface TopicsResponse {
  message: string;
  result: boolean;
  data: LanguageTopic[];
}

export interface Question {
  questionId: number;
  question: string;
  answer: string;
  topicName: string;
  languageTopicId: number;
  language: string;
  languageId: number;
  orderNo: number;
  logo: string;
  tags: string[] | null;
}

export interface QuestionsResponse {
  message: string;
  result: boolean;
  data: Question[];
}

export interface Language {
  id: number;
  languageId: number;
  language: string;
  logo: string | null;
  icon?: string;  // Add this line
  youtubePlayListUrl: string | null;
  questionCount?: number;
}

export interface LanguageQuestionCount {
  language: string;
  questionCount: number;
  languageId: number;
}