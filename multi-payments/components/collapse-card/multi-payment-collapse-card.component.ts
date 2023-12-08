import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {collapseToggleAnimationFunction, rotateArrowAnimation} from '../../../shared/animation/animation';

@Component({
  selector: 'app-multi-payment-collapse-card',
  templateUrl: './multi-payment-collapse-card.component.html',
  styleUrls: ['./multi-payment-collapse-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [collapseToggleAnimationFunction(), rotateArrowAnimation],
})
export class MultiPaymentCollapseCardComponent {

  @Input() title = '';

  public hiddenContent = false;
}
