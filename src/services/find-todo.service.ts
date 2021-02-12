import { Injectable } from '@nestjs/common';
import { Cacheable } from '@type-cacheable/core';
import { Todo } from '@/database/entities/todo.entity';
import { TodoRepository } from '@/repositories/todo.repository';
@Injectable()
export class FindTodoService {
  constructor(private readonly todoRepository: TodoRepository) {}
  @Cacheable({ cacheKey: ([id]: [string]) => id })
  async findById(id: string): Promise<Todo | undefined> {
    return await this.todoRepository.findOne(id);
  }
}
