import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.scss']
})
export class ActionDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ActionDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: string
    ) { }

  dataAction: number

  ngOnInit(): void {    
  }

  onOk(){
    if(this.dataAction>0){
      this.dialogRef.close(this.dataAction)
    }
  }

}
