import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Coin } from '../models/coin.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { CoinService } from '../services/coin.service';
import { ActionDialogComponent } from './action-dialog/action-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  coins: Coin[] = []
  user: User
  inputValue: string
  actionCoinId: string
  actionSub: Subscription
  @ViewChild(MatPaginator) set paginator (paginator: MatPaginator){
    this.dataSource.paginator = paginator;
  };
  
  dataSource: MatTableDataSource<Coin> = new MatTableDataSource<Coin>()
  displayedColumns: string[] = ['icon','name', 'value', 'stock', 'in_property','actions'];

  constructor(private coinService: CoinService,
    private authService: AuthService, 
    private router: Router, 
    private dialog: MatDialog) {}

  ngOnDestroy(): void {
    this.actionSub.unsubscribe()
  }

  filter(){
    this.dataSource.filter = this.inputValue.trim().toLowerCase();
  }

  ngOnInit(): void {

    this.user = JSON.parse(sessionStorage.getItem('user'))
    const userDataId = this.user.user_id
    this.gettingUser(userDataId)
    this.gettingCoins()
    this.gettingUserCoins()

    this.actionSub = this.coinService.checkAction.subscribe(() => {
        this.gettingUser(userDataId)
        this.gettingNewStockCoinById(this.actionCoinId)
        this.gettingUserCoins()
    })
  }

  
  openDialog(action: string, coinId: string): void {
    const DIALOG = this.dialog.open(ActionDialogComponent, {
      width: '500px',
      data: action
    });

    DIALOG.afterClosed().subscribe(data => {
      if(!!data){
        this.action(coinId, this.user.user_id, data, action)
      }
    })
  }

  logOut(){
    sessionStorage.clear()
    this.router.navigate(['auth'])
  }

  gettingUserCoins(){
    this.coinService.getUserCoins(this.user.user_id)
    .subscribe(userCoins => {
      if (userCoins.length === 0){
      }else{
        userCoins.forEach(coin => {
          this.dataSource.data.forEach(element => {
            if(element.crypto_id == coin.crypto_id){
              element.in_property=coin.quantity
              element.can_sell = false
              if(element.in_property != 0){
                element.can_sell = true
              }
            }
          })
        })
      }      
    })

  }

  gettingUser(userData){
    this.authService.getUserById(userData)
    .subscribe(resUser => {
      if(!!resUser){
        const user: User = resUser
        sessionStorage.setItem('user', JSON.stringify(user))
        this.user = user
      }
    })
  }

  coinImg(name: string){
    return `../../assets/coinImg/${name}.png`
  }

  action(cryptoId: string, userId: string, quantity: string, action: string){
    const values = {
      crypto_id: cryptoId,
      user_id: userId,
      quantity: +quantity
    }
    this.actionCoinId = cryptoId

    if(action == 'buy'){
      this.coinService.buyCoins(values)
    }else if(action == 'sell'){
      this.coinService.sellCoins(values)
    }
  }

  gettingNewStockCoinById(id: string){
    this.coinService.getCoinById(id).subscribe(coin => {
      this.dataSource.data.forEach(searchCoin => {
        if(searchCoin.crypto_id == coin.crypto_id) {
          searchCoin.stock = coin.stock
        }
      })
      console.log(coin)
    })
  }

  gettingCoins(){
    this.coinService.getCoins().subscribe(
      coins=> {
        this.dataSource.data = coins

        this.dataSource.data.forEach(element => {
          element.in_property = 0
          element.can_sell = false
        })
      }
    )
  }

}