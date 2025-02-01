export class Order {
    _id: string;
    userId: string;
    productId: {
      _id: string;
      productName: string;
      productPrice: number;
      productImage: string;
      productDescription: string;
    };
    quantity: number;
    createdAt: Date;
    totalAmount: number;
    payment?: {
      _id: string;
      totalAmount: number;
      paymentDate: Date;
    };
  
    constructor() {
      this._id = "";
      this.userId = "";
      this.productId = {
        _id: "",
        productName: "",
        productPrice: 0,
        productImage: "",
        productDescription: "",
      };
      this.quantity = 0;
      this.totalAmount = 0;
      this.createdAt = new Date();
      this.payment = undefined; // Payment is optional
    }
  }
  