import { Component, signal } from '@angular/core';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faqs',
  standalone: true,
  templateUrl: './faqs.html',
})
export class Faqs {
  // Track open item ID (default open first item)
  openFaqId = signal<number | null>(1);

  faqList: FaqItem[] = [
    {
      id: 1,
      question: 'Do I get free updates?',
      answer: 'Yes, all updates are free for lifetime once you purchase any of our plans.',
    },
    {
      id: 2,
      question: 'Can I Customize TailAdmin to suit my needs?',
      answer:
        'TailAdmin is built using Tailwind CSS and Angular Signals, making it extremely customizable and easy to extend.',
    },
    {
      id: 3,
      question: 'What does Unlimited Projects mean?',
      answer:
        'You can use the template for unlimited personal and commercial client projects without purchasing extra licenses.',
    },
    {
      id: 4,
      question: 'How do I integrate backend API endpoints?',
      answer:
        'Our template uses Angular 19+ httpResource() and OAuth2 interceptors to connect seamlessly with Spring Boot REST services.',
    },
  ];

  toggleFaq(id: number) {
    this.openFaqId.update((current) => (current === id ? null : id));
  }
}
