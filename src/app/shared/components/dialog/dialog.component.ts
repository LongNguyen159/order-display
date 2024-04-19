import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedService } from '../../services/shared.service';

export interface DialogData {
  title: string,
  message: string
}
@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  inputValue: string = ''


  constructor(public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private sharedService: SharedService) {
  }

  onCancel(): void {
    this.dialogRef.close(undefined)
  }

  onConfirm(): void {
    // Check if inputValue is empty or contains only whitespace
    if (!this.inputValue.trim()) {
      this.sharedService.openSnackbar('Input cannot be empty')
      return // Exit the function without closing the dialog
    }

    // Check if inputValue contains only special characters
    const specialCharactersRegex = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
    if (specialCharactersRegex.test(this.inputValue)) {
      this.sharedService.openSnackbar('Input value contains only special characters.')
      return // Exit the function without closing the dialog
    }


    this.dialogRef.close(this.inputValue)
  }
}
