export class Product {
        _id: string;
        productName: string;
        productPrice: number;
        productSize: string;
        productDate: Date;
        productDescription: string;
        productStock: number;
        productImage: string;



    constructor(){
        this._id ='';
        this.productName = "";
        this.productPrice = 0;
        this.productSize = "";
        this.productDate = new Date();
        this.productDescription = "";
        this.productStock = 0;
        this.productImage = "";


    }
}