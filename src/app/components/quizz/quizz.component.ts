import { Component, OnInit } from '@angular/core';
import quizz_questions from 'src/assets/data/quizz_questions.json';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit {
  title:string = '';

  questions:any;
  questionSelected:any;

  answers:string[] = [];
  answerSelected:string = '';

  questionIndex:number = 0;
  questionMaxIndex:number = 0;

  finished:boolean = false;
  showButtonBackQuestion:boolean = false;

  constructor() { }

  ngOnInit(): void {
    if(quizz_questions) {
      this.finished = false;
      this.showButtonBackQuestion= false;
      this.title = quizz_questions.title;

      this.questions = quizz_questions.questions;
      this.questionSelected = this.questions[this.questionIndex];

      this.questionMaxIndex = this.questions.length;
    }
  }

  playerChoose(value:string) {
    this.answers.push(value);
    this.nextStep();

    console.log(this.answers)
  }

  async nextStep() {
    this.questionIndex += 1;
    this.showButtonBackQuestion = true;

    if(this.questionMaxIndex > this.questionIndex) {
      this.questionSelected = this.questions[this.questionIndex];
    } else {
      const finalAnswer:string = await this.checkResult(this.answers);
      this.finished = true;
      this.showButtonBackQuestion = false;
      this.answerSelected = quizz_questions.results[finalAnswer as keyof typeof quizz_questions.results];
    }
  }

  async checkResult(answers:string[]) {
    const result = answers.reduce((previous, current, i, arr) => {
      if(arr.filter(item => item === previous).length > arr.filter(item => item === current).length) {
        return previous;
      } else {
        return current;
      }
    })

    return result;
  }

  backQuestion() {
    this.questionIndex -= 1;
    
    this.questionSelected = this.questions[this.questionIndex];

    if(this.questionIndex < 1) {
      this.showButtonBackQuestion = false;
    }

    this.answers.pop();
  }

  resetQuestions() {
    this.questionIndex = 0;
    this.finished = false;
    this.questionSelected = this.questions[this.questionIndex];
    this.answers = [];
    this.answerSelected = '';
  }
}
