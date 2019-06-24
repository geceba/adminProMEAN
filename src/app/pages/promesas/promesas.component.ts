import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() {
    this.contarTre().then(
      () => console.log('terminó')
    ).catch(error => console.log("error en la promesa", error))
  }

  ngOnInit() {
  }

  contarTre(): Promise<boolean> {
    return new Promise((resolve, reject) => {

      let contador = 0;

      let intervalo = setInterval(() => {
        contador += 1;
        if (contador === 3) {
          resolve(true);
          clearInterval(intervalo);
        }
      }, 1000);
    });
  }

}
