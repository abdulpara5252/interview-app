// api.interceptor.ts
import { HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';

// Remove @Injectable() and class structure
export function apiInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const modifiedReq = request.clone({
    setHeaders: {
     'Accept': 'application/json'
    }
  });
  return next(modifiedReq);
}