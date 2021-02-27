import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Item} from '../../item/Item';
import {NgxSpinnerService} from 'ngx-spinner';
import {ItemService} from '../../../core/services/item.service';
import {Customer} from '../Customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
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
    return this.customerForm.get('name');
  }

  get mobile(): any {
    return this.customerForm.get('mobile');
  }

  get address(): any {
    return this.customerForm.get('address');
  }

  async ngOnInit(): Promise<any> {
    await this.loadAllCustomers();
  }

  async save(savebtn: HTMLButtonElement): Promise<any> {
    this.customerForm.markAllAsTouched();

    if (this.customerForm.valid) {
      if (savebtn.innerText === 'Save') {
        await this.saveCustomer(savebtn);
      } else {
        await this.updateCustomer(savebtn);
      }
    } else {

    }
  }

  async cancel(savebtn: HTMLButtonElement): Promise<any> {
    this.customerForm.reset();
    savebtn.innerText = 'Save';
  }

  async saveCustomer(savebtn: HTMLButtonElement): Promise<boolean> {
    return new Promise(resolve => {
      console.log(this.customerForm.valid);
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

}
