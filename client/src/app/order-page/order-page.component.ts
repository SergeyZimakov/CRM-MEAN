import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { OrderPosition } from '../shared/interfaces';
import { OrderService } from '../shared/services/order.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef: ElementRef;
  modal: MaterialInstance;
  isRoot: boolean;
  pending = false;
  oSub: Subscription;

  constructor(
    private router: Router,
    public orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.isRoot = this.router.url === '/order';
    this.router.events.subscribe(
      event => {
        if(event instanceof NavigationEnd) {
          this.isRoot = this.router.url === '/order';
        }
      }
    )
  }
  ngOnDestroy() {
    this.modal.destroy!();
    if(this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  openModal() {
    this.modal.open!();
  }

  cancel() {
    this.modal.close!();
  }
  
  onSubmit() {
    this.pending = true;
    this.modal.close!();
    this.oSub = this.orderService.create().subscribe(
      newOrder => {
        MaterialService.toast(`Order #${newOrder.order} added`);
        this.orderService.clear();
      },
      error => {
        MaterialService.toast(error.error.message)
      },
      () => {
        this.modal.close!()
        this.pending = false;
      }
    )
  }

  onRemovePosition(position: OrderPosition) {
    this.orderService.remove(position);
    MaterialService.toast('Position removed');
  }

}
