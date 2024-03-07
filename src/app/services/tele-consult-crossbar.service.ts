import { Injectable } from '@angular/core';
import { ConstantsService } from 'src/app/services/constants.service';

export interface Channel{
    channel_name:string;
    subscription?:any;
    subscription_handler:any;
}

export interface CrossbarDataSharing{
    // Required fields
    sender_id:string|number;
    sender_session_id:number;
    
    // Optional fields
    receiver_ids?:(string|number)[];
    // receiver_session_ids?:number[];
    
    data?:{};
}

export interface PublishToChannelOptions{
  exclude?:number[];
  eligible?:number[];
  receiver_ids?:(string|number)[];
}


// const USER_TYPES = ['ihl_user', 'ihl_doctor'];

declare var autobahn: any;
@Injectable({
  providedIn: 'root'
})
export class TeleconsultationCrossbarService {
    connection:any;
    wsurl:string;
    realm:string;
    user_type:string;
    subscription_channels_list:Channel[] = [];
    session:any;
    session_id:number;
    private _is_connected:boolean = false;
    
    user_id:string;

    on_connection_established:Function;
    
    on_connection_closed:Function; 

    get is_connected(){
      return this._is_connected;
    }

    constructor(private _constant: ConstantsService) {
        this.wsurl = this._constant.ihlCrossbarWS;
        this.realm = this._constant.ihlCrossbarRealm;
    }

  connect(options:any = {}):void{
      this.wsurl = 'wsurl' in options? options['wsurl']: this.wsurl;
      this.realm = 'realm' in options? options['realm']: this.realm;
    //   if(options['user_type'] == undefined || options['user_type'] in USER_TYPES == false){
    //       console.error('User type is not valid');
    //       return;
    //   }
    //   this.user_type = options['user_type'];
      this.subscription_channels_list =  options['subscription_channels_list'] || [];    
      this.connection = new autobahn.Connection({transports: [{'type': 'websocket','url': this.wsurl}],realm: this.realm});
      
      
      this.connection.onopen = (session, details)=>{
          console.log('Connection opened');
          this._is_connected = true;
          this.session = session;
          this.session_id = session.id;
          this.subscribeToChannels(session);
          if(typeof this.on_connection_established == "function")
            this.on_connection_established();
      }
      this.connection.onclose = (reason, details)=>{
          console.log('Connection closed');
          this._is_connected = false;
          if(typeof this.on_connection_closed == 'function')
            this.on_connection_closed();
      }
      this.connection.open();
  }

  subscribeToChannels(session:any):void{

    let _arr = [];
    this.subscription_channels_list.forEach(item=>{
      _arr.push(session.subscribe(item.channel_name, (res)=>{this.onMessageFromSubscription(res,item.subscription_handler)}));
    });
    // console.log(_arr);
    Promise.all(_arr).then(res=>{
      console.log(res);
      let _len = res.length;
      for(let i=0; i<_len; i++){
        this.subscription_channels_list[i].subscription = res[i];
      }
    });
    // this.subscription_channels_list.forEach((item)=>{
    //     session.subscribe(item.channel_name, (res)=>{this.onMessageFromSubscription(res,item.subscription_handler)}).then((subscription)=>{
    //          item.subscription = subscription;
    //          console.log(item);
    //     }, 
    //     (error)=>{
    //         console.log(error);
    //     });
    // });

  }

  subscribeToChannel(channel_name, subscrition_handler):Promise<boolean>{
    return new Promise((resolve, reject)=>{
      this.session.subscribe(channel_name, (res)=>{this.onMessageFromSubscription(res, subscrition_handler)}).then(res=>{
        this.subscription_channels_list.push({
          'channel_name':channel_name,
          'subscription':res,
          'subscription_handler':subscrition_handler
        });
        resolve(true);
      });
    });
    Promise.all([
      this.session.subscribe(channel_name, (res)=>{this.onMessageFromSubscription(res, subscrition_handler)})
    ]).then(res=>{
      this.subscription_channels_list.push({
        'channel_name':channel_name,
        'subscription':res[0],
        'subscription_handler':subscrition_handler,
      });  
    });
  }

  onMessageFromSubscription(res, subscription_handler){
    if(res.length != 1) return;
    let receiver_id = [];
	  let cmd = "";
    if('receiver_ids' in res[0] && (res[0]['receiver_ids'] as Array<string|number> || []).find(item=>{return item == this.user_id}) == undefined){
      return;
    }

    receiver_id = res[0]['receiver_ids'];
    if ('cmd' in res[0]) {
	  	cmd = res[0]['cmd'];
	  }
    let parms = res[0]['data'] || {};
    let sender_id = res[0]['sender_id'] || undefined;
    let sender_session_id = res[0]['sender_session_id'] || undefined;
    subscription_handler(parms, sender_id, sender_session_id, receiver_id, cmd);
  }

  // Handle the Promise returned by publish
  publishToChannel(channel_name:string, _data:{}, _options:PublishToChannelOptions):void{
    if(this.is_connected == false || this.session == undefined) return;
    let _user_id = this.user_id;
    let _session_id = this.session_id;
    let options = {};
    if('exclude' in _options && _options['exclude'].length != 0) options['exclude'] = _options['exclude'];
    if('eligible' in _options && _options['eligible'].length != 0) options['eligible'] = _options['eligible'];
    
    let _crossbarDataSharing:CrossbarDataSharing = {
      'sender_id':_user_id,
      'sender_session_id':_session_id
    };
    if('receiver_ids' in _options && _options['receiver_ids'].length != 0) _crossbarDataSharing['receiver_ids'] = _options['receiver_ids'];
    _crossbarDataSharing['data'] = _data;
    console.log(_crossbarDataSharing);
    console.log(_options);
    this.session.publish(channel_name, [_crossbarDataSharing], {}, options);
  }

  // TODO: Unsubscribe to channel


  getChannelList():Channel[]{
    if(this.is_connected == false) return [];
    return this.subscription_channels_list;
  }
  
  /*
    Returns Promise of type Boolean
    @param channel_name : Name of channel to unsubscribe
    Desscription: Unsubscribe to channel. Returns true either successful unsubscription or if channel does not exist else false
  */
  unSubscribeToChannel(channel_name):Promise<boolean>{
    let _sub_obj:Channel = undefined;
    this.subscription_channels_list = this.subscription_channels_list.filter((item:Channel)=>{
      if(item.channel_name == channel_name){
        _sub_obj = item;
        return false;
      }
      return true;
    });
    this.subscription_channels_list = this.subscription_channels_list
    if(_sub_obj == undefined || _sub_obj.subscription == undefined || _sub_obj.subscription == null){
      return Promise.resolve(true);
    }
    if(this.session == undefined || this.session == null) return Promise.resolve(false);
    return this._unSubscribeToChannel(_sub_obj.subscription);
  }
  
  /*
    @param: subscription object
  */
  private _unSubscribeToChannel(subscription):Promise<boolean>{
    return Promise.resolve(this.session.unsubscribe(subscription));
  }
  
  /*
    Description: Closes the Websocket connection by first closing the exisiting subscription
  */
  closeConnection():void{
    if(this.session == undefined || this.connection == undefined || this.is_connected == false) return;
    let _arr = [];
    _arr = this.subscription_channels_list.map(item=>{return this._unSubscribeToChannel(item.subscription);});
    this._is_connected = false;
    if(_arr.length == 0){
      this.connection.close();
    }else{
      Promise.all(_arr).then(res=>{this.connection.close()})
    }
  }

  /*
    Return: Boolean. True if channel name found alse false
    @param channel_name: Mandatory, name of the channel
    @param subscription_handler: Optional
    Description: Update subscription function for the channel name
  */
  updateSubscriptionFunctionHandler(channel_name:string, subscription_handler?:Function):boolean{
    if(subscription_handler == undefined) subscription_handler = ()=>{}
    let _channel = this.subscription_channels_list.find(item=>{return item.channel_name == channel_name});
    if(_channel == undefined) return false;
    _channel.subscription_handler = subscription_handler;
    return true;
  }
}