import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICE } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { Router } from '@angular/router';
import { UploadFileService } from '../upload-file/upload-file.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(public http: HttpClient, public router: Router, public _uploadFileService: UploadFileService) {
    this.loadStorage();
  }

  logged() {
    return (this.token.length > 5 ? true : false);
  }

  loadStorage() {
    if (localStorage.getItem('token')) {
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

  actualizarUsuario(usuario: Usuario) {
    const swal: SweetAlert = _swal as any;
    let url = URL_SERVICE + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put(url, usuario).pipe(map((res: any) => {

      if (usuario._id === this.usuario._id) {

        let usuarioDB = res.usuario
        this.saveStorage(usuarioDB._id, this.token, usuarioDB);

      }

      swal('Usuario creado', usuario.nombre, 'success');
      return true;
    }));
  }

  cambiarImagen(file: File, id: string) {
    const swal: SweetAlert = _swal as any;

    this._uploadFileService.uploadFile(file, 'usuarios', id)
      .then((resp: any) => {
        this.usuario.img = resp.extencionArchivo.img;
        swal('Imagen actualizado', this.usuario.nombre, 'success');
        this.saveStorage(id, this.token, this.usuario);

      }).catch(resp => {
        console.log(resp)
      });
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

  cargarUsuarios(desde: number = 0) {
    let url = URL_SERVICE + '/usuario?desde=' + desde;

    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {

    let url = URL_SERVICE + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.usuarios));

  }

  borrarUsuario(id: string) {
    const swal: SweetAlert = _swal as any;

    let url = URL_SERVICE + '/usuario/' + id;

    url += '?token=' + this.token;

    return this.http.delete(url).pipe(map((res: any) => {
      swal('Usuario borrado', 'El usuario a sido eliminado correctamente', 'success');
      return true;
    }));
  }
}
