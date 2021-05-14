import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Order, OrderPosition, Position } from "../interfaces";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    constructor (
        private http: HttpClient
    ) { }

    public list: OrderPosition[] = [];
    public price = 0;

    add(position: Position) {
        const orderPosition: OrderPosition = Object.assign({}, {
            name: position.name!,
            cost: position.cost!,
            quantity: position.quantity!,
            _id: position._id!
        })
        const candidate = this.list.find(p => p._id === position._id);
        if(candidate) {
            candidate.quantity += orderPosition.quantity;
        } else {
            this.list.push(orderPosition);
        }
        this.computePrice();
    }

    remove(orderPosition: OrderPosition) {
        const idx = this.list.findIndex(p => p._id === orderPosition._id);
        this.list.splice(idx, 1);
        this.computePrice();
    }

    clear() {
        this.list = [];
        this.price = 0;
    }

    create(): Observable<Order> {
        const order: Order = {
            list: this.list.map(item => {
                delete item._id;
                return item;
            })
        }
        console.log(order);
        
        return this.http.post<Order>('api/order', order)

    }

    fetch(params: any = {}): Observable<Order[]> {
        return this.http.get<Order[]>(`api/order`, {
            params: new HttpParams({
                fromObject: params
            })
        })
    }

    private computePrice() {
        this.price = this.list.reduce((total, item) => {
            return total += item.quantity * item.cost
        }, 0)
    }

}