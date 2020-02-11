import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
    isLoggedIn = false;
    private userSub: Subscription;

    constructor(private dataStorageService: DataStorageService, private authService: AuthService) { }

    ngOnInit() {
        this.userSub = this.authService.user.subscribe(user => {
            this.isLoggedIn = !!user;
        });
    }

    onSaveData() {
        this.dataStorageService.storeRecipe();
    }

    onFatchData() {
        this.dataStorageService.fecthRecipes().subscribe();
    }

    onSignOut() {
        this.authService.signOut();
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
}