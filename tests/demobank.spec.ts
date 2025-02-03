import {test, expect} from '@playwright/test';
import exp from 'constants';
import { sign } from 'crypto';
import { describe } from 'node:test';
import { text } from 'stream/consumers';
import { LoginPage } from './page-objects/loginPage';
import { Navigation } from './page-objects/bankPage';
import { log } from 'console';

const correctUserId = 'TestUser',
      correctPassword = 'TestPass',
      incorrectUserId = 'Test123',
      incorrectPassword = 'Pass123';

let idTooltipText = 'Wprowadź identyfikator otrzymany z banku lub alias - dodatkowy własny identyfikator, samodzielnie zdefiniowany w Demobank online.',
    passwordTooltipText = 'Wprowadź swoje hasło. Sprawdź, czy przycisk Caps Lock jest włączony. Uwaga: 3-krotne wprowadzenie błędnego hasła spowoduje zablokowanie dostępu do systemu.',
    szybkiPrzelewTooltipText = 'widżet umożliwia zlecenie przelewu zwykłego do jednego ze zdefiniowanych odbiorców',
    szybkiPrzelewDropdownOptions = ['wybierz odbiorcę przelewu', 'Jan Demobankowy', 'Chuck Demobankowy', 'Michael Scott'],
    doladoawaniaDropboxOptions = ['wybierz telefon do doładowania', '500 xxx xxx', '502 xxx xxx', '503 xxx xxx', '504 xxx xxx'];

test.describe('Login Page', () => {

    test.beforeEach(async({page}) => {
        await page.goto('https://demo-bank.vercel.app/');
    })

    test('The ID field is required', async({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.idInputField.click();
        await loginPage.passwordInputField.click();
        await loginPage.checkErrorMessage('id', 'pole wymagane');
    })

    test('The Password field is required', async({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.passwordInputField.click();
        await loginPage.idInputField.click();
        await loginPage.checkErrorMessage('password', 'pole wymagane');
    })

    test('ID must be 8 characters long', async({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.idInputField.fill(incorrectUserId);
        await loginPage.signInButton.click({force: true});
        await loginPage.checkErrorMessage('id', 'identyfikator ma min. 8 znaków')
        await loginPage.checkFieldHighlight('id', 'has-error')

        await loginPage.idInputField.fill(correctUserId);
        await loginPage.signInButton.click({force: true});
        await loginPage.checkFieldHighlight('id', 'is-valid')
    })

    test('Password must be 8 characters long', async({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.passwordInputField.fill(incorrectPassword);
        await loginPage.signInButton.click({force: true});
        await loginPage.checkErrorMessage('password', 'hasło ma min. 8 znaków')
        await loginPage.checkFieldHighlight('password', 'has-error')

        await loginPage.passwordInputField.fill(correctPassword);
        await loginPage.signInButton.click({force: true});
        await loginPage.checkFieldHighlight('password', 'is-valid')
    })

    test('Sign In button isn\'t clickable untill all correct data provided', async({page}) => {   
        const loginPage = new LoginPage(page);     
        //both fields are empty
        await loginPage.isSignInButtonActive(false);

        // only id provided
        await loginPage.idInputField.fill(correctUserId);
        await loginPage.isSignInButtonActive(false);
        await loginPage.idInputField.clear();

        // only password provided
        await loginPage.passwordInputField.fill(correctPassword);
        await loginPage.isSignInButtonActive(false);
        await loginPage.passwordInputField.clear();

        // correct user id and incorrect password
        await loginPage.idInputField.fill(correctUserId);
        await loginPage.passwordInputField.fill(incorrectPassword);
        await loginPage.isSignInButtonActive(false);
        await loginPage.idInputField.clear();
        await loginPage.passwordInputField.clear();

        // incorrect user id and correct password
        await loginPage.idInputField.fill(incorrectUserId);
        await loginPage.passwordInputField.fill(correctPassword);
        await loginPage.isSignInButtonActive(false);
        await loginPage.idInputField.clear();
        await loginPage.passwordInputField.clear();

        // user id and password are correct
        await loginPage.idInputField.fill(correctPassword);
        await loginPage.passwordInputField.fill(correctPassword);
        await loginPage.isSignInButtonActive(true);
    })

    test('Tooltip for ID appears on hover on question mark', async({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.idFieldTooltip.hover();
        await loginPage.checkTooltip('id', idTooltipText);

    })

    test('Tooltip for Password appears on hover on question mark', async({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.passwordFieldTooltip.hover()
        await loginPage.checkTooltip('password', passwordTooltipText);
    })

    test('Redirection to the "More about security" page', async({page}) => {
        const loginPage = new LoginPage(page);
        await expect(loginPage.moreAboutSecurityButton).toBeEnabled();
        await loginPage.moreAboutSecurityButton.click();
        await expect(page.locator('.login-highlight').first()).toHaveText('Pamiętaj o swoim bezpieczeństwie!');
    })

    test('Rediresction from "More about security" to the "Login" page', async({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.moreAboutSecurityButton.click();
        await expect(page.locator('.login-highlight').first()).toHaveText('Pamiętaj o swoim bezpieczeństwie!');
        await page.getByText('do strony logowania').click();
        await expect(page.locator('.wborder#header_2')).toHaveText('Wersja demonstracyjna serwisu Demobank');
    })

})

test.describe('Navigation by tabs', () => {
    test.beforeEach(async({page}) => {
        const loginPage = new LoginPage(page);
        loginPage.signIn();
    })

    test('Navigate to the "mój pulpit" page', async({page}) => {
        const navigateTo = new Navigation(page);
        await navigateTo.mojPulpitPage();
        await navigateTo.checkHeaderText('konta osobiste')
    })

    test('Navigate to the "mój pulpit -> szybki przelew" page', async({page}) => {
        const navigateTo = new Navigation(page);
        await navigateTo.mojPulpitSzybkiPzelewPage();
        await navigateTo.checkHeaderText('szybki przelew')
    })

    test('Navigate to the "mój pulpit -> doładowanie telefony" page', async({page}) => {
        const navigateTo = new Navigation(page);
        await navigateTo.mojPulpitDoladowanieTelefonuPage();
        await navigateTo.checkHeaderText('doładowanie telefonu')
    })

    test('Navigate to the "mój pulpit -> manager finansowy" page', async({page}) => {
        const navigateTo = new Navigation(page);
        await navigateTo.mojPulpitManagerFinansowyPage();
        await navigateTo.checkHeaderText('manager finansowy')
    })
    
    test('Navigate to the "konta osobiste" page', async({page}) => {
        const navigateTo = new Navigation(page);
        await navigateTo.kontaOsobistePage();
        await navigateTo.checkHeaderText('konta osobiste')
    })

    test('Navigate to the "płatności" page', async({page}) => {
        const navigateTo = new Navigation(page);
        await navigateTo.platnosciPage();
        await navigateTo.checkHeaderText('przelew dowolny')
    })
    
    test('Navigat to the "Raporty" page', async({page}) => {
        const navigateTo = new Navigation(page);
        await navigateTo.raportyPage();
        await navigateTo.checkHeaderText('Raporty')
    })


    test('Navigate to the "generuj przelew" page', async({page}) => {
        const navigateTo = new Navigation(page);
        await navigateTo.generujPrzelewPage();
        await navigateTo.checkHeaderText('Generowanie Przelewu')
    })

    test('Navigate to the "wykresy" page', async({page}) => {
        const navigateTo = new Navigation(page);
        await navigateTo.wykresyPage();
        await navigateTo.checkHeaderText('Wykresy')
    })

    test('Navigate to the "tabele danych" page', async({page}) => {
        const navigateTo = new Navigation(page);
        await navigateTo.tabeleDanychPage();
        await navigateTo.checkHeaderText('Tabele danych')
    })

    test('Navigate to the "ustawienia" page', async({page}) => {
        const navigateTo = new Navigation(page);
        await navigateTo.ustawieniaPage();
        await expect(page.locator('.login-highlight')).toHaveText('Strona w budowie!');
    })
})

test('Logout', async({page}) => {
    const loginPage = new LoginPage (page)
    await page.goto('https://demo-bank.vercel.app/');
    loginPage.signIn();
    await page.getByText('Wyloguj').click();
    await expect(page.locator('.wborder#header_2')).toHaveText('Wersja demonstracyjna serwisu Demobank');
})

test.describe('Mój pulpit page', () => {
    test.beforeEach(async({page}) => {
        const loginPage = new LoginPage(page);
        loginPage.signIn();
    })

    test.describe('Quick transfer', () => {
        const dropbox = 

        test('Check header', async({page}) => {
          const headerText = await page.locator('.box-white', {hasText: 'szybki przelew'}).locator('.wborder').textContent()
          expect(headerText).toEqual('szybki przelew');
        })

        test('Check tooltip', async({page}) => {
            const questionMarkButton = page.locator('.box-white', {hasText: 'szybki przelew'}).locator('i');
            await questionMarkButton.hover();
            await expect(questionMarkButton).toHaveAttribute('aria-describedby');
            await expect(questionMarkButton).toHaveText(szybkiPrzelewTooltipText);  
        })

        test('All fields are required', async({page}) => {
            const dropbox = page.locator('.box-white', {hasText: 'szybki przelew'}).locator('.form-row', {hasText: 'do'});
            const amounInput = page.locator('.box-white', {hasText: 'szybki przelew'}).locator('.form-row', {hasText: 'kwota'});
            const titleInput = page.locator('.box-white', {hasText: 'szybki przelew'}).locator('.form-row', {hasText: 'tytu'});

            await page.locator('.box-white', {hasText: 'szybki przelew'}).getByRole('button').click();
            
            await expect(dropbox.locator('.error')).toHaveText('pole wymagane');
            await expect(amounInput.locator('.error')).toHaveText('pole wymagane');
            await expect(titleInput.locator('.error')).toHaveText('pole wymagane');
            
            await dropbox.locator('select').selectOption({index: 1});
            await page.getByText('tytu').click();
            await expect(dropbox.locator('.grid-space-2')).toHaveClass('grid-space-2 grid-28 grid-mt-48 grid-mt-space-0 field is-valid');

            await amounInput.getByRole('textbox').fill('100');
            await page.getByText('tytu').click();
            await expect(amounInput.locator('.grid-space-2')).toHaveClass('grid-space-2 grid-24 grid-mt-42 grid-mt-space-0 field is-valid');
            
            await titleInput.getByRole('textbox').fill('Transfer title');
            await page.getByText('tytu').click();
            await expect(titleInput.locator('.grid-space-2')).toHaveClass('grid-space-2 grid-28 grid-mt-48 grid-mt-space-0 field is-valid');
        })

        test('Check dropdown options', async({page}) => {
            const dropbox = page.locator('.box-white', {hasText: 'szybki przelew'}).locator('#widget_1_transfer_receiver');
            await dropbox.click();
            const optionsList = dropbox.getByRole('option');
            await expect(optionsList).toHaveText(szybkiPrzelewDropdownOptions);
        })

        test('Correct transfer data was sent', async({page}) => {
            const box = page.locator('.box-white', {hasText: 'szybki przelew'});
            const dropbox = box.locator('.form-row', {hasText: 'do'});
            const amounInput = box.locator('.form-row', {hasText: 'kwota'});
            const titleInput = box.locator('.form-row', {hasText: 'tytu'});
            let dropdownOprion = 1;
            let transferAmount = '100';
            let transferTitle = 'Transfer Title';
            let transferReceiver = await dropbox.locator('select').locator('option').nth(dropdownOprion).textContent();

            // send transfer
            await dropbox.locator('select').selectOption({index: dropdownOprion});
            await amounInput.getByRole('textbox').fill(transferAmount);
            await titleInput.getByRole('textbox').fill(transferTitle);
            await box.getByRole('button').click();

            // check tranfer details

            await expect(page.locator('#ui-id-1')).toHaveText('Przelew wykonany');
            await expect(page.locator('[class="hide ui-dialog-content ui-widget-content"]')).toContainText(`Odbiorca:  ${transferReceiver}`);
            await expect(page.locator('[class="hide ui-dialog-content ui-widget-content"]')).toContainText(`Kwota: ${transferAmount},00PLN`);
            await expect(page.locator('[class="hide ui-dialog-content ui-widget-content"]')).toContainText(`Nazwa: ${transferTitle}`);
        })

        test('Transfer details window can be closed', async({page}) => {
            const box = page.locator('.box-white', {hasText: 'szybki przelew'});
            const dropbox = box.locator('.form-row', {hasText: 'do'});
            const amounInput = box.locator('.form-row', {hasText: 'kwota'});
            const titleInput = box.locator('.form-row', {hasText: 'tytu'});
            let dropdownOprion = 1;
            let transferAmount = '100';
            let transferTitle = 'Transfer Title';
            let transferReceiver = await dropbox.locator('select').locator('option').nth(dropdownOprion).textContent();

            // send transfer
            await dropbox.locator('select').selectOption({index: dropdownOprion});
            await amounInput.getByRole('textbox').fill(transferAmount);
            await titleInput.getByRole('textbox').fill(transferTitle);
            await box.getByRole('button').click();

            // close the window
            expect(await page.isVisible('[role="dialog"]')).toBe(true);
            await page.locator('[role="dialog"]').getByRole('button').click();
            expect(await page.isVisible('[role="dialog"]')).toBe(false);
        })
    })

    test.describe('Phone top-up', () => {
        test('Check header', async({page}) => {
            const box = page.locator('.box-white', {hasText: 'doładowanie telefonu'});
            const headerText = await box.locator('.wborder').textContent();
            expect(headerText).toEqual('doładowanie telefonu');
        })

        test('All fields are required', async({page}) => {
            const box = page.locator('.box-white', {hasText: 'doładowanie telefonu'});
            const toField = box.locator('.form-row', {hasText: 'wybierz'});
            const amountField = box.locator('.form-row', {hasText: 'kwota'});
            const verificationCheckBox = box.locator('.form-row', {hasText: 'zapozna'});

            await box.getByRole('button').click();

            // error message appears
            await expect(toField.locator('.error')).toHaveText('pole wymagane');
            await expect(amountField.locator('.error')).toHaveText('pole wymagane');
            await expect(verificationCheckBox.locator('.error')).toHaveText('pole wymagane');

            // error message disappears
            await toField.locator('select').selectOption({index: 1});
            await amountField.getByRole('textbox').fill('100');
            await verificationCheckBox.getByRole('checkbox').check();

            await expect(toField.locator('.grid-space-2')).toHaveClass('grid-space-2 grid-28 grid-mt-48 grid-mt-space-0 field is-valid');
            await expect(amountField.locator('.grid-space-2')).toHaveClass('grid-space-2 grid-24 grid-mt-38 grid-mt-space-0 field is-valid');
            await expect(verificationCheckBox.locator('.grid-48')).toHaveClass('grid-48 grid-mt-48 field checkbox-inline is-valid');
        })

        test('Check verification checkbox', async({page}) => {
            const box = page.locator('.box-white', {hasText: 'doładowanie telefonu'});
            const verificationCheckBox = box.locator('.form-row', {hasText: 'zapozna'});

            await expect(verificationCheckBox.getByRole('checkbox')).not.toBeChecked();
            await verificationCheckBox.getByRole('checkbox').check();
            await expect(verificationCheckBox.getByRole('checkbox')).toBeChecked();
        })

        test('Check dropdown options', async({page}) => {
            const box = page.locator('.box-white', {hasText: 'doładowanie telefonu'});
            const toField = box.locator('.form-row', {hasText: 'wybierz'});
            await toField.click();
            const optionsList = toField.getByRole('option');
            await expect(optionsList).toHaveText(doladoawaniaDropboxOptions)
        })

        test('Correct top-up data was sent', async({page}) => {

        })

        test('Top-up detaild window can be closed', async({page}) => {

        })

        test('Tooltip apears if 500, 502, 503 numbers selected', async({page}) => {

        })

        test('Minimum top-up sum is 5PLN', async({page}) => {

        })

        test('Select for the Amount appers if 504 number selected', async({page}) => {

        })

        test('Check options at the Amout dropdown', async({page}) => {

        })
    })
})