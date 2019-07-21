import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICE } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';

import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { Hospital } from 'src/app/models/hospital.model';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  totalHospitales:number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarHospital() {
    let url = URL_SERVICE + '/hospital';

    return this.http.get(url).pipe(map( (res: any) => {
      this.totalHospitales = res.total;
      return res.hospitales;
    }));
  }

  obtenerHospital(id:string) {
    let url = URL_SERVICE + '/hospital/' + id;
    return this.http.get(url).pipe(map( (res:any) => res.hospital));
  }

  borrarHospital(id:string) {
    let url = URL_SERVICE + '/hospital/' + id;
    url += `?token=${this._usuarioService.token}`;
    const swal: SweetAlert = _swal as any;

    return this.http.delete(url).pipe(map( () => {
      swal('Hospital Borrado', 'Eliminado correctament', 'success');
    }));
  }

  crearHospital(nombre: string) {
    let url = URL_SERVICE + '/hospital/';
    url += `?token=${this._usuarioService.token}`;

    return this.http.post(url, { nombre }).pipe(map((resp: any) => resp.hospital ));
  }

  buscarHospital(termino: string) {
    let url = URL_SERVICE + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get(url)
      .pipe(map((resp: any) => resp.hospitales));
  }

  actualizarHospital(hospital: Hospital) {
    let url = URL_SERVICE + '/hospital/' + hospital._id;
    url += `?token=${this._usuarioService.token}`;
    const swal: SweetAlert = _swal as any;

    return this.http.put(url, hospital).pipe(map((res:any) => {
      swal('hospital actualizado', hospital.nombre, 'success');
      return res.hospital;
    }));

  }
}
