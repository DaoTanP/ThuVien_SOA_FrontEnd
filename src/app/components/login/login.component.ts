import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AlertService, AlertType } from 'src/app/services/alert.service';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent
{
  protected waiting: boolean = false;

  protected username: FormControl = new FormControl(null, [Validators.required, Validators.minLength(5)]);
  protected password: FormControl = new FormControl(null, [Validators.required, Validators.minLength(8)]);

  public loginForm: FormGroup = new FormGroup({
    username: this.username,
    password: this.password,
  });
  constructor(private httpService: HttpService, private authGuardService: AuthGuardService, private router: Router, private alertService: AlertService)
  {
    if (authGuardService.isLoggedIn)
      router.navigate(['home']);
  }

  public login (): void
  {
    this.alertService.clearAlert();
    this.waiting = true;

    const username = this.loginForm.value.username || '';
    const password = this.loginForm.value.password || '';
    const user = new User();
    user.username = username;
    user.password = password;

    this.httpService.login(user).subscribe({
      next: res =>
      {
        this.waiting = false;
        this.authGuardService.login(res.id);
        this.router.navigate(['home']);
      }, error: err =>
      {
        this.waiting = false;
        switch (err.status)
        {
          case 404:
            this.alertService.appendAlert('Tài khoản không tồn tại, kiểm tra lại tên đăng nhập hoặc mật khẩu', AlertType.danger, 0, 'form-wrapper');
            break;

          case 0:
            this.alertService.appendAlert('Không thể kết nối với máy chủ, vui lòng thử lại sau', AlertType.danger, 0, 'form-wrapper');
            break;

          default:
            this.alertService.appendAlert('Đã xảy ra lỗi, vui lòng thử lại sau', AlertType.danger, 0, 'form-wrapper');
            break;
        }
      }
    });
  }
}
