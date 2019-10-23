import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {timer} from "rxjs";
import {takeWhile} from "rxjs/operators";

@Component({
  selector: 'app-timer',
  template: '{{getTime()}}'
})
export class TimerComponent implements OnDestroy, OnInit {
  isStopped = false;
  @Input() seconds: number = 3 * 60;
  @Output() onTimeout = new EventEmitter<void>();
  ngOnDestroy(): void {
    this.stop();
  }

  ngOnInit(): void {
    this.start();
  }

  stop() {
    this.isStopped = true;
  }

  start() {
    this.isStopped = false;
    timer(0, 1000)
      .pipe(takeWhile(value => this.isStopped === false))
      .subscribe(() => {
        this.seconds--;
        if (this.seconds <= 0) {
          this.onTimeout.emit();
          this.stop();
        }
      });
  }

  getTime(): String {
    const t = this.getDisplayTimer(this.seconds);
    return t.minutes.digit1 + t.minutes.digit2 + "' " + t.seconds.digit1 + t.seconds.digit2 + "\"";
  }

  getDisplayTimer(time: number) {
    const hours = '0' + Math.floor(time / 3600);
    const minutes = '0' + Math.floor(time % 3600 / 60);
    const seconds = '0' + Math.floor(time % 3600 % 60);

    return {
      hours: {digit1: hours.slice(-2, -1), digit2: hours.slice(-1)},
      minutes: {digit1: minutes.slice(-2, -1), digit2: minutes.slice(-1)},
      seconds: {digit1: seconds.slice(-2, -1), digit2: seconds.slice(-1)},
    };
  };
}
