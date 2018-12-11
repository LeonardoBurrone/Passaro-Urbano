import { Component, OnInit } from '@angular/core';
import { Oferta } from '../shared/oferta.model';
import { OfertasService } from '../ofertas.service';
import { Observable, Subject, of } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-topo',
  templateUrl: './topo.component.html',
  styleUrls: ['./topo.component.css'],
  providers: [ OfertasService ]
})
export class TopoComponent implements OnInit {
  public ofertasObservable: Observable<Oferta[]>;
  private subjectPesquisa: Subject<string> = new Subject<string>();

  constructor(private ofertasService: OfertasService) { }

  ngOnInit() {
    this.ofertasObservable = this.subjectPesquisa
    .pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(
        (termoDaPesquisa: string) => {
          if (termoDaPesquisa.trim() === '') {
            return of<Oferta[]>([]);
          }
          return this.ofertasService.getPesquisaOfertas(termoDaPesquisa);
        }
      ),
      catchError(
        (erro: any) => {
          console.log(erro);
          return of<Oferta[]>([]);
        }
      )
    )
  }

  public pesquisa(termoDaPesquisa: string): void {
    this.subjectPesquisa.next(termoDaPesquisa);
  }

  public limpaPesquisa(): void {
    this.subjectPesquisa.next('');
  }
}
