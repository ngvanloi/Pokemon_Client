import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {
  @ViewChild('carouselContainer') carouselContainer!: ElementRef<HTMLDivElement>;

  // List of YouTube video IDs
  videoIds: string[] = [
    'uBYORdr_TY8',
    'D0zYJ1RQ-fs',
    'bILE5BEyhdo',
    '1roy4o4tqQM',
  ];

  constructor(private sanitizer: DomSanitizer) {}

  // Generate a safe URL for embedding videos
  getVideoUrl(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1`);
  }

  // Scroll Left
  scrollLeft(): void {
    this.carouselContainer.nativeElement.scrollBy({
      left: -window.innerWidth,
      behavior: 'smooth',
    });
  }

  // Scroll Right
  scrollRight(): void {
    this.carouselContainer.nativeElement.scrollBy({
      left: window.innerWidth,
      behavior: 'smooth',
    });
  }
}
