import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'front';
  navigator: any = window.navigator;

  async openPort() {
    const port = await this.navigator.serial.requestPort();
    console.log(port);
  }
}
