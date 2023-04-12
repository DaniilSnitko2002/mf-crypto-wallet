import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isError = new Subject<string>()

  constructor(private req: HttpClient) { }

  addUser(newUser: User): Observable<string>{
    return this.req.post<string>('http://localhost:5000/api/user/add', newUser)
  }

  getUser(userData: {email: string, password: string}): Observable<User>{
    return this.req.post<User>('http://localhost:5000/api/user/get', userData)    
  }

  getUserById(userId: string){
    return this.req.get<User>(`http://localhost:5000/api/user/${userId}`)    
  }

  isAuthenticated(){
    const userPromise = new Promise(res => {
      const user = sessionStorage.getItem('user')
      if(!!user){
        res(true)
      }else{
        res(false)
      }
    })
    return userPromise
  }
}
