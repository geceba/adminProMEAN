import { Component, OnInit } from '@angular/core';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { UploadFileService } from 'src/app/services/service.index';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string;

  constructor(public _uploadFileService: UploadFileService, public _modalUploadService: ModalUploadService ) { }

  ngOnInit() {
  }

  selectImage(file: File) {
    const swal: SweetAlert = _swal as any;

    if (!file) {
      this.imagenSubir = null;
      return;
    }

    if(file.type.indexOf('image') < 0) {
      swal('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }
    
    this.imagenSubir = file;

    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(file);

    reader.onloadend = () => this.imagenTemp = reader.result as string;
  }
  
  uploadImage() {
    this._uploadFileService.uploadFile(this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id)
      .then(resp => {
        this._modalUploadService.notification.emit(resp);
        this.cerrarModal();
      }).catch(resp => {
        console.log("Error en la carga...")
      })
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;

    this._modalUploadService.ocultarModal();
  }

}
