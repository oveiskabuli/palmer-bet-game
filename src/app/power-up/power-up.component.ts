import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare global {
  interface Window {
    handleUnityMessage: (message: any) => void;
  }
}

declare function createUnityInstance(a: any, b: any, c: any): any;

@Component({
  selector: 'app-power-up',
  templateUrl: './power-up.component.html',
  styleUrls: ['./power-up.component.scss'],
})
export class PowerUpComponent implements AfterViewInit {
  @ViewChild('gameContainer') gameContainer?: ElementRef;
  @ViewChild('gameCanvas') gameCanvas?: ElementRef;
  @ViewChild('gameLoadingBar') gameLoadingBar?: ElementRef;
  @ViewChild('gameProgressBarFull') gameProgressBarFull?: ElementRef;
  unityInstance: any;
  betId?: string;
  baseUrl?: string;
  token?: string;

  constructor(
    private _renderer: Renderer2,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.betId = this._activatedRoute.snapshot.queryParams['betId'];
    this.baseUrl = this._activatedRoute.snapshot.queryParams['baseUrl'];
    this.token = this._activatedRoute.snapshot.queryParams['token'];
    this._renderer.setStyle(
      this.gameLoadingBar?.nativeElement,
      'display',
      'block'
    );
    const script = this.loadGameScript();
    this.gameContainer?.nativeElement?.appendChild(script);
  }

  private loadGameScript(): HTMLScriptElement {
    const buildUrl = 'assets/power-up-game/Build';
    const config = {
      dataUrl: buildUrl + '/palmerbet.data.unityweb',
      frameworkUrl: buildUrl + '/palmerbet.framework.js.unityweb',
      codeUrl: buildUrl + '/palmerbet.wasm.unityweb',
      streamingAssetsUrl: 'StreamingAssets',
      companyName: 'FanStudio',
      productName: 'UnityPalmerbet',
      productVersion: '0.1.0',
    };
    const script = document.createElement('script');
    script.async = false;
    script.type = 'text/javascript';
    script.src = 'assets/power-up-game/Build/palmerbet.loader.js';
    script.onload = () => {
      createUnityInstance(
        this.gameCanvas?.nativeElement,
        config,
        (progress: any) => {
          const width = 100 * progress + '%';
          this._renderer.setStyle(
            this.gameProgressBarFull?.nativeElement,
            'width',
            width
          );
        }
      )
        .then((unityInstance: any) => {
          this._renderer.setStyle(
            this.gameLoadingBar?.nativeElement,
            'display',
            'none'
          );
          this.unityInstance = unityInstance;
          window.handleUnityMessage = this.handleUnityMessage.bind(this);
        })
        .catch((message: any) => {
          console.error(message);
        });
    };
    return script;
  }

  private handleUnityMessage(message: string): void {
    if (message === 'gameInfo') {
      // this base url is used by game to make start game and end game api calls
      const baseURL = this.baseUrl + '/';
      const betId = this.betId;
      const authorizationToken = this.token;

      const obj = {
        baseURL,
        gameType: 'PowerUp',
        betId,
        authorizationToken,
      };

      const message = JSON.stringify(obj);
      this.unityInstance?.SendMessage(
        'ExternalMessaging',
        'ReceiveMessage',
        message
      );
    } else {
      this._renderer.setStyle(
        this.gameCanvas?.nativeElement?.parentElement?.parentElement,
        'visibility',
        'hidden'
      );
      this.unityInstance?.Quit();
      this.unityInstance = null;
    }
  }
}
