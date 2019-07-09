import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICE } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import * as swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(public http: HttpClient) { }

  crearUsuario(usuario: Usuario) {
    let url = URL_SERVICE + '/usuario';

    return this.http.post(url, usuario).pipe(map((res:any) => {
      swal('Usuario creado', usuario.email, 'success');
      return res.usuario;
    }))
    
  }

  login(usuario: Usuario, recordar: boolean = false) {
    let url = URL_SERVICE + '/login';

    if(recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    return this.http.post(url, usuario).pipe(map((res: any)=> {
      localStorage.setItem('id', res.id);
      localStorage.setItem('token', res.token);
      localStorage.setItem('usuario', JSON.stringify(res.usuario));

      return true;
    }));
  }
}
