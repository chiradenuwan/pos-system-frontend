import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Customer} from '../../customer/Customer';
import {NgxSpinnerService} from 'ngx-spinner';
import {ItemService} from '../../../core/services/item.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
   orderForm = new FormGroup({
    name: new FormControl('select', [Validators.required, Validators.pattern('^(?!select$).*$')]),
    itemname: new FormControl('select', [Validators.required, Validators.pattern('^(?!select$).*$')]),
    quantity: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
    unitprice: new FormControl('', [Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
    subtotal: new FormControl('', [ Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
    totalamount: new FormControl('', [ Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
    discount: new FormControl('', [Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
  });
  /*allCustomer: Customer[] = [
    {
      id: 1,
      name: 'SOAP',
      mobile: 0775361137,
      unit_price: 55.0
    },
    {
      id: 2,
      name: 'ANCHOR',
      qty: 6.0,
      unit_price: 240.0
    },
    {
      id: 3,
      name: 'WATER BOTTLE',
      qty: 10.0,
      unit_price: 100.0
    },
    {
      id: 4,
      name: 'FLOUR',
      qty: 10.0,
      unit_price: 100.0
    },
  ];
*/
  allCustomer: Customer[] = [];

  constructor(private spinner: NgxSpinnerService, private itemService: ItemService) {
  }

  get name(): any {
    return this.orderForm.get('name');
  }

  get subtotal(): any {
    return this.orderForm.get('subtotal');
  }

  get totalamount(): any {
    return this.orderForm.get('totalamount');
  }

  get itemname(): any {
    return this.orderForm.get('itemname');
  }

  get discount(): any {
    return this.orderForm.get('discount');
  }

  get unitprice(): any {
    return this.orderForm.get('unitprice');
  }

  get quantity(): any {
    return this.orderForm.get('quantity');
  }

  async ngOnInit(): Promise<any> {
    await this.loadAllCustomers();
  }

  async save(savebtn: HTMLButtonElement): Promise<any> {
    this.orderForm.markAllAsTouched();

    if (this.orderForm.valid) {
      if (savebtn.innerText === 'Save') {
        await this.saveCustomer(savebtn);
      } else {
        await this.updateCustomer(savebtn);
      }
    } else {

    }
  }

  async cancel(savebtn: HTMLButtonElement): Promise<any> {
    this.orderForm.reset();
    savebtn.innerText = 'Save';
  }

  async saveCustomer(savebtn: HTMLButtonElement): Promise<boolean> {
    return new Promise(resolve => {
      console.log(this.orderForm.valid);
    });
  }

  async updateCustomer(savebtn: HTMLButtonElement): Promise<boolean> {
    return new Promise(resolve => {

    });
  }

  async remove(data: Customer): Promise<any> {

  }

  async edit(data: Customer, i: number, savebtn: HTMLButtonElement, element: HTMLElement): Promise<boolean> {
    return new Promise(resolve => {
      savebtn.innerText = 'Update';
      // this.name.setValue(data.name);
      // this.mobile.setValue(data.qty);
      // this.unitPrice.setValue(data.unit_price);
      element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    });
  }

  async loadAllCustomers(): Promise<boolean> {
    return new Promise(async resolve => {
      await this.spinner.show();
      this.itemService.getAllItems().subscribe((res: any) => {
        console.log(res);
        this.allCustomer = res;
      });
    });
  }

  async placeOrder(): Promise<any> {

  }
}
