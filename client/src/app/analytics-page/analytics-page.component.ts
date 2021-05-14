import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MaterialInstance } from '../shared/classes/material.service';
import { AnalyticsChartItem, AnalyticsPage } from '../shared/interfaces';
import {Chart, ChartConfiguration, registerables} from 'chart.js';
Chart.register(...registerables);
import { AnalyticsService } from '../shared/services/analytics.service';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef: ElementRef;
  @ViewChild('order') orderRef: ElementRef;

  gain: MaterialInstance;
  order: MaterialInstance;

  aSub: Subscription;
  average: number;
  pending = true;

  constructor(
    private service: AnalyticsService
  ) { }

  ngAfterViewInit() {

    const gainConfig: any = {
      label: 'Gain',
      color: 'rgb(255, 99, 132)'
    }
    const orderConfig: any = {
      label: 'Orders',
      color: 'rgb(54, 162, 235)'
    }

    this.aSub = this.service.getAnalytics().subscribe(
      (data: AnalyticsPage) => {
        this.average = data.average;
        this.pending = false;
        gainConfig.labels = data.chart.map((item: AnalyticsChartItem)  => item.label);
        gainConfig.data = data.chart.map((item: AnalyticsChartItem) => item.gain);
        
        orderConfig.labels = data.chart.map((item: AnalyticsChartItem)  => item.label);
        orderConfig.data = data.chart.map((item: AnalyticsChartItem) => item.order);

        const gainCtx = this.gainRef.nativeElement.getContext('2d');
        const orderCtx = this.orderRef.nativeElement.getContext('2d');
        gainCtx.canvas.height = '300px';
        orderCtx.canvas.height = '300px';

        new Chart(gainCtx, createChartConfig(gainConfig))
        new Chart(orderCtx, createChartConfig(orderConfig))
        
      }
    )
  }

  ngOnDestroy() {
    if(this.aSub) {
      this.aSub.unsubscribe();
    }
  }

}

function createChartConfig({labels, data, label, color}: any): ChartConfiguration {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          stepped: false,
          fill: false
        }
      ]
    }
  }
}
