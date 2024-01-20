import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { User } from 'src/app/models/user';
import { AlertService, AlertType } from 'src/app/services/alert.service';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent
{
  protected waiting: boolean = false;

  protected displayName: FormControl = new FormControl(null, [Validators.required, Validators.minLength(5)]);
  protected username: FormControl = new FormControl(null, { updateOn: 'blur', validators: [Validators.required, Validators.minLength(5)], asyncValidators: this.usernameExistValidator() });
  protected password: FormControl = new FormControl(null, [Validators.required, Validators.minLength(8)]);
  protected confirmPassword: FormControl = new FormControl(null, [Validators.required]);
  protected agreement: FormControl = new FormControl(false);

  public registerForm: FormGroup = new FormGroup({
    displayName: this.displayName,
    username: this.username,
    password: this.password,
    confirmPassword: this.confirmPassword,
    agreement: this.agreement
  }, [this.formGroupMatchValidator('confirmPassword', 'password')]);

  constructor(private httpService: HttpService, private authGuardService: AuthGuardService, private router: Router, private alertService: AlertService)
  {
    if (authGuardService.isLoggedIn)
      router.navigate(['home']);
  }

  public matchValidator (controlToMatch: AbstractControl<any, any>): ValidatorFn
  {
    return (control: AbstractControl<any, any>): ValidationErrors | null =>
    {
      return (control.value === controlToMatch.value) ? null : { notMatch: true };
    }
  }

  public formGroupMatchValidator (controlToValidate: string, controlToMatch: string): ValidatorFn
  {
    return (control: AbstractControl<any, any>): ValidationErrors | null =>
    {
      const validateValue = control.get(controlToValidate);
      const matchValue = control.get(controlToMatch);
      return (validateValue && matchValue && validateValue.value === matchValue.value) ? null : { notMatch: true };
    }
  }

  public usernameExistValidator (): AsyncValidatorFn
  {
    return (control: AbstractControl<any, any>): Observable<ValidationErrors | null> =>
    {
      if (!control.value)
      {
        return of(null);
      }

      return this.httpService.usernameExists(control.value).pipe(
        map(res =>
        {
          // console.log(res);
          return res ? { exists: true } : null;
        })
      );
    }
  }

  public register ()
  {
    this.alertService.clearAlert();
    this.waiting = true;
    const displayName = this.registerForm.value.displayName || '';
    const username = this.registerForm.value.username || '';
    const password = this.registerForm.value.password || '';
    const user = new User();
    user.firstName = displayName;
    user.username = username;
    user.password = password;
    this.httpService.register(user).subscribe({
      next: (res) =>
      {
        this.waiting = false;
        this.authGuardService.login(res.id);
        this.router.navigate(['home']);
      }, error: (err) =>
      {
        this.waiting = false;
        switch (err.status)
        {
          case 409:
            this.alertService.appendAlert('Tên đăng nhập đã tồn tại', AlertType.danger, 0, 'form-wrapper');
            break;

          case 400:
            this.alertService.appendAlert('Thông tin không hợp lệ', AlertType.danger, 0, 'form-wrapper');
            break;

          case 0:
            this.alertService.appendAlert('Đã xảy ra sự cố với mạng', AlertType.danger, 0, 'form-wrapper');
            break;

          default:
            break;
        }
      }
    });
  }
}