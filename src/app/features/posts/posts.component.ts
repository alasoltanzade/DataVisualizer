import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models/user.model';
import { Post } from '../../core/models/post.model';
import { JsonPlaceholderService } from '../../core/services/jsonplaceholder.service';

@Component({
  selector: 'app-posts',
  imports: [CommonModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  user?: User;

  constructor(
    private route: ActivatedRoute,
    private service: JsonPlaceholderService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const userId = Number(params.get('id'));

      this.service
        .getPostsByUser(userId)
        .subscribe((posts) => (this.posts = posts));

      this.service.getUserById(userId).subscribe((user) => {
        this.user = user;
      });
    });
  }
}
