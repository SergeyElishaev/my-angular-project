import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { environment } from '../../environments/environment'

interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    signInUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey;
    signUpUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey;
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient) { }

    signIn(username: string, password: string) {
        return this.http.post<AuthResponseData>(this.signInUrl, {
            email: username,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(
            errorRes => {
                let errorMessage = "An error occured!";

                if (errorRes.error && errorRes.error.error) {
                    switch (errorRes.error.error.message) {
                        case "EMAIL_EXISTS":
                            errorMessage = "This email address is already in use by another account";
                            break;
                        case "OPERATION_NOT_ALLOWED":
                            errorMessage = "Password sign-in is disabled";
                            break;
                        case "TOO_MANY_ATTEMPTS_TRY_LATER":
                            errorMessage = "Blocked: Too many attempts. Please try again later";
                            break;
                        default:
                            errorMessage = "An error occured: " + errorRes.error.error.message;
                            break;
                    }
                }

                return throwError(errorMessage);
            }),
            tap(responseData => {
                this.handleAuthantication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
            })
        );
    }

    signUp(username: string, password: string) {
        return this.http.post<AuthResponseData>(this.signUpUrl, {
            email: username,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(
            errorRes => {
                let errorMessage = "An error occured!";

                if (errorRes.error && errorRes.error.error) {
                    switch (errorRes.error.error.message) {
                        case "EMAIL_NOT_FOUND":
                            errorMessage = "There is no user record corresponding to this identifier. The user may have been deleted.";
                            break;
                        case "INVALID_PASSWORD":
                            errorMessage = "The password is invalid";
                            break;
                        case "USER_DISABLED":
                            errorMessage = "The user account has been disabled by an administrator.";
                            break;
                        default:
                            errorMessage = "An error occured: " + errorRes.error.error.message;
                            break;
                    }
                }

                return throwError(errorMessage);
            }),
            tap(responseData => {
                this.handleAuthantication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
            })
        );
    }

    signOut() {
        this.user.next(null);
        localStorage.removeItem('userData');

        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDae: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (userData) {
            const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDae));

            if (loadedUser.token) {
                this.user.next(loadedUser);
                const expirationDuration = new Date(userData._tokenExpirationDae).getTime() - new Date().getTime();
                this.autoLogout(expirationDuration);
            }
        }
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            alert('Timeout: you will be logged out.');
            this.signOut();
        }, expirationDuration);
    }

    private handleAuthantication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000));
        const user = new User(email, userId, token, expirationDate);

        this.user.next(user);
         this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }
}