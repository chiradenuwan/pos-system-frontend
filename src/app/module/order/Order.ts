export class Order {
  public constructor(
    public totalAmount: number,
    public totalDiscount: number,
    public customer: Customer,
    public items: Array<Item>
  ) {
  }
}

export class Customer {
  public constructor(
    public id: number
  ) {
  }
}

export class Item {
  public constructor(
    public  item: number,
    public  qty: number,
    public  sub_total: number,
    public  unit_price: number,
  ) {
  }
}
