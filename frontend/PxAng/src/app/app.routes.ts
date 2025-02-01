import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { SignupComponent } from './signup/signup.component';
import { PaymentComponent } from './payment/payment.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';

export const routes: Routes = [
    {path: '', component: HomepageComponent},
    {path: 'product-list', component:ProductListComponent},
    {path: 'product-view/:id', component:ProductViewComponent},
    {path: 'about-us', component: AboutUsComponent},
    {path: 'signup', component:SignupComponent},
    {path: 'order-summary/:uid', component:OrderSummaryComponent},
    {path: 'payment/:orderId', component: PaymentComponent}
];
