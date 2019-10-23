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
        Validators.pattern('\\+?\\d{6,15}$')
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
