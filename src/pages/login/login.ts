import {Component, Output, EventEmitter} from "@angular/core";
import {NavController, AlertController, ToastController, MenuController, Events} from "ionic-angular";
import {HomePage} from "../home/home";
import {RegisterPage} from "../register/register";
import {Facebook, FacebookLoginResponse} from "@ionic-native/facebook";
import {LoginService} from "../../services/login-service";
import {HttpClient} from "@angular/common/http";
import {UserInfo} from "../../model/user-info";
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  xxx: BehaviorSubject<any>;
  userInfo: UserInfo;
  constructor(public nav: NavController, public forgotCtrl: AlertController, public menu: MenuController, public toastCtrl: ToastController,
     private fb: Facebook, private loginService:LoginService, private http:HttpClient, public events:Events) {
    this.menu.swipeEnable(false);
  }

  // go to register page
  register() {
    this.nav.setRoot(RegisterPage);
  }

  // login and go to home page
  login() {
    this.events.publish("userInfo", this.userInfo);
    this.nav.setRoot(HomePage);
    
  }

  loginFacebook(){
    this.fb.login(['email'])
    .then((res: FacebookLoginResponse) => {
      console.log("Logged in Facebook", res);
      // this.isLoggedIn = true;
      // this.loginType = 'fb';
      this.getFacebookData(res.authResponse.accessToken);
      this.login();
    })
    .catch(err => console.log("Error ",err));
  }

  // loginGoogle(){
  //   this.gg.login({})
  //   .then(res => {
  //     console.log(res);
  //     this.loginType = "gg";
  //     this.isLoggedIn = true;
  //     this.name = res["displayName"];
  //     this.email = res["email"];
  //   })
  //   .catch(err => console.log(err));
    
  // }
  getFacebookData(access_token:string){
    let url = "https://graph.facebook.com/me?fields=id,name,email&access_token=" + access_token;
    this.http.get(url).subscribe(data =>{
      this.userInfo = new UserInfo(data["name"], data["email"]);
      this.loginService.setUserInfo(this.userInfo);
      console.log(data);
    });
  }
  // logOut()
  // {
  //   switch(this.loginType){
  //     case "fb":
  //     this.logOutFacebook();
  //     break;
  //     default:
  //     this.logOutGoogle();    
  //   } 
  //   this.isLoggedIn = false;
  //     this.email = "";
  //     this.loginType = "";
  //     this.name = "";
  // }
  logOutFacebook(){
    this.fb.logout()
    .then(rs => {
      // console.log(rs);
      console.log("Fb log out");
      
    })
    .catch(err=> console.log("Fb log out error",err));
    
  }
  // logOutGoogle(){
  //   this.gg.logout()
  //   .then(res => {
      
  //     console.log(res);
  //     console.log("GG log out")
  //   })
  //   .catch(err => {
  //     console.log("GG log out error");
  //     console.log(err);
  //     this.isLoggedIn = false;
    
  //   });
    
  // }

  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: 'Forgot Password?',
      message: "Enter you email address to send a reset link password.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            console.log('Send clicked');
            let toast = this.toastCtrl.create({
              message: 'Email was sended successfully',
              duration: 3000,
              position: 'top',
              cssClass: 'dark-trans',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();
          }
        }
      ]
    });
    forgot.present();
  }

}
