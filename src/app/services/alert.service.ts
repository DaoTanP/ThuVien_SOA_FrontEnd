import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService
{

  constructor() { }

  public appendAlert = (message: string, type: AlertType = AlertType.danger, autoHideInSecond: number = 0, containerId: string = "", sticky: boolean = false) =>
  {
    let alertPlaceholder = document.getElementById(containerId);
    if (alertPlaceholder == null)
      alertPlaceholder = document.body;

    const alert = document.createElement('div');
    alert.className = `alert alert-${type.valueOf()} alert-dismissible mb-2 rounded-0 border-0`;
    if (sticky)
      alert.classList.add('position-fixed top-0 w-100');
    alert.style.zIndex = "2000";
    alert.role = 'alert';
    alert.innerHTML = [
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    ].join('');

    alertPlaceholder.prepend(alert);
    if (autoHideInSecond > 0)
    {
      setTimeout(() =>
      {
        this.clearOneAlert(alert);
      }, autoHideInSecond * 1000);
    }
  }

  public clearAlert (containerId: string = "")
  {
    let alertPlaceholder = document.getElementById(containerId);
    if (alertPlaceholder == null)
      alertPlaceholder = document.body;

    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(element =>
    {
      element.remove();
    });
  }

  public clearOneAlert (alert: Element)
  {
    alert.remove();
  }
}

export enum AlertType
{
  info = "info",
  success = "success",
  warning = "warning",
  danger = "danger",
}