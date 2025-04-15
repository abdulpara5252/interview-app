import { Pipe, PipeTransform } from '@angular/core';

interface Question {
  questionId: number;
  question: string;
  answer: string;
  topicName: string;
  language: string;
}

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(items: Question[], searchText: string): Question[] {
    if (!items || !searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();
    return items.filter(item => {
      return item.question.toLowerCase().includes(searchText) ||
             item.topicName.toLowerCase().includes(searchText) ||
             item.language.toLowerCase().includes(searchText);
    });
  }
}
