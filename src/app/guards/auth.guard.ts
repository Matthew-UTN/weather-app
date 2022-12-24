import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { User } from '../model/users';
import { AuthService } from '../service/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ValidUserGuard implements CanActivate {

    constructor(
        private auth: AuthService,
        private router: Router
        ) {
    }

    async canActivate() {
        let actual = this.auth.getAuthCurrentUser();
        if(actual && actual.uid && !actual.isAnonymous){
            let udata = await this.auth.getCurrentUserDoc();
            let user = udata.data() as User;
            if(!user.disabled)
                return true;
            this.auth.logout();
            return this.router.parseUrl('/');
        }else{
            return this.router.parseUrl('/');
        };
    }
}
