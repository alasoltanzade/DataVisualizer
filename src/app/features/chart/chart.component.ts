import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { forkJoin, map, switchMap } from 'rxjs';
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
    this.service
      .getUsers()
      .pipe(
        switchMap((users) => {
          const observables = users.map((user) =>
            this.service.getPostsByUser(user.id).pipe(
              switchMap((posts) =>
                posts.length
                  ? forkJoin(
                      posts.map((p) => this.service.getCommentsByPost(p.id))
                    )
                  : [[]]
              ),
              map((commentsArrays) => {
                const allComments = commentsArrays.flat();
                const totalChars = allComments.reduce(
                  (sum, c) => sum + c.body.length,
                  0
                );
                const avg = allComments.length
                  ? totalChars / allComments.length
                  : 0;
                return { user: user.username, avg };
              })
            )
          );
          return forkJoin(observables);
        })
      )
      .subscribe((result) => {
        this.chartData = {
          labels: result.map((r) => r.user),
          datasets: [
            { label: 'Average comment length', data: result.map((r) => r.avg) },
          ],
        };
      });
  }
}
