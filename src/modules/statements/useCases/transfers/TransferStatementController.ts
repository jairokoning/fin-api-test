import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { TransferStatementUseCase } from './TransferStatementUseCase';

enum OperationType {
  TRANSFER = 'transfer',
}

export class TransferStatementController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const { user_id } = request.params;
    const { amount, description } = request.body;

    const type = 'transfer' as OperationType;

    const transferStatement = container.resolve(TransferStatementUseCase);

    const statement = await transferStatement.execute({
      user_id,
      sender_id,
      type,
      amount,
      description
    });

    return response.status(201).json(statement);
  }
}

