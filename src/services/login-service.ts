import {Injectable} from "@angular/core";
import {UserInfo} from "../model/user-info";
@Injectable()
export class LoginService {
    private userInfo: UserInfo;
  constructor() {
  }
  setUserInfo(user:UserInfo){
    this.userInfo = user;
  }
  getUserInfo(){
    return this.userInfo;
  }
}
