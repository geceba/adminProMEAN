import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import  { SettingsService, 
  SharedService, 
  SidebarService, 
  UsuarioService, 
  LoginGuardGuard, 
  UploadFileService, 
  HospitalService,
  MedicoService
 } from './service.index';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ], 
  providers: [
    SettingsService,
    SharedService,
    SidebarService,
    UsuarioService,
    LoginGuardGuard,
    UploadFileService,
    ModalUploadService,
    HospitalService,
    MedicoService
  ]
})
export class ServiceModule { }
