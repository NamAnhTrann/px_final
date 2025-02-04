import { Injectable } from '@angular/core';
import { firebaseConfig } from '../firebase_config'; // Import the config
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged
} from "firebase/auth";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://px-final-1.onrender.com';

  auth: any;
  app: any;
  provider: any;
  displayName: string = "";
  email: string = "";
  photoUrl: string = "";
  uid: string = "";
  user: any = null; // Store the user object

  constructor(private http: HttpClient, private router: Router) {
    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized in AuthService');
    
    // Initialize Firebase Auth
    this.auth = getAuth();
    this.provider = new GoogleAuthProvider();

    // **Check if user is already logged in**
    this.listenForAuthChanges();
  }

  /**
   * Logs in the user using Google OAuth and logs detailed request info.
   */
  login(): Promise<void> {
    console.log("🔵 Attempting login with Google OAuth...");
    
    return signInWithPopup(this.auth, this.provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          const user = result.user;
          this.uid = user.uid;
          this.displayName = user.displayName || "";
          this.email = user.email || "";
          this.photoUrl = user.photoURL || "";
          this.user = { uid: this.uid, displayName: this.displayName, email: this.email, photoUrl: this.photoUrl };

          console.log("✅ User logged in:", user);
          console.log(`🌍 Login request URL: ${window.location.href}`);
          console.log(`🔗 OAuth API Endpoint: ${this.auth.config.authDomain}/__/auth/handler`);

          // Send UID to backend
          return this.sendUidBackend(this.uid).toPromise()
            .then(response => {
              console.log('📨 UID sent to backend successfully:', response);
            })
            .catch(error => {
              console.error('❌ Error sending UID to backend:', error);
            });
        } else {
          console.warn("⚠️ Credential is null. Login might have failed.");
          return Promise.resolve(); // Ensures a return value in all paths
        }
      })
      .catch((error) => {
        console.error(`❌ Login failed: ${error.code}, ${error.message}`, error);
        console.error(`🌍 Failed Login URL: ${window.location.href}`);
        console.error(`🔗 Firebase OAuth API Endpoint: ${this.auth.config.authDomain}/__/auth/handler`);
        return Promise.reject(error);
      });
  }

  /**
   * Logs out the user and clears session data.
   */
  logout(): void {
    signOut(this.auth)
      .then(() => {
        console.log("🚪 User logged out.");
        this.user = null;
  
        // Clear session data
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
  
        // Redirect to login or home page
        this.router.navigate(["/signup"]);
      })
      .catch((error) => {
        console.error("❌ Logout failed:", error);
      });
  }

  /**
   * Listens for Firebase Auth State Changes (Session Persistence).
   */
  listenForAuthChanges(): void {
    console.log("👀 Listening for authentication state changes...");
    
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.uid = user.uid;
        this.displayName = user.displayName || "";
        this.email = user.email || "";
        this.photoUrl = user.photoURL || "";
        this.user = { uid: this.uid, displayName: this.displayName, email: this.email, photoUrl: this.photoUrl };

        console.log("🔄 User session restored from Firebase:", this.user);
      } else {
        console.log("❌ No user session found in Firebase.");
        this.user = null;
      }
    });
  }

  /**
   * Checks if a user is logged in.
   */
  isLoggedIn(): boolean {
    console.log("🔍 Checking login status:", this.user);
    return this.user !== null;
  }

  /**
   * Retrieves the UID of the logged-in user.
   */
  getUserId(): string {
    return this.uid;
  }

  /**
   * Sends UID to the backend.
   */
  sendUidBackend(uid: string) {
    const body = { uid };
    console.log(`📡 Sending UID to backend: ${this.apiUrl}/api/save-user`, body);
    return this.http.post(`${this.apiUrl}/api/save-user`, body, httpOptions);
  }
}
