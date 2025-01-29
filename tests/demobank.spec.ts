import {test} from '@playwright/test'
import { describe } from 'node:test';



test.describe('Navigation by tabs', () => {
    test.beforeEach(async({page}) => {
        await page.goto('https://demo-bank.vercel.app/');
        await page.locator('#login_id').fill('TestUser');
        await page.locator('#login_password').fill('TestPass');
        await page.getByRole('button').click();
    })

    test('Navigate to the "mój pulpit -> szybki przelew" page', async({page}) => {
        // find element by ID
        await page.locator('#quick_btn').click();
    })

    test('Navigate to the "mój pulpit -> doładowanie telefony" page', async({page}) => {
        // find element by class
        await page.locator('.i-phone').click()
    })

    test('Navigate to the "mój pulpit -> manager finansowy" page', async({page}) => {
        await page.locator('.i-nav-savings#manager_fin_btn').click()
    })
    
    test('Navigate to the "konta osobiste" page', async({page}) => {
        await page.locator('#privaccounts_btn').click();
    })

    test('Navigate to the "płatności" page', async({page}) => {
        await page.locator('.i-nav-payments').click();
    })
    
    test('Navigat to the "Raporty" page', async({page}) => {
        await page.locator('#payments_btn').click();
    })


    test('Navigate to the "raporty (inframe)" page', async({page}) => {
        await page.locator('#reports_iframe_btn').click();
    })

    test('Navigate to the "generuj przelew" page', async({page}) => {
        await page.locator('#user_reports_btn').click();
    })

    test('Navigate to the "wykresy" page', async({page}) => {
        await page.locator('#charts_btn').click();
    })

    test('Navigate to the "tabele danych" page', async({page}) => {
        await page.locator('#tables_btn').click();
    })

    test('Navigate to the "ustawienia" page', async({page}) => {
        await page.locator('.i-nav-settings').click();
    })
})