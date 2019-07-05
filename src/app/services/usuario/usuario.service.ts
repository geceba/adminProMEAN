import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICE } from 'src/app/config/config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(public http: HttpClient) { }

  crearUsuario(usuario: Usuario) {
    let url = URL_SERVICE + '/usuario';

    return this.http.post(url, usuario).pipe(map(res => res))
    
  }
}
