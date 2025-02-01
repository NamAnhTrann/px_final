import { Injectable } from '@angular/core';
import { firebaseConfig } from '../firebase_config'; // Import the config
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  setPersistence, 
  browserLocalPersistence, 
  onAuthStateChanged
} from "firebase/auth";
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth: any;
  app: any;
  provider: any;
  displayName: string = "";
  email: string = "";
  photoUrl: string = "";
  uid: string = "";
  user: any = null; // Store the user object

  constructor(private http: HttpClient) {
    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    console.log('Firebase initialized in AuthService');
    
    // Initialize Firebase Auth
    this.auth = getAuth();
    this.provider = new GoogleAuthProvider();

    // **Set Persistent Login**
    setPersistence(this.auth, browserLocalPersistence)
      .then(() => {
        console.log("Persistence set to localStorage.");
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
      });

    // **Check if user is already logged in**
    this.loadUserSession();
  }

  /**
   * Logs in the user using Google OAuth and stores session data.
   */
  login(): Promise<void> {
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

          // **Save user data in localStorage**
          localStorage.setItem("user", JSON.stringify(this.user));

          console.log("User logged in:", user);

          // Send UID to backend
          return this.sendUidBackend(this.uid).toPromise()
            .then(response => {
              console.log('UID sent to backend successfully:', response);
            })
            .catch(error => {
              console.error('Error sending UID to backend:', error);
            });
        } else {
          console.warn("Credential is null. Login might have failed.");
          return Promise.resolve(); // Ensures a return value in all paths
        }
      })
      .catch((error) => {
        console.error(`Login failed: ${error.code}, ${error.message}`, error);
        return Promise.reject(error); // Ensures a return value in all paths
      });
  }

  /**
   * Logs out the user and clears session data.
   */
  logout(): void {
    signOut(this.auth)
      .then(() => {
        console.log("User logged out.");
        this.user = null;
        localStorage.removeItem("user"); // Clear user session
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  }

  /**
   * Loads the user session from localStorage and Firebase.
   */
  loadUserSession(): void {
    // **Restore user from localStorage**
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      console.log("User session restored from localStorage:", this.user);
    }

    // **Listen for Firebase Auth State Changes**
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.uid = user.uid;
        this.displayName = user.displayName || "";
        this.email = user.email || "";
        this.photoUrl = user.photoURL || "";
        this.user = { uid: this.uid, displayName: this.displayName, email: this.email, photoUrl: this.photoUrl };

        // **Update localStorage with latest session data**
        localStorage.setItem("user", JSON.stringify(this.user));
        console.log("User session restored from Firebase:", this.user);
      } else {
        console.log("No user session found in Firebase.");
      }
    });
  }

  /**
   * Checks if a user is logged in.
   */
  isLoggedIn(): boolean {
    console.log("Checking login status:", this.user); // Debugging log

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
    return this.http.post("/api/save-user", body, httpOptions);
  }
}
