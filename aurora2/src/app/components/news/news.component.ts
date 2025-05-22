import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  date: Date;}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {
  news: NewsArticle[] = [{
    id: 1,
    title: 'Narcis are papuci cu metine+9',
    content: 'Jucatorul Narcis aka Vypers Kiss a reusit sa faca papucii cu metine+9. O performanta deosebita!',
    date: new Date('2025-4-29')
  },
  {
    id: 2,
    title: 'Se vand conturi?!?!?!?',
    content: 'Am auzit ca se vand conturi de metin2 pe piata neagra. Nu stiu ce sa zic, dar eu nu as face asta. E ilegal! just saying! jucatorul Narcis aka Vypers Kiss a zis ca nu e bine sa faci asta! Intelegi Adrian, stim ce ai facut!',
    date: new Date('2023-4-20')
  },
  {
    id: 3,
    title: 'Missing GeoEl',
    content: 'O fenomenala disparitie a jucatorului GeoEl aka o fenomeno lionheart. Se pare ca a disparut in mod misterios. Nimeni nu stie unde este.',
    date: new Date('2025-4-15')
  },
  {
    id: 4,
    title: 'Trag in anglular',
    content: 'Un limbaj de turkish delight. Un limbaj de programare care te face sa te simti ca un zeu.',
    date: new Date('2025-4-18')
  },
  {
    id: 5,
    title: 'Darian de ce nu mai joaca?',
    content: 'Chiar e mai important sa iti faci o cariera, o casa, o familie decat sa te joci metin2 cu noi?',
    date: new Date('2025-4-17')
  }]

}
