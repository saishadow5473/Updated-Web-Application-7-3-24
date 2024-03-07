import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';

export interface JitsiInitInterface{
  room_id: string;
  displayName: string;
  onload ?: Function;  
}
declare var JitsiMeetExternalAPI:any;
@Injectable({
  providedIn: 'root'
})
export class TeleconsultationJitsiService {

    public _is_connected:boolean = false;
    jitsiMeetExternalAPI:any = undefined;
    
    displayName:string = '';

    // Events
    _jitsi_onload:Function = undefined;
    _jitsi_onHangup:Function = undefined;
    _jitsi_onParticipantJoined:Function = ()=>{};
    _jitsi_onVideoConferenceJoined:Function = ()=>{};
    _jitsi_onParticipantLeft:Function = ()=>{};
    
    _is_videoConferenceLeftFired:boolean = false;
    
    constructor(private _constant: ConstantsService){}

    init(options:JitsiInitInterface){
      if(this._is_connected == true) return;
      if(JitsiMeetExternalAPI == undefined || JitsiMeetExternalAPI == undefined || typeof(JitsiMeetExternalAPI) != 'function'){
        console.error('JitsiMeetExternalAPI is not defined or not valid');
      }
      if('room_id' in options == false || options['room_id'].length == 0) return;
      if('displayName' in options == false || options['displayName'].length == 0) options['displayName'] = 'Ihl User';
      this.displayName = options['displayName'];

      let teleConsultVideoId = '';

      if (Object.keys(this._constant.liveCallCourseObj).length === 0)
        teleConsultVideoId = 'teleConsultationVideoCallFrameleft';
      else
        teleConsultVideoId = 'teleConsultationVideoCallFrame';
      // due to jitsi library changes below condition is commented due to repeated logic
      this._jitsi_onload = ()=>{
        this._is_connected = true; 
        document.getElementById('teleConsultationVideoCallFrameMessage').style.display = 'none';
        if (teleConsultVideoId == 'teleConsultationVideoCallFrameleft')
          document.getElementById('teleConsultationVideoCallFrameWindow').style.display = 'inline-flex';
        document.getElementById('teleConsultationVideoCallFrame').style.backgroundColor = '#fff';
        // options['onload'](); // commented for jitsi library changes
      }
      // commented for jitsi library changes
      /*
      if('onload' in options){
        this._jitsi_onload = ()=>{
          this._is_connected = true; 
          document.getElementById('teleConsultationVideoCallFrameMessage').style.display = 'none';
          if (teleConsultVideoId == 'teleConsultationVideoCallFrameleft')
            document.getElementById('teleConsultationVideoCallFrameWindow').style.display = 'inline-flex';
          document.getElementById('teleConsultationVideoCallFrame').style.backgroundColor = '#fff';
          // options['onload'](); // commented for jitsi library changes
        }
      }else{
        this._jitsi_onload = ()=>{
          this._is_connected = true;
          document.getElementById('teleConsultationVideoCallFrameMessage').style.display = 'none';
          if (teleConsultVideoId == 'teleConsultationVideoCallFrameleft')
            document.getElementById('teleConsultationVideoCallFrameWindow').style.display = 'inline-flex';  
          document.getElementById('teleConsultationVideoCallFrame').style.backgroundColor = '#fff';
        }
      }
      */      
      this._jitsi_onload();
      let _options = {
        roomName: options['room_id'],
        parentNode : document.getElementById(teleConsultVideoId),
        // parentNode : document.getElementById('teleConsultationVideoCallFrameleft'),
        width: '100%',
        height: '100%',
        // onload: ()=>{this._jitsi_onload()}, // due to changes in library issue created, so called initially
        userInfo : {
          displayName: this.displayName,
        },
        interfaceConfigOverwrite:{
          JITSI_WATERMARK_LINK: 'https://www.indiahealthlink.com',
    			NATIVE_APP_NAME: 'India Health Link Meet',
    			TOOLBAR_BUTTONS:['hangup','microphone','camera','fullscreen','chat','videoquality'],
    			HIDE_INVITE_MORE_HEADER: true,
    			RECENT_LIST_ENABLED: false
        },
        configOverwrite: {
          startAudioOnly: false,
			    apiLogLevels: [],
        }
      }
      this._is_videoConferenceLeftFired = false;
      this.jitsiMeetExternalAPI = new JitsiMeetExternalAPI(this.domain, _options);
      this.jitsiMeetExternalAPI.executeCommand('subject', ' ');
      this.jitsiMeetExternalAPI.on('readyToClose', ()=>{
        console.log('Jitsi disconnected');
        this._constant.videoCallStart = false;
        this._constant.videoWindow = false;
        this.jitsiMeetExternalAPI = undefined;
        this._is_connected = false;
        this._jitsi_onParticipantJoined = ()=>{};
        this._jitsi_onVideoConferenceJoined = ()=>{};
        this._jitsi_onParticipantLeft = ()=>{};
        if(this._jitsi_onHangup != undefined && typeof this._jitsi_onHangup == "function"){
          this._jitsi_onHangup();
        }
      });
      this.jitsiMeetExternalAPI.on('participantJoined', (res)=>{
        console.error('----->Participant Joinded', res);
        this._jitsi_onParticipantJoined(res);
      });
      this.jitsiMeetExternalAPI.on('videoConferenceJoined', (res)=>{
        console.error('-------> Video Coonference joined ', res);
        this._jitsi_onVideoConferenceJoined(res);
        this.jitsiMeetExternalAPI.executeCommand('displayName', this.displayName);
      });
      this.jitsiMeetExternalAPI.on('participantLeft', (res)=>{
        console.error('----->Participant Left', res);
        this._jitsi_onParticipantLeft(res);
      })
      this.jitsiMeetExternalAPI.on('videoConferenceLeft', (res)=>{
        this._is_videoConferenceLeftFired = true;
      })
      console.error(this.jitsiMeetExternalAPI);
    }
    
    endJitsiCall(){
      console.log('Disconnecting Jitsi');
      if(this.jitsiMeetExternalAPI == undefined) return;
      this.jitsiMeetExternalAPI.executeCommand('hangup');
    }
    
    async getParticipantsList():Promise<any>{
      return new Promise(async (resolve, reject)=>{
        if(this.is_connected == false || this.jitsiMeetExternalAPI == undefined || this.jitsiMeetExternalAPI._myUserID == undefined){
          resolve([]);
        } 
        resolve(await this.jitsiMeetExternalAPI.getParticipantsInfo());
      });
    }
    
    
    getNumberOfParticipants():number{
      if(this.is_connected == false || this.jitsiMeetExternalAPI == undefined || this.jitsiMeetExternalAPI._myUserID == undefined){
        return 0;
      } 
      return (this.jitsiMeetExternalAPI.getNumberOfParticipants()) as number;
    }

    getMyJitsiId():string{
      if(this._is_connected == false || this.jitsiMeetExternalAPI == undefined) return '';
      return this.jitsiMeetExternalAPI._myUserId as string;
    }
    
    get is_connected():boolean{
      return this._is_connected;
    }
    get domain():string{
      return 'meet.indiahealthlink.com';
      // return 'meet.jit.si';
    }
}