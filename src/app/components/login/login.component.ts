import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { HttpService } from 'src/app/services/http.service';
import { AlertService, AlertType } from 'src/app/services/alert.service';
import { AuthGuardService } from 'src/app/services/auth-guard.service';

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

  constructor(
    private httpService: HttpService,
    private alertService: AlertService,
    private authGuardService: AuthGuardService,
    private router: Router,
  )
  {
    if (authGuardService.isLoggedIn)
      router.navigate(['home']);
  }

  public login (): void
  {
    this.alertService.clearAlert();
    if (!this.loginForm.valid)
    {
      this.alertService.appendAlert('Thông tin không hợp lệ, vui lòng kiểm tra lại', AlertType.danger, 0, 'form-wrapper');
      return;
    }
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    const user = new User();
    user.username = username;
    user.password = password;

    this.waiting = true;

    this.httpService.login(user).subscribe({
      next: async res =>
      {
        this.waiting = false;

        this.authGuardService.login(res.accessToken);
        this.alertService.appendAlert('Đăng nhập thành công, chuyển hướng về trang chủ',
          AlertType.success, 3, 'form-wrapper');
        await new Promise(f => setTimeout(f, 3000));
        this.router.navigate(['home']);
      }, error: err =>
      {
        this.waiting = false;
        switch (err.status)
        {
          case 404:
            this.alertService.appendAlert('Tên đăng nhập hoặc mật khẩu không đúng', AlertType.danger, 0, 'form-wrapper');
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