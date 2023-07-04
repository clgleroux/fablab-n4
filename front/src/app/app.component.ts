import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'front';
  navigator: any = window.navigator;
  port!: any;
  takenPills: { ma: boolean; mi: boolean; so: boolean }[] = [];
  dayOfWeek = [
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
    'Dimanche',
  ];

  constructor(private toastrService: ToastrService) {}

  ngOnInit(): void {
    this.initToday();
  }

  async openPort() {
    const port = await this.navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    this.port = port;
    this.getInfoArduino(this.port);
  }

  async getInfoArduino(port: any) {
    while (port.readable) {
      const reader = port.readable.getReader();

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            // |reader| has been canceled.
            break;
          }
          // Do something with |value|…

          console.log(new TextDecoder().decode(value));

          if (new TextDecoder().decode(value) === '{motor:1}') {
            this.savePill();
          }

          if (new TextDecoder().decode(value) === '{buzzer:1}') {
            this.forgetPill();
          }
        }
      } catch (error) {
        // Handle |error|…
      } finally {
        reader.releaseLock();
      }
    }
  }

  async newPill() {
    // TODO : test
    if (this.port) {
      const encoder = new TextEncoder();
      const writer = this.port.writable.getWriter();
      await writer.write(encoder.encode('{motor:1}'));
      writer.releaseLock();
    }

    this.savePill();
  }

  savePill() {
    let today = moment().day();
    // 0 = sunday...
    if (today === 0) today = 7;

    let newPill: boolean = false;

    for (let parts in this.takenPills[today - 1]) {
      //@ts-ignore
      if (!this.takenPills[today - 1][parts]) {
        //@ts-ignore
        this.takenPills[today - 1][parts] = true;
        newPill = true;
        break;
      }
    }
    if (!newPill) {
      return this.toastrService.error('Un problème est survenu', 'Attention');
    }
    return this.toastrService.success('', 'Médicament pris');
  }

  initToday() {
    let today = moment().day();
    // 0 = sunday...
    if (today === 0) today = 7;

    for (let index = 1; index <= 7; index++) {
      if (index < today) {
        this.takenPills.push({ ma: true, mi: true, so: true });
      } else {
        this.takenPills.push({ ma: false, mi: false, so: false });
      }
    }
  }

  forgetPill() {
    return this.toastrService.error(
      'Vous avez oublié vos médicaments',
      'Attention'
    );
  }
}
