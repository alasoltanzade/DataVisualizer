import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { Post } from '../models/post.model';
import { PostComment } from '../models/comment.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })

export class JsonPlaceholderService {
  private baseUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  getPostsByUser(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/posts?userId=${userId}`);
  }

  getCommentsByPost(postId: number): Observable<PostComment[]> {
    return this.http.get<PostComment[]>(
      `${this.baseUrl}/comments?postId=${postId}`
    );
  }

  getAverageCommentLengthPerUser(): Observable<
    { user: string; avg: number }[]
  > {
    return this.getUsers().pipe(
      switchMap((users) => {
        const obs = users.map((user) =>
          this.getPostsByUser(user.id).pipe(
            switchMap((posts) =>
              posts.length
                ? forkJoin(posts.map((p) => this.getCommentsByPost(p.id)))
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
        return forkJoin(obs);
      })
    );
  }
}
