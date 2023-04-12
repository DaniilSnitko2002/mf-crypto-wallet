import { Wallet } from './../models/wallet.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Coin } from '../models/coin.model';

@Injectable({
    providedIn: 'root'
})
export class CoinService {

    checkAction = new Subject<void>()

    constructor(private req: HttpClient) { }

    getCoins(): Observable<Coin[]>{
        return this.req.get<Coin[]>('http://localhost:5000/api/coin/getAll')
    }

    buyCoins(data:{crypto_id: string, user_id: string, quantity: number}){
        this.req.post('http://localhost:5000/api/action/buyCoin', data)
        .subscribe(res => {
            console.log(res)
            this.checkAction.next()
        })
    }

    sellCoins(data:{crypto_id: string, user_id: string, quantity: number}){
        this.req.post('http://localhost:5000/api/action/sellCoin', data)
        .subscribe(res => {
            console.log(res)
            this.checkAction.next()
        })
    }

    getUserCoins(userId: string): Observable<Wallet[]>{
        return this.req.post<Wallet[]>('http://localhost:5000/api/action/getUserCoins', {id: userId})
    }

    getCoinById(coinId: string): Observable<Coin>{
        return this.req.post<Coin>(`http://localhost:5000/api/coin/getById`, {id: coinId})
    }

}
