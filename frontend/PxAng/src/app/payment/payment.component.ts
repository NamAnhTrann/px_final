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
  
  ngOnInit(){
    this.stripe = loadStripe("pk_test_51QmORoPIY4sXtw7Y66WIL7gWKBrO6VxCfG3bi0CHOPtel5xQszxdMuKTvmUtFGS0P8T5StEt3WOeMzeu28oANavb00sddpalOE");
    this.userId = this.auth.getUserId();

    this.route.paramMap.subscribe(params => {
      this.orderId = params.get('orderId')!;
      console.log('Order ID:', this.orderId);
    });
  }

  pay(orderId: string){
    this.db.paymentGateway(orderId).subscribe((data:any)=>{
      if(data.clientSecret){
        const { err } = this.stripe!.confirmCardPayment(data.clientSecret);
        if(err){
          console.log("payment failed", err);
        } else{
          console.log("Payment succesfull");
        }
      } else {
        console.error("No clientSecret received");
      }
    });
  }
}
