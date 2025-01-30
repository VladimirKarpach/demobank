import {test, expect} from '@playwright/test'
import { describe } from 'node:test';

const correctUserId = 'TestUser',
      correctPassword = 'TestPass',
      incorrectUserId = 'Test123',
      incorrectPassword = 'Pass123';

let idTooltipText = 'Wprowadź identyfikator otrzymany z banku lub alias - dodatkowy własny identyfikator, samodzielnie zdefiniowany w Demobank online.',
    passwordTooltipText = 'Wprowadź swoje hasło. Sprawdź, czy przycisk Caps Lock jest włączony. Uwaga: 3-krotne wprowadzenie błędnego hasła spowoduje zablokowanie dostępu do systemu.';

test.describe('Login Page', () => {

    test.beforeEach(async({page}) => {
        await page.goto('https://demo-bank.vercel.app/');

    })

    test('The ID field is required', async({page}) => {
        await page.locator('#login_id').click();
        await page.locator('#login_password').click();
        const errorMessage = await page.locator('#error_login_id').textContent();
        expect(errorMessage).toEqual('pole wymagane');
    })

    test('The Password field is required', async({page}) => {
        await page.locator('#login_password').click();
        await page.locator('#login_id').click();
        const errorMessage = await page.locator('#error_login_password').textContent();
        expect(errorMessage).toEqual('pole wymagane');
    })

    test('ID must be 8 characters long', async({page}) => {
        await page.locator('#login_id').fill(incorrectUserId);
        await page.getByText('wersja').click();
        const errorMessage = await page.locator('#error_login_id').textContent();
        expect(errorMessage).toEqual('identyfikator ma min. 8 znaków');
        let locator = page.locator('#login_id_container .grid-20');
        expect(locator).toHaveClass('grid-20 grid-ms-48 grid-space-1 field has-error');
        await page.locator('#login_id').fill(correctUserId);
        await page.getByText('wersja').click();
        locator = page.locator('#login_id_container .grid-20');
        expect(locator).toHaveClass('grid-20 grid-ms-48 grid-space-1 field is-valid')
    })

    test('Password must be 8 characters long', async({page}) => {
        await page.locator('#login_password').fill(incorrectPassword);
        await page.getByText('wersja').click();
        const errorMessage = await page.locator('#error_login_password').textContent();
        expect(errorMessage).toEqual('hasło ma min. 8 znaków');
        let locator = page.locator('#login_password_container .grid-20');
        expect(locator).toHaveClass('grid-20 grid-ms-48 grid-space-1 field has-error');
        await page.locator('#login_password').fill(correctPassword);
        await page.getByText('wersja').click();
        locator = page.locator('#login_password_container .grid-20');
        expect(locator).toHaveClass('grid-20 grid-ms-48 grid-space-1 field is-valid');
    })

    test('Sign In button isn\'t clickable untill all correct data provided', async({page}) => {        
        //both fields are empty
        await expect(page.getByText('zaloguj')).toBeDisabled();

        // only id provided
        await page.locator('#login_id').fill(correctUserId);
        await expect(page.getByText('zaloguj')).toBeDisabled();
        await page.locator('#login_id').clear();

        // only password provided
        await page.locator('#login_password').fill(correctPassword);
        await expect(page.getByText('zaloguj')).toBeDisabled();
        await page.locator('#login_password').clear();

        // correct user id and incorrect password
        await page.locator('#login_id').fill(correctUserId);
        await page.locator('#login_password').fill(incorrectPassword);
        await expect(page.getByText('zaloguj')).toBeDisabled();
        await page.locator('#login_id').clear();
        await page.locator('#login_password').clear();

        // incorrect user id and correct password
        await page.locator('#login_id').fill(incorrectUserId);
        await page.locator('#login_password').fill(correctPassword);
        await expect(page.getByText('zaloguj')).toBeDisabled();
        await page.locator('#login_id').clear();
        await page.locator('#login_password').clear();

        // user id and password are correct
        await page.locator('#login_id').fill(correctPassword);
        await page.locator('#login_password').fill(correctPassword);
        await expect(page.getByText('zaloguj')).toBeEnabled();
    })

    test('Tooltip for ID appears on hover on question mark', async({page}) => {
        await page.hover('#login_id_container i.tooltip');
        await expect(page.locator('#login_id_container i.tooltip')).toHaveAttribute('aria-describedby');
        await expect(page.locator('#login_id_container i.tooltip')).toHaveText(idTooltipText);

    })

    test('Tooltip for Password appears on hover on question mark', async({page}) => {
        await page.hover('#login_password_container i.tooltip');
        await expect(page.locator('#login_password_container i.tooltip')).toHaveAttribute('aria-describedby');
        await expect(page.locator('#login_password_container i.tooltip')).toHaveText(passwordTooltipText);
    })

    test('Redirection to the "More about security" page', async({page}) => {
        await expect(page.getByText('o bezpiecze')).toBeEnabled();
        await page.getByText('o bezpiecze').click();
        await expect(page.locator('.login-highlight').first()).toHaveText('Pamiętaj o swoim bezpieczeństwie!');
    })

    test('Rediresction from "More about security" to the "Login" page', async({page}) => {
        await page.getByText('o bezpiecze').click();
        await expect(page.locator('.login-highlight').first()).toHaveText('Pamiętaj o swoim bezpieczeństwie!');
        await page.getByText('do strony logowania').click();
        await expect(page.locator('.wborder#header_2')).toHaveText('Wersja demonstracyjna serwisu Demobank');
    })

})

test.describe('Navigation by tabs', () => {
    test.beforeEach(async({page}) => {
        await page.goto('https://demo-bank.vercel.app/');
        await page.locator('#login_id').fill(correctUserId);
        await page.locator('#login_password').fill(correctPassword);
        await page.getByRole('button').click();
    })

    test('Navigate to the "mój pulpit" page', async({page}) => {
        await page.locator('#pulpit_btn').click();
        await expect(page.locator('.wborder').filter({hasText: 'konta osobiste'})).toHaveText('konta osobiste');
    })

    test('Navigate to the "mój pulpit -> szybki przelew" page', async({page}) => {
        // find element by ID
        await page.locator('#quick_btn').click();
        await expect(page.locator('h1.wborder')).toHaveText('szybki przelew');
    })

    test('Navigate to the "mój pulpit -> doładowanie telefony" page', async({page}) => {
        // find element by class
        await page.locator('.i-phone').click();
        await expect(page.locator('h1.wborder')).toHaveText('doładowanie telefonu');
    })

    test('Navigate to the "mój pulpit -> manager finansowy" page', async({page}) => {
        await page.locator('.i-nav-savings#manager_fin_btn').click();
        await expect(page.locator('h1.wborder')).toHaveText('manager finansowy');
    })
    
    test('Navigate to the "konta osobiste" page', async({page}) => {
        await page.locator('#privaccounts_btn').click();
        await expect(page.locator('h1.wborder')).toHaveText('konta osobiste');
    })

    test('Navigate to the "płatności" page', async({page}) => {
        await page.locator('.i-nav-payments').click();
        await expect(page.locator('h1.wborder')).toHaveText('przelew dowolny');
    })
    
    test('Navigat to the "Raporty" page', async({page}) => {
        await page.locator('#payments_btn').click();
        await expect(page.locator('h1.wborder')).toHaveText('przelew dowolny');
    })


    test('Navigate to the "generuj przelew" page', async({page}) => {
        await page.locator('#user_reports_btn').click();
        await expect(page.locator('h1.wborder')).toHaveText('Generowanie Przelewu');
    })

    test('Navigate to the "wykresy" page', async({page}) => {
        await page.locator('#charts_btn').click();
        await expect(page.locator('h1.wborder').first()).toHaveText('Wykresy');
    })

    test('Navigate to the "tabele danych" page', async({page}) => {
        await page.locator('#tables_btn').click();
        await expect(page.locator('h1.wborder')).toHaveText('Tabele danych');
    })

    test('Navigate to the "ustawienia" page', async({page}) => {
        await page.locator('.i-nav-settings').click();
        await expect(page.locator('.login-highlight')).toHaveText('Strona w budowie!');
    })
})

test('Logout', async({page}) => {
    await page.goto('https://demo-bank.vercel.app/');
        await page.locator('#login_id').fill(correctUserId);
        await page.locator('#login_password').fill(correctPassword);
        await page.getByRole('button').click();
        await page.getByText('Wyloguj').click();
        await expect(page.locator('.wborder#header_2')).toHaveText('Wersja demonstracyjna serwisu Demobank');
})