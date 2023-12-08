import {ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {PaymentRequestTemplateDto} from '../../../../../api/wallet-api.generated';
import {LangService} from '../../../shared/services/lang/lang.service';
import {Currency, UserCurrencySettingsDto} from '../../../../../api/wallet-api.generated';
import {QRCodeErrorCorrectionLevel} from 'angularx-qrcode';

@Component({
  selector: 'app-multi-payment-card',
  templateUrl: './multi-payment-card.component.html',
  styleUrls: ['./multi-payment-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiPaymentCardComponent {

  @Input() card: PaymentRequestTemplateDto;

  @Input() currencySettings: UserCurrencySettingsDto;

  @Output() deactivateTemplate: EventEmitter<PaymentRequestTemplateDto> = new EventEmitter<PaymentRequestTemplateDto>();

  @Output() navigateToDetails: EventEmitter<PaymentRequestTemplateDto> = new EventEmitter<PaymentRequestTemplateDto>();

  public currency = Currency;

  public correctionLevel: QRCodeErrorCorrectionLevel = 'H';

  constructor(public langService: LangService) { }

  @HostListener('click', ['$event'])
  onClick(event: any) {
    event.stopImmediatePropagation();
    this.navigateToDetails.emit(this.card);
  }

}
