import { Body, Controller, Post } from '@nestjs/common';
import { CreateContractResponse } from 'src/dto/create-contract-response.dto';
import { CreateContract } from 'src/dto/create-contract.dto';
import { ContractService } from 'src/service/contract.service';

@Controller('contract')
export class ContractController {
  constructor(private contractService: ContractService) {}

  @Post('/create')
  async createContract(
    @Body() contractParameters: CreateContract,
  ): Promise<CreateContractResponse> {
    const response = await this.contractService.createContract(
      contractParameters,
    );

    return response;
  }
}
