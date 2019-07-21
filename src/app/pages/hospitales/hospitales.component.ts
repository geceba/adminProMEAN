import { Component, OnInit } from '@angular/core';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/service.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  
  constructor(
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notification.subscribe(() => this.cargarHospitales());
  }

  cargarHospitales() {
    this._hospitalService.cargarHospital()
      .subscribe(hospitales => this.hospitales = hospitales);
  }
  guardarHospital(hospital: Hospital) {
    this._hospitalService.actualizarHospital(hospital).subscribe();
  }

  borrarHospital(hospital: Hospital) {
    
    this._hospitalService.borrarHospital(hospital._id).subscribe( resp => {
        this.cargarHospitales();
      });
  }

  buscarHospital(termino: string) {

    if(termino.length <= 0 ) {
      this.cargarHospitales();
      return;
    }

    this._hospitalService.buscarHospital(termino)
      .subscribe( hospitales => this.hospitales = hospitales);
  }

  crearHospital() {
    swal({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del hospital',
      content: 'input',
      icon: 'info',
      dangerMode: true
    }).then((valor:string) => {
      if(!valor || valor.length === 0) {
        return;
      }

      this._hospitalService.crearHospital(valor)
        .subscribe(()=>this.cargarHospitales());
    })
  }

  actualizarImagen(hospital: Hospital) {
    this._modalUploadService.mostrarModal('hospitales', hospital._id);
  }

}
