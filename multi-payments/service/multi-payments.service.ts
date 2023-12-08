import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {
  BlockExplorerClient,
  PaymentRequestTemplateClient,
  PaymentRequestTemplateDto, TransactionDto
} from '../../../../api/wallet-api.generated';
import {DEFAULT_PAYMENT_TEMPLATE_TRANSACTIONS} from '../../shared/constants/value';

@Injectable({
  providedIn: 'root'
})
export class MultiPaymentsService {

  private multiPaymentsSubject: BehaviorSubject<PaymentRequestTemplateDto[]|null>
    = new BehaviorSubject<PaymentRequestTemplateDto[]|null>(null);

  private multiPaymentsTransactionsSubject: BehaviorSubject<TransactionDto[]|null>
    = new BehaviorSubject<TransactionDto[]|null>(null);

  constructor(private paymentRequestTemplateClient: PaymentRequestTemplateClient,
              private blockExplorerClient: BlockExplorerClient) { }

  get multiPayments$() {
    return this.multiPaymentsSubject.pipe();
  }

  get multiPayments(): PaymentRequestTemplateDto[] {
    return this.multiPaymentsSubject.value;
  }

  get multiPaymentsTransactions$() {
    return this.multiPaymentsTransactionsSubject.pipe();
  }

  get multiPaymentsTransactions(): TransactionDto[] {
    return this.multiPaymentsTransactionsSubject.value;
  }

  set multiPayments(value: PaymentRequestTemplateDto[]) {
    this.multiPaymentsSubject.next(value);
  }

  set multiPaymentsTransactions(value: TransactionDto[]) {
    this.multiPaymentsTransactionsSubject.next(value);
  }

  getMultiPayments(id: string): Observable<PaymentRequestTemplateDto[]> {
    return this.paymentRequestTemplateClient.getPaymentRequestTemplates(id);
  }

  getMultiPaymentsTransactions(
    businessId: string, templateId: string, count: number = DEFAULT_PAYMENT_TEMPLATE_TRANSACTIONS,
    ): Observable<TransactionDto[]> {
    return this.blockExplorerClient.getTemplateRequestPayments(businessId, templateId, count);
  }

  getMultiPaymentsTransactionsByTimestamp(
    businessId: string, index: number, block: number, templateId: string, count: number = DEFAULT_PAYMENT_TEMPLATE_TRANSACTIONS
  ): Observable<TransactionDto[]> {
    return this.blockExplorerClient.getOldTemplateRequestPayments(businessId, index, block, templateId, count);
  }

}
