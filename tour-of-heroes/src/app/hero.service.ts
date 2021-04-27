import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})

export class HeroService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  private heroesUrl = 'api/heroes';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
  ) {}

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap((newHero: Hero) => this._log(`added hero id=${newHero.id}`)),
        catchError(this._handleError<Hero>('addHero'))
      );
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions)
      .pipe(
        tap(_ => this._log(`deleted hero id=${id}`)),
        catchError(this._handleError<Hero>('deleteHero'))
      );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this._log(`fetched hero id=${id}`)),
        catchError(this._handleError<Hero>(`getHero id=${id}`))
      );
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this._log('fetched heroes')),
        catchError(this._handleError<Hero[]>('getHeroes', []))
      );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) { return of([]); }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
      .pipe(
        tap(x => x.length ?
            this._log(`found heroes matching "${term}"`) :
            this._log(`no heroes matching "${term}"`)),
        catchError(this._handleError<Hero[]>('searchHeroes', []))
      );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this._log(`updated hero id=${hero.id}`)),
        catchError(this._handleError<any>('updateHero'))
      );
  }

  private _handleError<T>(op = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this._log(`${op} failed: ${error.message}`);
      return of(result as T);
    }
  }

  private _log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
