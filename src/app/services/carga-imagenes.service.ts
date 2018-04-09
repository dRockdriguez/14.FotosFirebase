import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { FileItem } from '../models/file-item';

@Injectable()
export class CargaImagenesService {

  private carpetaImagenes: string = "img";
  constructor(
    private db: AngularFirestore
  ) { }

  private guardarImage(imagen: {nombre: string, url: string}){
    this.db.collection(`/${this.carpetaImagenes}`)
    .add(imagen);
  }


  cargarImagenesFirebase(imagenes:FileItem[]){
    const storageRef = firebase.storage().ref();

    for(const item of imagenes){
      item.estaSubiendo = true;
      if(item.progreso >= 100){
        continue;//Ya se subió
      }
      const uploadTask: firebase.storage.UploadTask =
        storageRef.child(`${this.carpetaImagenes}/${item.nombreArchivo}`)
        .put(item.archivo);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot: firebase.storage.UploadTaskSnapshot) => {
            item.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            console.error(error);
          },
          () => {
            console.log("Imágen subida");
            item.url = uploadTask.snapshot.downloadURL;
            item.estaSubiendo = false;
            this.guardarImage({
              nombre: item.nombreArchivo,
              url: item.url
            });
          }

        );
    }
    console.log(imagenes);
  }

}
