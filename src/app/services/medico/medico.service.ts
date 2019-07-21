import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICE } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';

import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { Medico } from 'src/app/models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarMedicos() {
    let url = URL_SERVICE + '/medico';

    return this.http.get(url).pipe(map((res: any) => {
      console.log(res)
      this.totalMedicos = res.total;
      return res.medicos;
    }));
  }

  cargarMedico(id: string) {
    let url = URL_SERVICE + '/medico/' + id;
    return this.http.get(url).pipe(map((res: any) => res.medico));
  }

  buscarMedicos(termino: string) {

    let url = URL_SERVICE + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.medicos));

  }

  borrarMedico(id: string) {
    let url = URL_SERVICE + `/medico/${id}`;
    url += '?token=' + this._usuarioService.token;

    const swal: SweetAlert = _swal as any;

    return this.http.delete(url).pipe(map((res: any) => {
      swal('Médico borrado', 'Médico borrado correctamente', 'success');
      return res;
    }));
  }

  guardarMedico(medico: Medico) {
    const swal: SweetAlert = _swal as any;
    let url = URL_SERVICE + '/medico';

    if (medico._id) {
      // actualizar Medico
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put(url, medico).pipe(map((res: any) => {
        swal('Médico Actualizado', medico.nombre, 'success');
        return res.medico;
      }));

    } else {
      // crear Medico
      url += '?token=' + this._usuarioService.token;


      return this.http.post(url, medico).pipe(
        map((resp: any) => {
          swal('Médico Creado', medico.nombre, 'success');
          return resp.medico;
        })

      );
    }

  }
}
