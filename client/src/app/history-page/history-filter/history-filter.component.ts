import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { DatePicker, Filter } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.css']
})
export class HistoryFilterComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() onFilter = new EventEmitter<Filter>();
  @ViewChild('from') fromRef: ElementRef;
  @ViewChild('to') toRef: ElementRef;
  from: DatePicker;
  to: DatePicker;
  order: number;
  isValid = true;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.from = MaterialService.initDatePicker(this.fromRef, this.validate.bind(this))
    this.to = MaterialService.initDatePicker(this.toRef, this.validate.bind(this))
  }

  ngOnDestroy() {
    this.from.destroy!()
    this.to.destroy!()
  }

  validate() {
    if(!this.from.date || !this.to.date) {
      this.isValid = true;
      return;
    }
    console.log(this.from < this.to);
    
    this.isValid = this.from < this.to
  }

  submitFilter() {
    const filter: Filter = {};
    if(this.order) {
      filter.order = this.order;
    }

    if(this.from.date) {
      filter.start = this.from.date;
    }

    if(this.to.date) {
      filter.end = this.to.date;
    }

    this.onFilter.emit(filter)
  }

}
