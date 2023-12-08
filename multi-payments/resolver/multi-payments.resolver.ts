import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import {MultiPaymentsService} from '../service/multi-payments.service';
import {catchError, tap} from 'rxjs/operators';
import {PaymentRequestTemplateDto} from '../../../../../api/wallet-api.generated';
import {ToastrMessageServiceService} from '../../../shared/services/toastr-message/toastr-message-service.service';

@Injectable({
  providedIn: 'root'
})
export class MultiPaymentsResolver implements Resolve<PaymentRequestTemplateDto[]|boolean> {

  constructor(private multiPaymentsService: MultiPaymentsService,
              private readonly toastrMessageServiceService: ToastrMessageServiceService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PaymentRequestTemplateDto[]|boolean> {

    const businessId: string = route.params?.profile;

    const multiPayments = this.multiPaymentsService.multiPayments;

    if(multiPayments?.length) {
      return of(true);
    }

    return this.getMultiPayments(businessId);
  }

  getMultiPayments(businessId: string) {
    return this.multiPaymentsService.getMultiPayments(businessId).pipe(
      tap((data) => this.multiPaymentsService.multiPayments = data),
      catchError((e) => {
        this.toastrMessageServiceService.error('multi-payments.toastr.load-error-msg');
        this.multiPaymentsService.multiPayments = [] as PaymentRequestTemplateDto[];
        return throwError(e);
      })
    );
  }
}
