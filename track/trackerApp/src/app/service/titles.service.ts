import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {environment} from '../../environments/environment';
import {Title} from '../model/title.model';
import {TitleAdd} from '../model/titleAdd.model';



const API_URL = environment.apiUrl + '/titleApi';

@Injectable({providedIn: 'root'})

// tslint:disable-next-line: class-name
export class TitlesService {
    private titles: Title[] = [];
    private titleUpdated = new Subject <{ titles: Title[], titleCount: number}>();

    constructor(private http: HttpClient, private router: Router) {}

    getTitles(titlesPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${titlesPerPage}&page=${currentPage}`;
        this.http
        .get<{message: string; titles: any; maxTitles: number}>(
          API_URL + '/titles_list' + queryParams
        )
        .pipe(map((titleData) =>{
            return {
              title: titleData.titles.map(title => {
                return {
                  name: title.name,
                  id: title._id,
                  status: title.status
                };
              }),
              maxTitles: titleData.maxTitles
            };
        })
        )
        .subscribe((transFormTitleData) => {
          this.titles = transFormTitleData.title;
          this.titleUpdated.next({
            titles: [...this.titles],
            titleCount: transFormTitleData.maxTitles
          });
        });
    }

    getTitlesUpdateListner() {
      return this.titleUpdated.asObservable();
    }

    getTitle(id: string){
      return this.http.get<{_id: string, name: string}>(
          API_URL + '/title_detail/'+ id
      );
    }

    getTitlesList(){
      return this.http.get<{ message: string; titles: any; maxTitles: number}>(
          API_URL + '/titles_list'
      );
    }

    addTitle(name:string){
      const title: TitleAdd = {id: null, name:name};
      this.http
      .post<{message: string; title:Title}>(
          API_URL + '/add_title',
          title
      )
      .subscribe(responseData => {
          this.router.navigate(['/form5/view']);
      })
  }


  updateTitle(id: string, name: string){
    const title: TitleAdd ={id:id, name:name};
    this.http
    .put(API_URL + '/title_edit/' + id, title)
    .subscribe(response => {
        this.router.navigate(['/form5/view']);
    })
  }


  deleteTitle(titleId: string) {
      return this.http
      .get(API_URL + '/title_delete/' + titleId)
  }

}
