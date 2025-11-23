// script.js

// Класс User: хранит данные формы и умеет красиво выводить в консоль
class User {
  constructor({ name, email, role, subscribe }) {
    this.name = name;
    this.email = email;
    this.role = role;
    this.subscribe = subscribe; // "yes" или "no"
    this.createdAt = new Date();
  }

  // Метод форматированного вывода
  printToConsole() {
    console.groupCollapsed(`Пользователь: ${this.name}`);
    console.log('Email:', this.email);
    console.log('Роль:', this.role);
    console.log('Подписка:', this.subscribe === 'yes' ? 'Да' : 'Нет');
    console.log('Создан:', this.createdAt.toLocaleString());
    console.groupEnd();
  }
}

/* Обработчик формы */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('userForm');
  if (!form) return; // если форма отсутствует на странице — ничего не делать

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // предотвращаем реальную перезагрузку страницы

    // Собираем данные из формы
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value; // пароль есть, но для примера не сохраняем в объект
    const consent = document.getElementById('consent').checked;
    const subscribe = form.querySelector('input[name="subscribe"]:checked')?.value || 'no';
    const role = document.getElementById('role').value;

    // Простая валидация: убедимся, что чекбокс согласия отмечен
    if (!consent) {
      alert('Пожалуйста, дайте согласие на обработку данных.');
      return;
    }

    // Создаём объект User (демонстрирует ООП)
    const user = new User({ name, email, role, subscribe });

    // Вызываем метод форматированного вывода на консоль
    user.printToConsole();

    try {
      const response = await fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, subscribe })
      });
      if (response.ok) {
        alert('Данные успешно отправлены (сервер ответил успешно).');
      } else {
        // сервер ответил, но не ок
        console.warn('Сервер вернул не-OK ответ:', response.status);
        alert('Данные отправлены, но сервер вернул ошибку (проверьте консоль).');
      }
    } catch (err) {
      // Если нет сервера — просто уведомим, что локально всё ок (данные выведены в консоль)
      console.info('Не удалось отправить на /submit (локально может не быть сервера).', err);
      alert('Данные собраны и выведены в консоль (отправка на сервер не выполнена — локально нет эндпоинта).');
    }

    form.reset();
  });
});
