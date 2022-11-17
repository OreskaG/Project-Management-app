import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, first, map, of, switchMap, tap, zip, mergeMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  deleteUser,
  getAdditionalUserData,
  logOut,
  setErrorMessage,
  setResponseMessage,
  signIn,
  signUp,
  updateAuthState,
  updateAuthStateFromLocalStorage,
} from '../actions/auth.actions';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { AUTH_STATE, SIGN_IN_SUCCESS, SIGN_UP_SUCCESS } from '../../core/constants/constants';
import { AuthState, initialState } from '../states/auth.state';
import { getAuthState } from '../selectors/auth.selectors';
import { UserResponse } from '../../core/models/response-api.models';
import { RestApiService } from '../../core/services/rest-api.service';

@Injectable()
export class AuthEffects {
  authStateFromLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateAuthStateFromLocalStorage),
      switchMap(() => {
        const state = this.localStorageService.getItem(AUTH_STATE);
        if (state) {
          return of(updateAuthState({ payload: { ...JSON.parse(state), responseMessage: null } }));
        }
        return of(updateAuthState({ payload: initialState }));
      }),
    ),
  );

  logOut$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logOut),
        tap(() => {
          this.localStorageService.removeItem(AUTH_STATE)
          this.router.navigateByUrl('/welcome');
        }),
      ),
    { dispatch: false },
  );

  signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signIn),
      switchMap((action) =>
        this.restApiService.signIn(action.payload).pipe(
          first(),
          map((response) =>
            updateAuthState({
              payload: {
                token: response.token,
                name: null,
                login: action.payload.login,
                id: null,
                responseMessage: null,
              },
            }),
          ),
          catchError((err) => {
            this.store.dispatch(logOut());
            return of(setErrorMessage({ msg: err.error.message }));
          }),
        ),
      ),
    ),
  );

  additionalUserData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAdditionalUserData),
      switchMap(() => zip(this.restApiService.getUsers(), this.store.select(getAuthState))),
      map(([users, state]) => {
        const user = users.find((item) => item.login === state.login) as UserResponse;
        const authState: AuthState = {
          ...state,
          name: user.name,
          // eslint-disable-next-line no-underscore-dangle
          id: user._id,
          responseMessage: SIGN_IN_SUCCESS,
        };
        this.localStorageService.setItem(
          AUTH_STATE,
          JSON.stringify({
            id: authState.id,
            name: authState.name,
            login: authState.login,
            token: authState.token,
          } as Omit<AuthState, 'responseMessage'>),
        );

        return updateAuthState({
          payload: authState,
        });
      }),
      tap(() => {
        this.router.navigateByUrl('/boards');
      }),
    ),
  );

  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signUp),
      switchMap((action) =>
        this.restApiService.signUp(action.payload).pipe(
          first(),
          map(() => setResponseMessage({ msg: SIGN_UP_SUCCESS })),
          tap(() => {
            this.router.navigateByUrl('/login/signin');
          }),
          catchError((err) => {
            return of(setErrorMessage({ msg: err.error.message }));
          }),
        ),
      ),
    ),
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteUser),
      switchMap((action) => this.restApiService.deleteUserById(action.payload.id).pipe(
        map(() => logOut()
        ),
        catchError((err) => {
          return of(setErrorMessage({ msg: err.error.message }));
        }),
      ))),
  );

  constructor(
    private actions$: Actions,
    private localStorageService: LocalStorageService,
    private restApiService: RestApiService,
    private store: Store,
    private router: Router,
  ) { }
}
