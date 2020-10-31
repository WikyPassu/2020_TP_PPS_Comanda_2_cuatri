import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InputVerifierService {

  constructor() { }

  /**
   * 
   * @param email : String. Correo a ser verificado.
   * Si tiene un formato valido retorna true, caso contrario retorna false.
   */
  static verifyEmailFormat(email : string){
    return email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) != null;
  }

  /**
   * 
   * @param pass : String. Clave a ser verificada.
   * Retorna un numero del 0 al 4 indicando cuan fuerte es la contraseña. Los factores que suman
   * puntaje son: letras minusculas (+1), letras mayusculas (+1), numeros (+1), simbolos (+1).
   * El largo minimo para que la contraseña se considere valida es de 6 caracteres.
   */
  static verifyPasswordStrength(pass : string) : number{
    let strenght : number = 0;
    if(pass.length >= 6){
      if(pass.match(/[a-z]/)){ strenght++ }
      if(pass.match(/[A-Z]/)){ strenght++ }
      if(pass.match(/[0-9]/)){ strenght++ }
      if(pass.match(/[$-/:-?{-~!"^_`\[\]]/)){ strenght++ }
    }
    return strenght;
  }
}
