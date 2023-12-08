import { Pipe, PipeTransform } from '@angular/core';
import {PaymentRequestTemplateDto} from '../../../api/wallet-api.generated';
import {DateUtils} from '../../../utils/date.utils';

@Pipe({
  name: 'filterMultiPayments'
})
export class FilterMultiPaymentsPipe implements PipeTransform {

  transform(value: PaymentRequestTemplateDto[], ...args: [boolean]): PaymentRequestTemplateDto[] {
    const [status = false] = args;

    return value.filter(item => this.checkForMultiPaymentExpiration(item, status));
  }

  checkForMultiPaymentExpiration(item: PaymentRequestTemplateDto, status: boolean) {
    if(!item.validTo) {
      return status ? item.deactivated : !item.deactivated;
    }

    const normalizedEndsDate = +DateUtils.resetDateTime(DateUtils.addTimeZoneOffset(new Date(item.validTo)));

    const resetedTodayDate = +DateUtils.resetDateTime(new Date());

    return status
      ? item.deactivated || resetedTodayDate > normalizedEndsDate
      : !item.deactivated && resetedTodayDate <= normalizedEndsDate;
  }
}
