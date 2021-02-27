import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Item} from '../../item/Item';
import {NgxSpinnerService} from 'ngx-spinner';
import {ItemService} from '../../../core/services/item.service';
import {Customer} from '../Customer';
import {CustomerService} from '../../../core/services/customer.service';
// @ts-ignore
import alertJson from '../../../../assets/alert.json';
import {Alert} from '../../../../assets/alert';
import {AlertService} from 'ngx-alerts';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  alertJson: Alert = alertJson;
  customerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
  });
  allCustomer: Customer[] = [];
  customerDetails: any;

  constructor(private spinner: NgxSpinnerService, private customerService: CustomerService, private alertService: AlertService) {
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
      this.alertService.danger(this.alertJson.formValidateError);
    }
  }

  async cancel(savebtn: HTMLButtonElement): Promise<any> {
    this.customerForm.reset();
    savebtn.innerText = 'Save';
  }

  async saveCustomer(savebtn: HTMLButtonElement): Promise<boolean> {
    return new Promise(resolve => {
      console.log(this.customerForm.valid);
      const customer = new Customer(this.name.value, this.mobile.value, this.address.value);
      this.customerService.saveCustomer(customer).subscribe((res: any) => {
        console.log(res);
        if (res.message === 'Successfully saved!') {
          this.allCustomer.push(res.object);
          this.cancel(savebtn);
        } else {

        }

      }, (error: any) => {
        console.log(error);
        this.alertService.danger(this.alertJson.backendError);
      });
    });
  }

  async updateCustomer(savebtn: HTMLButtonElement): Promise<boolean> {
    return new Promise(resolve => {
      const customer = new Customer(this.name.value, this.mobile.value, this.address.value, this.customerDetails?.obj?.id);
      this.customerService.updateCustomer(customer).subscribe((res: any) => {
        console.log(res);
        if (res.message === 'Update Successful!') {
          this.alertService.success(res.message);
          this.allCustomer[this.customerDetails.index] = (res.object);
          this.cancel(savebtn);
        } else {
          this.alertService.danger(res.message);
        }
      }, (error: any) => {
        this.alertService.danger(this.alertJson.backendError);
      });
    });
  }

  async remove(data: Customer, i: number): Promise<any> {
    this.customerService.deleteCustomer(data?.id).subscribe((res: any) => {
      if (res.message === 'Removed Successful!') {
        console.log(res);
        this.allCustomer.splice(i, 1);
        this.alertService.success(res.message);
      } else {
        this.alertService.warning(res.message);
      }
    }, (error: any) => {
      this.alertService.danger(this.alertJson.backendError);
    });
  }

  async edit(data: Customer, i: number, savebtn: HTMLButtonElement, element: HTMLElement): Promise<boolean> {
    return new Promise(resolve => {
      savebtn.innerText = 'Update';
      console.log(data);
      this.customerDetails = {obj: data, index: i};
      console.log(this.customerDetails);
      this.name.setValue(data.name);
      this.mobile.setValue(data.mobile);
      this.address.setValue(data.address);
      element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    });
  }

  async loadAllCustomers(): Promise<boolean> {
    return new Promise(async resolve => {
      await this.spinner.show();
      this.customerService.getCustomers().subscribe((res: any) => {
        console.log(res);
        this.allCustomer = res.object;
      });
    });
  }

}
