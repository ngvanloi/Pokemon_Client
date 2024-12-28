import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Observable } from 'rxjs';
import { IUser } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  currentUser$?: Observable<IUser | null>;

  constructor(private userService: UserService) {
    this.currentUser$ = this.userService.currentUser$;
  }

  onLogout(): void {
    this.userService.logout();
  }

}
