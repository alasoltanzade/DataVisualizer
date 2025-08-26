import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { User } from '../../core/models/user.model';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { JsonPlaceholderService } from '../../core/services/jsonplaceholder.service';
import { UserSearchService } from '../../core/services/userSearch.service';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})

export class UsersComponent implements OnInit {
  users!: Observable<User[]>;
  filteredUsers!: Observable<User[]>;
  private searchTerm = new BehaviorSubject<string>('');

  constructor(
    private service: JsonPlaceholderService,
    private searchService: UserSearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.users = this.service.getUsers();

    this.filteredUsers = combineLatest([
      this.users,
      this.searchTerm.pipe(startWith('')),
    ]).pipe(map(([users, term]) => this.searchService.filter(users, term)));
  }

  search(term: string) {
    this.searchTerm.next(term);
  }

  goToPosts(userId: number) {
    this.router.navigate(['/posts', userId]);
  }
}
