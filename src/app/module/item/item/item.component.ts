import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Item} from '../Item';
import {NgxSpinnerService} from 'ngx-spinner';
import {ItemService} from '../../../core/services/item.service';

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
  allItems: Item[] = [
    {
      id: 1,
      name: 'SOAP',
      qty: 6.0,
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
    {
      id: 1,
      name: 'SOAP',
      qty: 6.0,
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
    {
      id: 1,
      name: 'SOAP',
      qty: 6.0,
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
    {
      id: 1,
      name: 'SOAP',
      qty: 6.0,
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
    {
      id: 1,
      name: 'SOAP',
      qty: 6.0,
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
    {
      id: 1,
      name: 'SOAP',
      qty: 6.0,
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
    }
  ];

  constructor(private spinner: NgxSpinnerService, private itemService: ItemService) {
  }

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

  async save(savebtn: HTMLButtonElement): Promise<any> {
    this.itemForm.markAllAsTouched();

    if (this.itemForm.valid) {
      if (savebtn.innerText === 'Save') {
        await this.saveItem(savebtn);
      } else {
        await this.updateItem(savebtn);
      }
    } else {

    }
  }

  async cancel(savebtn: HTMLButtonElement): Promise<any> {
    this.itemForm.reset();
    savebtn.innerText = 'Save';
  }

  async saveItem(savebtn: HTMLButtonElement): Promise<boolean> {
    return new Promise(resolve => {
      console.log(this.itemForm.valid);
    });
  }

  async updateItem(savebtn: HTMLButtonElement): Promise<boolean> {
    return new Promise(resolve => {

    });
  }

  async remove(data: Item): Promise<any> {

  }

  async edit(data: Item, i: number, savebtn: HTMLButtonElement, element: HTMLElement): Promise<boolean> {
    return new Promise(resolve => {
      savebtn.innerText = 'Update';
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
        this.allItems = res;
      });
    });
  }
}
