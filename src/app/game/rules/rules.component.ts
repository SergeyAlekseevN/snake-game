import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {Player} from "../../db/player.model";


@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent {
  constructor(
    public dialogRef: MatDialogRef<RulesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { player: Observable<Player> }
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
