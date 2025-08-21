import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models/user.model';
import { JsonPlaceholderService } from '../../core/services/jsonplaceholder.service';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  users$!: Observable<User[]>;
  filteredUsers$!: Observable<User[]>;
  private searchTerm$ = new BehaviorSubject<string>('');

  constructor(
    private service: JsonPlaceholderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.users$ = this.service.getUsers();

    this.filteredUsers$ = combineLatest([
      this.users$,
      this.searchTerm$.pipe(startWith('')),
    ]).pipe(
      map(([users, term]) => {
        term = term.toLowerCase();
        if (term.length < 2) return users;

        return users.filter((u) => {
          const searchable = `
            ${u.username}
            ${u.name}
            ${u.email}
            ${u.address?.city}
            ${u.company?.name}
            ${u.phone}
          `.toLowerCase();
          return searchable.includes(term);
        });
      })
    );
  }

  search(term: string) {
    this.searchTerm$.next(term);
  }

  goToPosts(userId: number) {
    this.router.navigate(['/posts', userId]);
  }
}
