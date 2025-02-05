import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms'; // ✅ Required for [(ngModel)]


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router:Router) {}
  ngOnInit() {
    console.log("SignupComponent initialized.");

    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      console.log("✅ User already logged in. Redirecting...");
      this.router.navigate(["/product-list"]);
    } else {
      console.log("❌ No user session found.");
    }
  }

  googleSignup(): void {
    this.authService.login()
      .then(() => {
        console.log("Google login successful");
        this.router.navigate(["/product-list"]);
      })
      .catch((error) => {
        console.error("Error during Google login:", error);
        alert("Login failed. Please try again.");
      });
  }
  signup() {
    this.authService.signupWithEmailAndPassword(this.email, this.password)
      .then(() => console.log("✅ Signup successful"))
      this.router.navigate(['/product-list'])
      .catch(error => console.error("❌ Signup failed:", error));
  }


  

  logout(){
    this.authService.logout();
  }
  
}
