import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Item} from '../Item';
import {NgxSpinnerService} from 'ngx-spinner';
import {ItemService} from '../../../core/services/item.service';
import {AlertService} from 'ngx-alerts';
import {Alert} from '../../../../assets/alert';
// @ts-ignore
import alertJson from '../../../../assets/alert.json';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  itemForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    qty: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
    unitPrice: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{0,}(.)[0-9]{0,}$')]),
  });
  allItems: Item[] = [];
  alertJson: Alert = alertJson;
  // tslint:disable-next-line:variable-name
  item_details: any;

  get name(): any {
    return this.itemForm.get('name');
  }

  get qty(): any {
    return this.itemForm.get('qty');
  }

  get unitPrice(): any {
    return this.itemForm.get('unitPrice');
  }

  async ngOnInit(): Promise<any> {
    await this.loadAllItems();
  }

  constructor(private spinner: NgxSpinnerService, private itemService: ItemService, private alertService: AlertService) {
  }

  async cancel(savebtn: HTMLButtonElement): Promise<any> {
    this.itemForm.reset();
    savebtn.innerText = 'Save';
  }

  async save(savebtn: HTMLButtonElement): Promise<any> {
    this.itemForm.markAllAsTouched();

    if (this.itemForm.valid) {
      if (savebtn.innerText === 'Save') {
        await this.saveItem(savebtn);
      } else {
        await this.updateItem(savebtn);
      }
    } else {
      this.alertService.warning(this.alertJson.formValidateError);
    }
  }

  async saveItem(savebtn: HTMLButtonElement): Promise<boolean> {
    return new Promise(resolve => {
      console.log(this.itemForm.valid);
      const item = new Item(this.name.value, this.qty.value, this.unitPrice.value);
      this.itemService.saveItem(item).subscribe((res: any) => {
        if (res.message === 'Successfully saved!') {
          console.log(res);
          this.alertService.success(res.message);
          this.allItems.push(res.object);
          this.cancel(savebtn);
        } else {
          this.alertService.danger(res.message);
        }
      }, error => {
        this.alertService.danger(this.alertJson.backendError);
      });
    });
  }

  async updateItem(savebtn: HTMLButtonElement): Promise<boolean> {
    return new Promise(resolve => {
      console.log(this.itemForm.valid);
      const item = new Item(this.name.value, this.qty.value, this.unitPrice.value, this.item_details?.obj?.id);
      this.itemService.updateItem(item).subscribe((res: any) => {
        if (res.message === 'Update Successful!') {
          console.log(res);
          this.alertService.success(res.message);
          this.allItems[this.item_details.index] = (res.object);
          this.cancel(savebtn);
        } else {
          this.alertService.danger(res.message);
        }
      }, error => {
        this.alertService.danger(this.alertJson.backendError);
      });
    });
  }

  async remove(data: Item, i: number): Promise<any> {
    console.log(data);
    this.itemService.deleteItem(data?.id).subscribe((res: any) => {
      if (res.message === 'Removed Successful!') {
        console.log(res);
        this.allItems.splice(i, 1);
        this.alertService.success(res.message);
      } else {
        this.alertService.warning(res.message);
      }
    }, error => {
      console.log(error);
      this.alertService.danger(this.alertJson.backendError);
    });
  }

  async edit(data: Item, i: number, savebtn: HTMLButtonElement, element: HTMLElement): Promise<boolean> {
    return new Promise(resolve => {
      savebtn.innerText = 'Update';
      this.item_details = {obj: data, index: i};
      console.log(data);
      this.name.setValue(data.name);
      this.qty.setValue(data.qty);
      this.unitPrice.setValue(data.unit_price);
      element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    });
  }

  async loadAllItems(): Promise<boolean> {
    return new Promise(async resolve => {
      await this.spinner.show();
      this.itemService.getAllItems().subscribe((res: any) => {
        console.log(res);
        this.allItems = res.object;
      });
    });
  }


}
