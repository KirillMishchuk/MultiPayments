import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MultiPaymentsService } from './service/multi-payments.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AppSettingsService } from '../shared/services/app-settings/app-settings.service';
import { ToastrMessageServiceService } from '../shared/services/toastr-message/toastr-message-service.service';
import { PaymentRequestTemplateClient, PaymentRequestTemplateDto, ProfileDto } from '../api/wallet-api.generated';
import { ApplicationRouteSegments } from '../shared/enums/enums';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { ProfilesService } from '../../profiles.service/profiles.service';
import { PRICETAGS } from 'src/test-1/src/app/shared/constants/value';
import { QRCodeModule } from 'angularx-qrcode';
import { TransactionCardModule } from '../shared/components/transaction-card/transaction-card.module';
import { UserCurrencySettingsDto } from '../../../api/wallet-api.generated';

@Component({
  selector: 'app-multi-payments',
  standalone: true,
  imports: [
    CommonModule,
    QRCodeModule,
    TransactionCardModule,
  ],
  templateUrl: './multi-payments.component.html',
  styleUrls: ['./multi-payments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiPaymentsComponent {

  public profileId = '';

  public isLoading = false;

  public type = PRICETAGS;

  public canInvite$: Observable<boolean> = this.route.paramMap.pipe(
    switchMap((params: ParamMap) => {
      this.profileId = params.get('profile') || '';

      return this.profileService.getProfile(this.profileId);
    }),
    map((profile: ProfileDto) => profile.addresses.length > 0),
    shareReplay({bufferSize: 1, refCount: true}),
  );

  public multiPayments$: Observable<PaymentRequestTemplateDto[]> = this.route.paramMap.pipe(
    switchMap((params: ParamMap) => {
      this.profileId = params.get('profile') || '';

      return this.multiPaymentsService.multiPayments$;
    }),
    shareReplay({bufferSize: 1, refCount: true}),
  );

  public readonly currencySettings$: UserCurrencySettingsDto = this.appSettingsService.currencySettings$;

  private showDeactivateConfirmation: boolean;

  private activeTemplate: PaymentRequestTemplateDto|null;

  constructor(private multiPaymentsService: MultiPaymentsService,
              private router: Router,
              private route: ActivatedRoute,
              private appSettingsService: AppSettingsService,
              private readonly toastrMessageServiceService: ToastrMessageServiceService,
              private paymentRequestTemplateClient: PaymentRequestTemplateClient,
              private profileService: ProfilesService) { }

  async navigateToCreation() {
    this.isLoading = true;

    await this.router.navigate([{ outlets: { multiPaymentOutlet: null } }], {
      relativeTo: this.route,
      queryParamsHandling: 'merge'
    });

    this.router.navigate(
      [{ outlets: { multiPaymentOutlet: '' } }], {
        relativeTo: this.route,
        queryParamsHandling: 'merge'
      })
      .then(() => {
        this.isLoading = false;
      });
  }

  closeModal(event) {
    const {triggerRefresh = false} = event;

    if(triggerRefresh) {
      this.refreshMultiPayments();
    }
  }

  async refreshMultiPayments() {
    this.isLoading = true;

    try {
      this.multiPaymentsService.multiPayments = await this.multiPaymentsService.getMultiPayments(this.profileId).toPromise();
    } catch(e) {
      this.toastrMessageServiceService.error('multi-payments.toastr.load-error-msg');
    } finally {
      this.isLoading = false;
    }
  }

  onDeactivateTemplate(template: PaymentRequestTemplateDto) {
    this.activeTemplate = template;
    this.showDeactivateConfirmation = true;
  }

  onActionCompleteHandler(confirmed: boolean) {
    this.showDeactivateConfirmation = false;

    if (confirmed) {
      this.deactivateTemplate();
    } else {
      this.activeTemplate = null;
    }
  }

  async deactivateTemplate() {
    this.isLoading = true;

    try {
      await this.paymentRequestTemplateClient.updatePaymentRequestTemplate({
        ...this.activeTemplate, deactivated: true}
        ).toPromise();

      await this.refreshMultiPayments();
    } catch(e) {
      this.toastrMessageServiceService.error('multi-payments.toastr.deactivate-error-msg');
    } finally {
      this.isLoading = false;
    }
  }

  async navigateToDetails(template: PaymentRequestTemplateDto) {
    this.isLoading = true;

    await this.router.navigate([ApplicationRouteSegments.multiPaymentInfo, template.id], {
      relativeTo: this.route,
      queryParamsHandling: 'merge'
    }).then(() => this.isLoading = false);
  }

}
