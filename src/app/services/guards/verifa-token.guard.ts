import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerifaTokenGuard implements CanActivate {

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router
  ) {

  }
  canActivate(): Promise<boolean> | boolean {
    let token = this._usuarioService.token;

    let payload = JSON.parse(atob(token.split('.')[1]));

    let expirado = this.expirado(payload.exp);

    if(expirado) {
      this.router.navigate(['/login']);
      return false
    }
    return this.verifaRenueva(payload.exp);
  }

  verifaRenueva(fechaExp: number): Promise<boolean> {
    return new Promise( (resolve, reject) => {
      let tokenExp = new Date(fechaExp * 1000);

      let ahora = new Date();

      ahora.setTime( ahora.getTime() + ( 4 * 60 * 60 * 1000));

      if(tokenExp.getTime() > ahora.getTime() ) {
        
        resolve(true);
      
      } else {

        this._usuarioService.renuevaToken()
          .subscribe( () =>  {
            resolve(true);
          }, () => {
            this.router.navigate(['/login']);
            reject(false);
          })

      }

      resolve(true);
    });
  }
  expirado(fechaExp:number) {
    let now = new Date().getTime() / 1000;

    if(fechaExp < now) {
      return true;
    } else {
      return false
    }
  }
}
