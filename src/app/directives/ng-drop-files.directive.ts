import { Directive, EventEmitter, ElementRef,
  HostListener, Input, Output } from '@angular/core';
import { FileItem } from '../models/file-item';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any){
    this._preventDetener(event);
    this.mouseSobre.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any){
    this.mouseSobre.emit(false);
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any){
    const transferencia = this._getTransferencia(event);
    if(!transferencia){
      return;
    }
    this._extraerArchivos(transferencia.files);
    this._preventDetener(event);
    this.mouseSobre.emit(false);
  }

  //Para compatibilidad, hay algunos navegadores que van con dataTransfer directamente
  //y otros en originalEvent
  private _getTransferencia(event: any){
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _extraerArchivos(archivosLista: FileList){
    for(const propiedad of Object.getOwnPropertyNames(archivosLista)){
      const archivoTemporal = archivosLista[propiedad];
      if(this._archivoEsValido(archivoTemporal)){
        const nuevoArchivo = new FileItem(archivoTemporal);
        this.archivos.push(nuevoArchivo);
      }

    }
  }

  //Validaciones
  private _archivoEsValido(archivo: File): boolean{
    if(!this._archivoFueDropeado(archivo.name)
      && this._validaImagen(archivo.type)){
        return true;
      }
      return false;
  }


  private _preventDetener(event){
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoFueDropeado(nombreArchivo: string): boolean{
    for(const archivo of this.archivos){
      if(archivo.nombreArchivo == nombreArchivo){
        console.log("Ya se ha dropeado ese archivo");
        return true;
      }
    }
    return false;
  }

  private _validaImagen(tipoArchivo: string): boolean{
    return (tipoArchivo === "" || tipoArchivo === undefined) ?
        false : tipoArchivo.startsWith('image');
  }

}
