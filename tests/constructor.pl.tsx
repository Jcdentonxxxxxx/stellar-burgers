import { test, expect } from '@playwright/test';

test.describe('тестирование страницы конструктора', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'fake-token-xyz',
        domain: 'localhost',
        path: '/'
      }
    ]);
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/ingredients',
      update: false
    });
    await page.routeFromHAR('./tests/hars/user.har', {
      url: '**/auth/user',
      update: false
    });
    await page.goto('/');
    await expect(page.getByTestId('preloader')).not.toBeVisible();
    await expect(page.getByTestId('ingredients')).toBeVisible();
    await expect(
      page.getByTestId('ingredients').getByRole('listitem')
    ).toHaveCount(15);
  });

  test.describe('Работа c ингредиентами', () => {
    test('проверка добавления ингредиентов в конструктор', async ({ page }) => {
      const bunText = 'Флюоресцентная булка R2-D3';
      const otherIngredientText = 'Биокотлета из марсианской Магнолии';

      await page.goto('/');
      const ingredients = page.getByTestId('ingredients');

      await expect(ingredients).toBeVisible();
      await expect(ingredients.getByRole('listitem')).toHaveCount(15);

      await ingredients
        .getByRole('listitem')
        .filter({ hasText: bunText })
        .getByRole('button')
        .click();

      await ingredients
        .getByRole('listitem')
        .filter({ hasText: otherIngredientText })
        .getByRole('button')
        .click();

      const constructor = page.getByTestId('constructor');
      await expect(constructor.getByText(`${bunText} (верх)`)).toBeVisible();

      await expect(constructor.getByText(`${bunText} (низ)`)).toBeVisible();
      await expect(constructor.getByText(otherIngredientText)).toBeVisible();
    });
  });

  test.describe('Работа модальных окон ингредиентов', () => {
    const ingredientName = 'Флюоресцентная булка R2-D3';

    test.describe('Сценарий открытия и закрытия', () => {
      test('закрывается по кнопке', async ({ page }) => {
        await page
          .getByTestId('ingredients')
          .getByRole('link', { name: ingredientName })
          .click();

        const modal = page.getByTestId('modal');
        await expect(modal).toBeVisible();
        await modal.getByTestId('close-modal-btn').click();
        await expect(modal).not.toBeVisible();
      });

      test('закрывается по клику на оверлей', async ({ page }) => {
        await page
          .getByTestId('ingredients')
          .getByRole('link', { name: ingredientName })
          .click();

        const modal = page.getByTestId('modal');
        await expect(modal).toBeVisible();

        const overlay = page.getByTestId('modal-overlay');
        await expect(overlay).toBeVisible();
        await overlay.click({ position: { x: 1, y: 1 } });

        await expect(modal).not.toBeVisible();
      });
    });
    test.describe('Отображение данных', () => {
      test('отображение выбранного ингредиента в модальном окне', async ({
        page
      }) => {
        await page
          .getByTestId('ingredients')
          .getByRole('link', { name: ingredientName })
          .click();

        const modal = page.getByTestId('modal');
        await expect(
          modal.getByRole('heading', { name: ingredientName })
        ).toBeVisible();
      });
    });
  });

  test.describe('Процесс создания заказа', () => {
    test('добавление ингредиентов, оформление заказа и очистка конструктора после заказа', async ({
      page
    }) => {
      await page.routeFromHAR('./tests/hars/order.har', {
        url: '**/orders',
        update: false
      });

      await page
        .getByRole('listitem')
        .filter({ hasText: 'Флюоресцентная булка R2-D3' })
        .getByRole('button')
        .click();

      await page
        .getByRole('listitem')
        .filter({ hasText: 'Сыр с астероидной плесенью' })
        .getByRole('button')
        .click();

      await page.getByRole('button', { name: 'Оформить заказ' }).click();

      await expect(page.getByTestId('modal')).toBeVisible();

      await expect(
        page.getByTestId('modal').getByText('идентификатор заказа')
      ).toBeVisible();

      await expect(
        page.getByTestId('modal').getByRole('heading', { name: '108769' })
      ).toBeVisible();

      page.getByTestId('modal').getByTestId('close-modal-btn').click();

      await expect(page.getByTestId('modal')).not.toBeVisible();

      const constructor = page.getByTestId('constructor');

      await expect(constructor.getByText('Выберите булки')).toHaveCount(2);

      await expect(constructor.getByText('Выберите начинку')).toHaveCount(1);
    });
  });
});
