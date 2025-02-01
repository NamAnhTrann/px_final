import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isScrolled: boolean = false;

  constructor(private router:Router){}

  @HostListener('window:scroll',[])
  onWindowScroll(){

      this.isScrolled = window.scrollY > 50;
    
  }
  
}