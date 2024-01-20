import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService
{
  private data = new Map();
  constructor() { }

  getData (key: string)
  {
    return this.data.get(key);
  }

  getAllData ()
  {
    return this.data.values();
  }

  setData (key: string, value: any)
  {
    this.data.set(key, value);
  }

  removeData (key: string)
  {
    return this.data.delete(key);
  }

  getSession (key: string)
  {
    return sessionStorage.getItem(key);
  }

  setSession (key: string, value: string)
  {
    sessionStorage.setItem(key, value);
  }

  removeSession (key: string)
  {
    sessionStorage.removeItem(key);
  }

  getLocalStorage (key: string)
  {
    return localStorage.getItem(key);
  }

  setLocalStorage (key: string, value: string)
  {
    localStorage.setItem(key, value);
  }

  removeLocalStorage (key: string)
  {
    localStorage.removeItem(key);
  }
}
