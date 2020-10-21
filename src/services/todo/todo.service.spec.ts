import { Test } from '@nestjs/testing';
import faker from 'faker';

import { UpdateTodoInput } from '@/inputs/update-todo.input';
import { TodoEntityMock } from '@/mocks/entities/todo.entity';
import { TodoRepository } from '@/repositories/todo/todo.repository';
import { TodoService } from '@/services/todo/todo.service';

jest.mock('@/repositories/todo/todo.repository');

describe('TodoService', () => {
  type SutTypes = { sut: TodoService; todoRepository: TodoRepository };

  const makeSut = async (): Promise<SutTypes> => {
    const moduleRef = await Test.createTestingModule({
      providers: [TodoRepository, TodoService],
    }).compile();
    const todoRepository = moduleRef.get<TodoRepository>(TodoRepository);
    const todoService = moduleRef.get<TodoService>(TodoService);
    const sutTypes = { todoRepository, sut: todoService };

    return sutTypes;
  };

  it('should create a TODO', async () => {
    const { sut, todoRepository } = await makeSut();
    const todoCreateInput = { task: faker.random.words() };

    expect(await sut.createTodo(todoCreateInput)).toBe(TodoEntityMock);
    expect(todoRepository.save).toHaveBeenCalledWith(todoCreateInput);
  });

  it('should get all TODOS', async () => {
    const { sut } = await makeSut();

    expect(await sut.getAllTodos()).toMatchObject([TodoEntityMock]);
  });

  it('should find a TODO by id', async () => {
    const { sut, todoRepository } = await makeSut();

    expect(await sut.findTodoById(TodoEntityMock.id)).toBe(TodoEntityMock);
    expect(todoRepository.findOne).toHaveBeenCalledWith(TodoEntityMock.id);
  });

  it('should remove a TODO', async () => {
    const { sut, todoRepository } = await makeSut();
    const getTodoSpy = spyOn<any>(sut, 'getTodo').and.returnValue(
      TodoEntityMock,
    );

    await sut.removeTodo(TodoEntityMock.id);

    expect(getTodoSpy).toHaveBeenCalledWith(TodoEntityMock.id);
    expect(todoRepository.remove).toHaveBeenCalledWith(TodoEntityMock);
  });

  it('should update a TODO', async () => {
    const { sut, todoRepository } = await makeSut();
    const todoUpdateInput: UpdateTodoInput = {
      task: faker.random.words(),
      done: true,
    };
    const getTodoSpy = spyOn<any>(sut, 'getTodo').and.returnValue(
      TodoEntityMock,
    );

    expect(await sut.updateTodo(TodoEntityMock.id, todoUpdateInput)).toBe(
      TodoEntityMock,
    );
    expect(getTodoSpy).toHaveBeenCalledWith(TodoEntityMock.id);
    expect(todoRepository.save).toHaveBeenCalledWith(
      Object.assign(TodoEntityMock, todoUpdateInput),
    );
  });
});
