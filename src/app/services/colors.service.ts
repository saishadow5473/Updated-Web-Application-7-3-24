import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorsService {

  constructor() { }

  public consultTypeColors: string[] = [
    "#d46bd2",
    "#6abf64",
    "#df8b05",
    "#be4bdc",
    "#f53f00",
    "#8B8B00",
    "#704DFF",
    "#FF9912",
    "#DC143C",
    "#7468BE"
  ];

  public consultSpecialityColors: string[] = [
    "#fd7e15", 
    "#6f42c1bd", 
    "#f782ac", 
    "#65bc87", 
    "#f53f00", 
    "#be4bdc", 
    "#704DFF", 
    "#FF9912", 
    "#DC143C", 
    "#7468BE"
  ]

}
