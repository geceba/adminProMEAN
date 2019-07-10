import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICE } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(public http: HttpClient, public router: Router ) { 
    this.loadStorage();
  }

  logged() {
    return ( this.token.length > 5 ? true : false ); 
  }

  loadStorage() {
    if(localStorage.getItem('token')) {
      this.token = localStorage.getItem('token')
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  crearUsuario(usuario: Usuario) {
    let url = URL_SERVICE + '/usuario';

    const swal: SweetAlert = _swal as any;

    return this.http.post(url, usuario).pipe(map((res: any) => {
      swal('Usuario creado', usuario.email, 'success');
      return res.usuario;
    }))

  }

  saveStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  logout() {
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);

  }

  login(usuario: Usuario, recordar: boolean = false) {
    let url = URL_SERVICE + '/login';

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    return this.http.post(url, usuario).pipe(map((res: any) => {
      this.saveStorage(res.id, res.token, res.usuario)
      return true;
    }));
  }

  loginGoogle(token: string) {
    let url = URL_SERVICE + '/login/google';

    return this.http.post(url, { token }).pipe(map((res: any) => {
      this.saveStorage(res.id, res.token, res.usuario)
        return true;
    }));
  }
}
