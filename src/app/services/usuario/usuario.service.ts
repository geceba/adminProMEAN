import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICE } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { Router } from '@angular/router';
import { UploadFileService } from '../upload-file/upload-file.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];
  swal: SweetAlert = _swal as any;

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
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  crearUsuario(usuario: Usuario) {
    let url = URL_SERVICE + '/usuario';

    

    return this.http.post(url, usuario).pipe(map((res: any) => {
      this.swal('Usuario creado', usuario.email, 'success');
      return res.usuario;
    }), catchError(err => {
      
      this.swal(err.error.mensaje, err.error.errros.message, 'error');
      return Observable.throw(err);
    }));

  }

  actualizarUsuario(usuario: Usuario) {
    
    let url = URL_SERVICE + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put(url, usuario).pipe(map((res: any) => {

      if (usuario._id === this.usuario._id) {

        let usuarioDB = res.usuario
        this.saveStorage(usuarioDB._id, this.token, usuarioDB, this.menu);

      }

      this.swal('Usuario actualizado', usuario.nombre, 'success');
      return true;
    }),  catchError(err => {
      this.swal(err.error.mensaje, err.error.errros.message, 'error');
      return Observable.throw(err);
    }));
  }

  cambiarImagen(file: File, id: string) {
    

    this._uploadFileService.uploadFile(file, 'usuarios', id)
      .then((resp: any) => {
        this.usuario.img = resp.extencionArchivo.img;
        this.swal('Imagen actualizado', this.usuario.nombre, 'success');
        this.saveStorage(id, this.token, this.usuario, this.menu);

      }).catch(resp => {
        console.log(resp)
      });
  }

  saveStorage(id: string, token: string, usuario: Usuario, menu:any ) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

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
      this.saveStorage(res.id, res.token, res.usuario, res.menu)
      return true;
    }), catchError(error => {
      this.swal('Error en el login', error.error.mensaje, 'error');
      throw error;
    }));
  }

  loginGoogle(token: string) {
    let url = URL_SERVICE + '/login/google';

    return this.http.post(url, { token }).pipe(map((res: any) => {
      this.saveStorage(res.id, res.token, res.usuario, res.menu)
      console.log(res)
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
    

    let url = URL_SERVICE + '/usuario/' + id;

    url += '?token=' + this.token;

    return this.http.delete(url).pipe(map((res: any) => {
      this.swal('Usuario borrado', 'El usuario a sido eliminado correctamente', 'success');
      return true;
    }));
  }
}
