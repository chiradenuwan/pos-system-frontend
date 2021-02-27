import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Customer} from '../../customer/Customer';
import {NgxSpinnerService} from 'ngx-spinner';
import {ItemService} from '../../../core/services/item.service';
import {CustomerService} from '../../../core/services/customer.service';
import {Item} from '../../item/Item';
import {AlertService} from 'ngx-alerts';
import {SelectedItem} from '../SelectedItem';
// @ts-ignore
import alertJson from '../../../../assets/alert.json';
import {Alert} from '../../../../assets/alert';
import {CustomerForOrder, ItemForOrder, Order} from '../Order';
import {OrderService} from '../../../core/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  alertJson: Alert = alertJson;

  orderForm = new FormGroup({
    itemname: new FormControl('select', [Validators.required, Validators.pattern('^(?!select$).*$')]),
    itemId: new FormControl('', [Validators.required]),
    quantity: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$') && Validators.pattern('^(?!0$).*$')]),
    unitprice: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
    subtotal: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$') && Validators.pattern('^(?!0$).*$')]),
    quantityonHand: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
  });


  allCustomer: Customer[] = [];
  allItems: Item[] = [];
  quantgreaterthanqoh = false;
  allSelectedItems: SelectedItem[] = [];
  placeOrderForm = new FormGroup({
    name: new FormControl('select', [Validators.required, Validators.pattern('^(?!select$).*$')]),
    totalamount: new FormControl(0, [Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
    discount: new FormControl(0, [Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
    grandtotal: new FormControl(0, [Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')])
  });

  constructor(private spinner: NgxSpinnerService, private itemService: ItemService, private customerService: CustomerService,
              private alertService: AlertService, private orderService: OrderService) {
  }

  get name(): any {
    return this.placeOrderForm.get('name');
  }

  get subtotal(): any {
    return this.orderForm.get('subtotal');
  }

  get totalamount(): any {
    return this.placeOrderForm.get('totalamount');
  }

  get itemname(): any {
    return this.orderForm.get('itemname');
  }

  get quantityonHand(): any {
    return this.orderForm.get('quantityonHand');
  }

  get discount(): any {
    return this.placeOrderForm.get('discount');
  }

  get grandtotal(): any {
    return this.placeOrderForm.get('grandtotal');
  }

  get unitprice(): any {
    return this.orderForm.get('unitprice');
  }

  get quantity(): any {
    return this.orderForm.get('quantity');
  }

  async ngOnInit(): Promise<any> {
    await this.loadAllCustomers();
    await this.loadAllItems();
  }

  async save(savebtn: HTMLButtonElement): Promise<any> {
    this.orderForm.markAllAsTouched();
    console.log(this.orderForm.value);
    console.log(this.orderForm.valid);
    if (this.orderForm.valid) {
      if (savebtn.innerText === 'Save') {
        await this.saveItemLocally(savebtn);
      } else {
        await this.updateCustomer(savebtn);
      }
    } else {
      if (this.quantgreaterthanqoh === true) {
        this.alertService.warning('Quantity out of range');
      } else {
        this.alertService.warning(this.alertJson.formValidateError);
      }

    }
  }

  async cancel(savebtn: HTMLButtonElement): Promise<any> {
    this.orderForm.reset();
    savebtn.innerText = 'Save';
  }

  async saveItemLocally(savebtn: HTMLButtonElement): Promise<boolean> {
    return new Promise(async resolve => {
      await this.savetotable(savebtn);

      resolve(true);
    });
  }

  async updateCustomer(savebtn: HTMLButtonElement): Promise<boolean> {
    return new Promise(async resolve => {
      await this.savetotable(savebtn);

      resolve(true);
    });
  }

  async remove(data: SelectedItem, i: number): Promise<any> {
    this.totalamount.setValue(this.totalamount.value - data.sub_total);
    this.grandtotal.setValue(this.grandtotal.value - data.sub_total);
    this.allSelectedItems.splice(i, 1);

  }

  async edit(data: SelectedItem, i: number, savebtn: HTMLButtonElement, element: HTMLElement): Promise<boolean> {
    return new Promise(async resolve => {
      console.log(data);
      savebtn.innerText = 'Update';
      this.itemname.setValue(data.name);
      this.quantity.setValue(data.qty);
      this.unitprice.setValue(data.unit_price);
      this.subtotal.setValue(data.sub_total);
      await this.loadItemDetails();
      element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    });
  }

  async loadAllCustomers(): Promise<boolean> {
    return new Promise(async resolve => {
      await this.spinner.show();
      this.customerService.getcustomerdetails().subscribe((res: any) => {
        console.log(res);
        this.allCustomer = res.object;
        resolve(true);
      });
    });
  }

  async placeOrder(): Promise<any> {
    this.placeOrderForm.markAllAsTouched();
    if (this.placeOrderForm.valid) {
      await this.saveOrderToDB();
    } else {
      this.alertService.warning(this.alertJson.formValidateError);
    }
  }

  async loadAllItems(): Promise<boolean> {
    return new Promise(async resolve => {
      this.itemService.getAllItems().subscribe(res => {
        console.log(res);
        this.allItems = res.object;
        resolve(true);
      }, error => {
        resolve(false);
      });
    });
  }

  async changeItem(event: any): Promise<any> {
    console.log(event.target.value);
    await this.loadItemDetails();
  }

  async calculateSubTotal(): Promise<any> {
    console.log(Number(this.quantity.value));
    console.log(Number(this.quantityonHand.value));
    console.log(Number(this.quantity.value) > Number(this.quantityonHand.value));
    if (Number(this.quantity.value) > Number(this.quantityonHand.value)) {
      this.quantgreaterthanqoh = true;
      this.subtotal.setValue(0);
    } else {
      this.quantgreaterthanqoh = false;
      this.subtotal.setValue(this.quantity.value * this.unitprice.value);
    }

  }

  async calculateTotal(subtot: number): Promise<boolean> {
    this.totalamount.value = 0;
    return new Promise(resolve => {
      for (let i = 0; i < this.allSelectedItems.length; i++) {
        this.totalamount.value += this.allSelectedItems[i].sub_total;
        this.grandtotal.value += this.allSelectedItems[i].sub_total;

      }

      console.log(this.totalamount.value);
      console.log(this.grandtotal.value);
      resolve(true);
    });
  }

  async loadItemDetails(): Promise<boolean> {
    return new Promise(resolve => {
      const val = this.allItems.find((value, index) => {
        if (value.name === this.itemname.value) {
          console.log(index);
          console.log(value);
          this.quantityonHand.setValue(value.qty);
          this.unitprice.setValue(value.unit_price);
          this.orderForm.patchValue({
            itemId: value.id
          });
        }
      });
      resolve(true);
    });
  }

  discountItem(): any {
    this.grandtotal.setValue(this.totalamount.value - this.discount.value);

  }

  async saveOrderToDB(): Promise<boolean> {
    return new Promise(resolve => {
      const data: ItemForOrder[] = [];
      for (let i = 0; i < this.allSelectedItems.length; i++) {
        const item = new ItemForOrder(this.allSelectedItems[i]?.id, this.allSelectedItems[i].qty, this.allSelectedItems[i].sub_total, this.allSelectedItems[i].unit_price);
        data.push(item);
        if (i === this.allSelectedItems.length - 1) {
          console.log(data);
          const order = new Order(this.grandtotal.value, this.discount.value, new CustomerForOrder(this.name.value), data);
          console.log(order);
          this.orderService.saveOrder(order).subscribe((res: any) => {
            if (res.message === 'Successfully saved!') {
              this.alertService.success(res.message);
              this.clearOrder();
            } else {
              this.alertService.warning(res.message);
            }
            console.log(res);
          }, (errors: any) => {
            this.alertService.warning(this.alertJson.backendError);
          });
        }
      }

    });
  }

  clearOrder(): any {
    this.orderForm.reset();
    this.allSelectedItems = [];
    this.orderForm.reset();
    this.itemname.setValue('select');
    this.name.setValue('select');
    this.quantity.setValue(0);
    this.unitprice.setValue(0);
    this.subtotal.setValue(0);
    this.quantityonHand.setValue(0);
    this.grandtotal.setValue(this.totalamount.value);
  }

  private async savetotable(savebtn: HTMLButtonElement): Promise<boolean> {
    return new Promise(async resolve => {
      const index = this.allSelectedItems.findIndex((item, i) => {
        return item.name === this.itemname.value;
      });
      console.log(index);

      const x = new SelectedItem(this.itemname.value, this.quantity.value, this.subtotal.value, this.unitprice.value, this.orderForm.value.itemId);

      if (index !== -1) {
        this.allSelectedItems[index] = x;
      } else {
        this.allSelectedItems.push(x);
      }
      await this.calculateTotal(this.subtotal.value);
      console.log(this.orderForm.valid);
      console.log(this.allSelectedItems);
      this.orderForm.reset();
      this.itemname.setValue('select');
      this.quantity.setValue(0);
      this.unitprice.setValue(0);
      this.subtotal.setValue(0);
      this.quantityonHand.setValue(0);
      this.grandtotal.setValue(this.totalamount.value);
      savebtn.innerText = 'Save';
      resolve(true);
    });
  }
}
