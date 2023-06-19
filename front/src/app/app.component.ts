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
    this.port = port;
    console.log(port);
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
          console.log(value);
        }
      } catch (error) {
        // Handle |error|…
      } finally {
        reader.releaseLock();
      }
    }
  }

  async newPill() {
    const encoder = new TextEncoder();
    const writer = this.port.writable.getWriter();
    await writer.write(encoder.encode('{motor:1}'));
    writer.releaseLock();

    this.savePill();
  }

  savePill() {
    let today = moment().day();
    // 0 = sunday...
    if (today === 0) today = 7;

    let newPill: boolean = false;

    // for (let test in this.takenPills[today - 1]) {
    for (let test in this.takenPills[today]) {
      console.log(test);

      //@ts-ignore
      if (!this.takenPills[today][test]) {
        //@ts-ignore
        this.takenPills[today][test] = true;
        newPill = true;
        break;
      }
    }
    if (!newPill) {
      return this.toastrService.error('Error', 'Error');
    }
    return this.toastrService.success('Success', 'Success');
  }

  initToday() {
    let today = moment().day();
    // 0 = sunday...
    if (today === 0) today = 7;
    // Test pour lundi
    if (today === 1) today = 2;

    for (let index = 1; index <= 7; index++) {
      if (index < today) {
        this.takenPills.push({ ma: true, mi: true, so: true });
      } else {
        this.takenPills.push({ ma: false, mi: false, so: false });
      }
    }
    console.log(this.takenPills);
  }
}
