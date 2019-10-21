import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  /**
   * Храним в памяти токен активной сессии игры
   * При завершении игры удаляем токен
   *
   */
  constructor() {
  }

  /**
   * 0. Останавливаем все неостановленные ранее сессии.
   * 1. Генерируем токен для новой игры
   * 2. Сохраняем в локальном кеше браузера
   * 3. Создаём сессию в базе-данных
   */
  async startGameSession(phone: string, name: string, startTimestamp: number) {
    // TODO: 21.10.2019 Sergey Alekseev:
  }

  /**
   * 1. Проверяем в локальном кеше наличие игровых сессий
   * 2. Проверяем в базе данных актуальность этих сессий
   * 3. Удаляем из локального кеша неактивные
   */
  hasGameSession(): boolean {
    // TODO: 21.10.2019 Sergey Alekseev:
    return false;
  }

  /**
   * 1. Получаем токен сессии
   * 2. Удаляем из локального кеша
   * 3. Закрываем его в базе данных
   */
  stopGameSession() {
    // TODO: 21.10.2019 Sergey Alekseev:
  }
}
