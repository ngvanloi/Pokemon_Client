import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'text-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss'
})
export class TextInputComponent {
  @Input() type: 'text' | 'password' | 'email' | 'textarea' = 'text';
  @Input() control?: AbstractControl | null;
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() id!: string;

  get formControl(): FormControl {
    return this.control as FormControl;
  }
}
