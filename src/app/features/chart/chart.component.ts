import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { JsonPlaceholderService } from '../../core/services/jsonplaceholder.service';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})

export class ChartComponent implements OnInit {
  chartData!: ChartData<'bar'>;
  chartOptions: ChartOptions = { responsive: true };

  constructor(private service: JsonPlaceholderService) {}

  ngOnInit(): void {
    this.service.getAverageCommentLengthPerUser().subscribe((result) => {
      this.chartData = {
        labels: result.map((r) => r.user),
        datasets: [
          {
            label: 'Average comment length',
            data: result.map((r) => r.avg),
          },
        ],
      };
    });
  }
}