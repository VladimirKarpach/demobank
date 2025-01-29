import {test, expect} from '@playwright/test'
import { describe } from 'node:test';



test.describe('Navigation by tabs', () => {
    test.beforeEach(async({page}) => {
        await page.goto('https://demo-bank.vercel.app/');
        await page.locator('#login_id').fill('TestUser');
        await page.locator('#login_password').fill('TestPass');
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