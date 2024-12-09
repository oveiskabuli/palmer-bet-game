import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-power-up',
  templateUrl: './power-up.component.html',
  styleUrls: ['./power-up.component.scss'],
})
export class PowerUpComponent implements OnInit {
  constructor(private _activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const betId = this._activatedRoute.snapshot.queryParamMap.get('betId');
    const baseUrl = this._activatedRoute.snapshot.queryParamMap.get('baseUrl');
    console.log(betId, baseUrl);
  }
}
