import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any = [
    {
      titulo: "Principal",
      icono: "mdi mdi-gauge",
      submenu: [
        { titulo: 'Dashboard', url: '/dashboard'},
        { titulo: 'ProgressBar', url: '/progress'},
        { titulo: 'Promesas', url: '/promesas'},
        { titulo: 'Gráficas', url: '/graficas1'},
        { titulo: 'rxjs', url: '/rxjs'}
      ]
    },
    {
      titulo: 'Mantenimientos',
      icono: 'mdi mdi-folder-lock-open',
      submenu: [
        { titulo: 'Usuarios', url:'/usuarios' },
        { titulo: 'Hospitales', url:'/hospitales' },
        { titulo: 'Medicos', url:'/medicos' },
      ]
    }
  ];

  constructor() { }
}
