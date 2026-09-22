import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form initially', () => {
    expect(component['loginForm'].valid).toBeFalsy();
  });

  it('should require email and password', () => {
    const form = component['loginForm'];

    expect(form.controls.email.hasError('required')).toBeTruthy();
    expect(form.controls.password.hasError('required')).toBeTruthy();
  });

  it('should validate email', () => {
    const email = component['loginForm'].controls.email;

    email.setValue('invalid-email');

    expect(email.hasError('email')).toBeTruthy();
  });

  it('should validate password length', () => {
    const password = component['loginForm'].controls.password;

    password.setValue('123');

    expect(password.hasError('minlength')).toBeTruthy();
  });

  it('should accept valid credentials', () => {
    component['loginForm'].setValue({
      email: 'user@gmail.com',
      password: '123456'
    });

    expect(component['loginForm'].valid).toBeTruthy();
  });
});

