import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })

export class UserSearchService {
  filter(users: User[], term: string): User[] {
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
  }
}
