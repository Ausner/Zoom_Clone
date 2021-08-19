import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-bottom',
  templateUrl: './menu-bottom.component.html',
  styleUrls: ['./menu-bottom.component.css']
})
export class MenuBottomComponent implements OnInit {
  menu: Array<any> = [
    {name:'Mute', icon:'uil uil-microphone'},
    {name:'Home', icon:'uil uil-estate'},
    {name:'Share', icon:'uil uil-share'},
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
