import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  imgArray = [
    'assets/banner/banner1.JPG',
    'assets/banner/banner2.JPG',
    'assets/banner/banner3.jpg'
  ];
  
  currIndex = 0;
  prevIndex = 0; // Keeps track of previous image
  isFading = false;

  ngOnInit() {
    setInterval(() => {
      if (!this.isFading) { 
        this.fadeToNextImage();
      }
    }, 3000); // Image changes every 6 seconds
  }

  fadeToNextImage() {
    this.isFading = true;
    this.prevIndex = this.currIndex; // Save current image before switching

    setTimeout(() => {
      this.currIndex = (this.currIndex + 1) % this.imgArray.length;
    }, 2500); // ✅ Ensures transition completes before switching

    setTimeout(() => {
      this.isFading = false;
    }, 5000); // ✅ Extra delay to prevent double transition
  }

  
}