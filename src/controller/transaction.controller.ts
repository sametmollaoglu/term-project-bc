import { Body, Controller, Post } from '@nestjs/common';
import { CreateTransactionResponse } from 'src/dto/create-transaction-response.dto';
import { Transaction } from 'src/dto/transaction.dto';
import { TransactionService } from 'src/service/transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post('/details')
  createTransaction(
    @Body() transactionParameters: Transaction,
  ): CreateTransactionResponse {
    const response = this.transactionService.displayTransactions(
      transactionParameters.contractAddress,
    );

    return response;
  }
}
