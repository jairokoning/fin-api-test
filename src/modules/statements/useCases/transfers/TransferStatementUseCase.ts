import { inject, injectable } from "tsyringe";
import { Statement } from "../../entities/Statement";
import { StatementsRepository } from "../../repositories/StatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";

enum OperationType {
  TRANSFER = 'transfer',
}

type TRequest = {
  user_id: string;
  sender_id: string;
  amount: number;
  description: string;
  type: OperationType;
};



@injectable()
export class TransferStatementUseCase {
  constructor(
    @inject("StatementsRepository")
    private statementsRepository: StatementsRepository) {}

  async execute({ user_id, sender_id, amount, description, type }: TRequest): Promise<Statement> {
    if (user_id === sender_id) {
      throw new CreateStatementError.CantTransferToYourself();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds()
    }

    const statement = await this.statementsRepository.transfer({
      user_id,
      sender_id,
      amount,
      description,
      type
    });

    return statement;
  }
}
