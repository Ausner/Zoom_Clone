import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PeerService } from 'src/app/peer.service';
import { WebSocketService } from 'src/app/web-socket.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  roomName:any;
  currentStream:any;
  listUser:Array<any> = [];

  constructor(private route:ActivatedRoute, private webSocketService:WebSocketService, private peerService:PeerService) { 
    this.roomName = route.snapshot.paramMap.get('id');
    
  }

  ngOnInit(): void {
    this.checkMediaDevice();
    this.initPeer();
    this.initSocket();
  }

  initPeer = () => {
    const {peer} = this.peerService.peer;
    peer.on('open', (id:any) => {
      const body = {
        idPeer: id,
        roomName: this.roomName
      };

      this.webSocketService.joinRoom(body);
     
    });



    peer.on('call', (callEnter:any) => {
      callEnter.answer(this.currentStream);
      callEnter.on('stream', (StreamRemote:any) => {
        this.addVideoUser(StreamRemote);
      })
    }, (error:any) =>  {console.log('Error Peer call : ', error)}
    );
  }


  initSocket = () => {
    this.webSocketService.cbEvent.subscribe((res:any) => {
      if(res.name == 'new-user'){
        const {idPeer} = res.data;

        this.sendCall(idPeer, this.currentStream);
      }
      
    })
  }

  checkMediaDevice = () => {
    if(navigator && navigator.mediaDevices){
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
      }).then((stream) => {
        this.currentStream = stream;
        this.addVideoUser(stream);
      }).catch(() => {
        console.log('Error - No permissions');
      })
    }else{
      console.log('Error - No media devices');
    }
  }

  addVideoUser = (stream:any) =>{
    this.listUser.push(stream);
    const Unique = new Set(this.listUser);
    this.listUser = [...Unique];
  }

  sendCall = (idPeer:any, stream:any) => {
    const newUserCall = this.peerService.peer.call(idPeer, stream);
    if(!newUserCall){
      newUserCall.On('stream', (userStream:any) => {
        this.addVideoUser(userStream);
      });
    }
  }

}
