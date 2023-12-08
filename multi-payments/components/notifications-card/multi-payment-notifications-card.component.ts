import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-multi-payment-notifications-card',
  templateUrl: './multi-payment-notifications-card.component.html',
  styleUrls: ['./multi-payment-notifications-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiPaymentNotificationsCardComponent {

  @Input() notification: Record<string, string|boolean>;

  @Output() changeNotificationStatus: EventEmitter<Record<string, string|boolean>>
    = new EventEmitter<Record<string, string|boolean>>();

  onChange($event) {
    this.changeNotificationStatus.emit(this.notification);
  }

}
