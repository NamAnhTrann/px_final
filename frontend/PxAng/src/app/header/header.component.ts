import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isScrolled: boolean = false;

  constructor(private router:Router, private auth: AuthService){}

  logout():void{
    this.auth.logout();
  }

  @HostListener('window:scroll',[])
  onWindowScroll(){

      this.isScrolled = window.scrollY > 50;
    
  }

  
}