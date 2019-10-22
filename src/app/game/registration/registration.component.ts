import {Component, OnInit} from '@angular/core';
import {GameService} from "../game.service";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-player',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  playerForm: FormGroup;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.playerForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10),
        Validators.pattern('[a-zA-Zа-яА-Я ]*')
      ]),
      phone: new FormControl('', [
        Validators.pattern('\\+(9[976]\\d|8[987530]\\d|6[987]\\d|5[90]\\d|42\\d|3[875]\\d|2[98654321]\\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\\d{1,14}$'),
        Validators.required
      ])
    });
  }

  onSubmit() {
    console.log("registration -> submit form");
    const phone = this.playerForm.get('phone').value;
    const name = this.playerForm.get('name').value;
    const start = new Date();


    this.gameService.startGameSession(phone, name, start)
      .then(() => console.log("registration -> redirect to game"))
      .then(() => this.router.navigate(['/game']))
      .catch(reason => console.warn("registration -> can't start game. " + reason));
  }
}
