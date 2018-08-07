import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from './config.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthenticationTokenInterceptor } from './http-interceptors/authentication-token.interceptor';
import { OccClientAuthenticationTokenService } from '@auth/services/client-authentication/client-authentication-token.service';
import * as fromGuards from './guards';

import { StoreModule } from '@ngrx/store';
import { reducers } from '@auth/store/reducers';
import { effects } from '@auth/store/effects';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('auth', reducers),
    EffectsModule.forFeature(effects)
  ],
  providers: [OccClientAuthenticationTokenService]
})
export class AuthModule {
  static forRoot(config: any): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        ...fromGuards.guards,
        {
          provide: ConfigService,
          useExisting: config
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthenticationTokenInterceptor,
          multi: true
        }
      ]
    };
  }
}
