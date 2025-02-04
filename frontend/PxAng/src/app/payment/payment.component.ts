import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  stripe: any;
  userId: string = ""
  orderId: string = ''; // Store orderId from route

  constructor(private auth: AuthService, private db: DatabaseService,    private route: ActivatedRoute
  ){}
  

}
