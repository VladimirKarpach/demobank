import {test, expect} from '@playwright/test';
import { PageManager } from '../pages/pageManager';
import { LoginPage } from '../pages/loginPage';
import { Variables } from '../pages/variables';

const variables = new Variables();

test.describe('Login Page', () => {

    test.beforeEach(async({page}) => {
        await page.goto('https://demo-bank.vercel.app/');
    })

    test('The ID field is required', async({page}) => {
        const pageManager = new PageManager(page);
        await pageManager.onLoginPage().idInputField.click();
        await pageManager.onLoginPage().passwordInputField.click();
        await pageManager.onLoginPage().checkErrorMessage('id', 'pole wymagane');
    })

    test('The Password field is required', async({page}) => {
        const pageManager = new PageManager(page);
        await pageManager.onLoginPage().passwordInputField.click();
        await pageManager.onLoginPage().idInputField.click();
        await pageManager.onLoginPage().checkErrorMessage('password', 'pole wymagane');
    })

    test('ID must be 8 characters long', async({page}) => {
        const pageManager = new PageManager(page);
        await pageManager.onLoginPage().idInputField.fill(variables.loginPage.incorrectUserId);
        await pageManager.onLoginPage().signInButton.click({force: true});
        await pageManager.onLoginPage().checkErrorMessage('id', 'identyfikator ma min. 8 znaków')
        await pageManager.onLoginPage().checkFieldHighlight('id', 'has-error')

        await pageManager.onLoginPage().idInputField.fill(variables.loginPage.correctUserId);
        await pageManager.onLoginPage().signInButton.click({force: true});
        await pageManager.onLoginPage().checkFieldHighlight('id', 'is-valid')
    })

    test('Password must be 8 characters long', async({page}) => {
        const pageManager = new PageManager(page);
        await pageManager.onLoginPage().passwordInputField.fill(variables.loginPage.incorrectPassword);
        await pageManager.onLoginPage().signInButton.click({force: true});
        await pageManager.onLoginPage().checkErrorMessage('password', 'hasło ma min. 8 znaków')
        await pageManager.onLoginPage().checkFieldHighlight('password', 'has-error')

        await pageManager.onLoginPage().passwordInputField.fill(variables.loginPage.correctPassword);
        await pageManager.onLoginPage().signInButton.click({force: true});
        await pageManager.onLoginPage().checkFieldHighlight('password', 'is-valid')
    })

    test('Sign In button isn\'t clickable untill all correct data provided', async({page}) => {   
        const pageManager = new PageManager(page);
        //both fields are empty
        await pageManager.onLoginPage().isSignInButtonActive(false);

        // only id provided
        await pageManager.onLoginPage().idInputField.fill(variables.loginPage.correctUserId);
        await pageManager.onLoginPage().isSignInButtonActive(false);
        await pageManager.onLoginPage().idInputField.clear();

        // only password provided
        await pageManager.onLoginPage().passwordInputField.fill(variables.loginPage.correctPassword);
        await pageManager.onLoginPage().isSignInButtonActive(false);
        await pageManager.onLoginPage().passwordInputField.clear();

        // correct user id and incorrect password
        await pageManager.onLoginPage().idInputField.fill(variables.loginPage.correctUserId);
        await pageManager.onLoginPage().passwordInputField.fill(variables.loginPage.incorrectPassword);
        await pageManager.onLoginPage().isSignInButtonActive(false);
        await pageManager.onLoginPage().idInputField.clear();
        await pageManager.onLoginPage().passwordInputField.clear();

        // incorrect user id and correct password
        await pageManager.onLoginPage().idInputField.fill(variables.loginPage.incorrectUserId);
        await pageManager.onLoginPage().passwordInputField.fill(variables.loginPage.correctPassword);
        await pageManager.onLoginPage().isSignInButtonActive(false);
        await pageManager.onLoginPage().idInputField.clear();
        await pageManager.onLoginPage().passwordInputField.clear();

        // user id and password are correct
        await pageManager.onLoginPage().idInputField.fill(variables.loginPage.correctUserId);
        await pageManager.onLoginPage().passwordInputField.fill(variables.loginPage.correctPassword);
        await pageManager.onLoginPage().isSignInButtonActive(true);
    })

    test('Tooltip for ID appears on hover on question mark', async({page}) => {
        const pageManager = new PageManager(page);
        await pageManager.onLoginPage().idFieldTooltip.hover();
        await pageManager.onLoginPage().checkTooltip('id', variables.loginPage.idTooltipText);

    })

    test('Tooltip for Password appears on hover on question mark', async({page}) => {
        const pageManager = new PageManager(page);
        await pageManager.onLoginPage().passwordFieldTooltip.hover()
        await pageManager.onLoginPage().checkTooltip('password', variables.loginPage.passwordTooltipText);
    })

    test('Redirection to the "More about security" page', async({page}) => {
        const pageManager = new PageManager(page);
        await expect(pageManager.onLoginPage().moreAboutSecurityButton).toBeEnabled();
        await pageManager.onLoginPage().moreAboutSecurityButton.click();
        await expect(page.locator('.login-highlight').first()).toHaveText('Pamiętaj o swoim bezpieczeństwie!');
    })

    test('Rediresction from "More about security" to the "Login" page', async({page}) => {
        const pageManager = new PageManager(page);
        await pageManager.onLoginPage().moreAboutSecurityButton.click();
        await expect(page.locator('.login-highlight').first()).toHaveText('Pamiętaj o swoim bezpieczeństwie!');
        await page.getByText('do strony logowania').click();
        await expect(page.locator('.wborder#header_2')).toHaveText('Wersja demonstracyjna serwisu Demobank');
    })

})

test.describe('Navigation by tabs', () => {
    test.beforeEach(async({page}) => {
        const pageManager = new PageManager(page);
        pageManager.onLoginPage().signIn();
    })

    test('Navigate to the "mój pulpit" page', async({page}) => {
        const pageManager = new PageManager(page);
        await pageManager.navigateTo().mojPulpitPage();
        await pageManager.navigateTo().checkHeaderText('konta osobiste')
    })

    test('Navigate to the "mój pulpit -> szybki przelew" page', async({page}) => {
        const pageManager = new PageManager(page);
        await pageManager.navigateTo().mojPulpitSzybkiPzelewPage();
        await pageManager.navigateTo().checkHeaderText('szybki przelew')
    })

    test('Navigate to the "mój pulpit -> doładowanie telefony" page', async({page}) => {
        const pageManager = new PageManager(page);
        await pageManager.navigateTo().mojPulpitDoladowanieTelefonuPage();
        await pageManager.navigateTo().checkHeaderText('doładowanie telefonu')
    })

    test('Navigate to the "mój pulpit -> manager finansowy" page', async({page}) => {
        const pageManager = new PageManager(page);
        await pageManager.navigateTo().mojPulpitManagerFinansowyPage();
        await pageManager.navigateTo().checkHeaderText('manager finansowy')
    })
    
    test('Navigate to the "konta osobiste" page', async({page}) => {
        const pageManager = new PageManager(page);
        await pageManager.navigateTo().kontaOsobistePage();
        await pageManager.navigateTo().checkHeaderText('konta osobiste')
    })

    test('Navigate to the "płatności" page', async({page}) => {
        const pageManager = new PageManager(page);
        await pageManager.navigateTo().platnosciPage();
        await pageManager.navigateTo().checkHeaderText('przelew dowolny')
    })
    
    test('Navigat to the "Raporty" page', async({page}) => {
        const pageManager = new PageManager(page);
        await pageManager.navigateTo().raportyPage();
        await pageManager.navigateTo().checkHeaderText('Raporty')

    })

    test('Navigat to the "Raporty (iFrame)" page', async({page}) => {
        const pageManager = new PageManager(page);
        await pageManager.navigateTo().raportyIframePage();
        const frame = page.frameLocator('#main_content iframe');
        await expect(frame.getByRole('heading').first()).toHaveText('Raporty (iframe)');
    })


    test('Navigate to the "generuj przelew" page', async({page}) => {
        const pageManager = new PageManager(page);
        await pageManager.navigateTo().generujPrzelewPage();
        await pageManager.navigateTo().checkHeaderText('Generowanie Przelewu')
    })

    test('Navigate to the "wykresy" page', async({page}) => {
        const pageManager = new PageManager(page);
        await pageManager.navigateTo().wykresyPage();
        await pageManager.navigateTo().checkHeaderText('Wykresy')
    })

    test('Navigate to the "tabele danych" page', async({page}) => {
        const pageManager = new PageManager(page);
        await pageManager.navigateTo().tabeleDanychPage();
        await pageManager.navigateTo().checkHeaderText('Tabele danych')
    })

    test('Navigate to the "ustawienia" page', async({page}) => {
        const pageManager = new PageManager(page)
        await pageManager.navigateTo().ustawieniaPage();
        await expect(page.locator('.login-highlight')).toHaveText('Strona w budowie!');
    })
})

test('Logout', async({page}) => {
    const pageManager = new PageManager(page);
    await page.goto('https://demo-bank.vercel.app/');
    pageManager.onLoginPage().signIn();
    await page.getByText('Wyloguj').click();
    await expect(page.locator('.wborder#header_2')).toHaveText('Wersja demonstracyjna serwisu Demobank');
})

test.describe('Mój pulpit page', () => {
    test.beforeEach(async({page}) => {
        const onLoginPage = new LoginPage(page);
        await onLoginPage.signIn();
    })

    test.describe('Quick transfer', () => {

        test('Check header', async({page}) => {
            const pageManager = new PageManager(page);
            expect(await pageManager.onMojPulpitPage().szybkiPrzelewBox.locator('.wborder').textContent()).toEqual('szybki przelew');
        })

        test('Check tooltip', async({page}) => {
            const pageManager = new PageManager(page);
            await pageManager.onMojPulpitPage().szybkiPrzelewTooltipButton.hover();
            await pageManager.onMojPulpitPage().szybkiPrzelewCheckTooltipText(variables.szybkiPrzelewPage.TooltipText);
        })

        test('All fields are required', async({page}) => {
            const pageManager = new PageManager(page)

            await page.waitForTimeout(500)
            await pageManager.onMojPulpitPage().szybkiPrzelewSubmitButton.click();

            await pageManager.onMojPulpitPage().checkFieldErrorMessage(pageManager.onMojPulpitPage().szybkiPrzelewToField, 'pole wymagane', 'has-error');
            await pageManager.onMojPulpitPage().checkFieldErrorMessage(pageManager.onMojPulpitPage().szybkiPrzelewAmountField, 'pole wymagane', 'has-error');
            await pageManager.onMojPulpitPage().checkFieldErrorMessage(pageManager.onMojPulpitPage().szybkiPrzelewTitleField, 'pole wymagane', 'has-error');
            
            await pageManager.onMojPulpitPage().selectDropdownOption(pageManager.onMojPulpitPage().szybkiPrzelewToField, 2)
            await pageManager.onMojPulpitPage().szybkiPrzelewTooltipButton.click();
            await pageManager.onMojPulpitPage().CheckFieldHighlight(pageManager.onMojPulpitPage().szybkiPrzelewToField, 'is-valid');

            await pageManager.onMojPulpitPage().szybkiPrzelewAmountField.getByRole('textbox').fill('100');
            await pageManager.onMojPulpitPage().szybkiPrzelewTooltipButton.click();
            await pageManager.onMojPulpitPage().CheckFieldHighlight(pageManager.onMojPulpitPage().szybkiPrzelewAmountField, 'is-valid');
            
            await pageManager.onMojPulpitPage().szybkiPrzelewTitleField.getByRole('textbox').fill('Transfer title');
            await pageManager.onMojPulpitPage().szybkiPrzelewTooltipButton.click();
            await pageManager.onMojPulpitPage().CheckFieldHighlight(pageManager.onMojPulpitPage().szybkiPrzelewTitleField, 'is-valid');
        })

        test('Check dropdown options', async({page}) => {
            const pageManager = new PageManager(page);
            // await pageManager.onMojPulpitPage().szybkiPrzelewToField.click();
            // await expect(pageManager.onMojPulpitPage().szybkiPrzelewToField.getByRole('option')).toHaveText(szybkiPrzelewDropdownOptions);
            await pageManager.onMojPulpitPage().checkDropdownOptions(pageManager.onMojPulpitPage().szybkiPrzelewToField, variables.szybkiPrzelewPage.DropdownOptions)
        })

        test('Correct transfer data was sent', async({page}) => {
            const pageManager = new PageManager(page);
            let dropdownOprion = 1;
            let transferAmount = '100';
            let transferTitle = 'Transfer Title';
            let transferReceiver = await pageManager.onMojPulpitPage().szybkiPrzelewToField.locator('option').nth(dropdownOprion).textContent();

            // send transfer
            await pageManager.onMojPulpitPage().szybkiPrzelewSendTransfer(pageManager.onMojPulpitPage().szybkiPrzelewToField, dropdownOprion, transferAmount, transferTitle);

            // check tranfer details
            await expect(pageManager.onMojPulpitPage().szybkiPrzelewTransferCompletedDialog.locator('.ui-widget-header')).toContainText('Przelew wykonany');
            await pageManager.onMojPulpitPage().szybkiPrzelewCheckDialodContent(transferReceiver, transferAmount, transferTitle);
        })

        test('Transfer details window can be closed', async({page}) => {
            const pageManager = new PageManager(page);
            let transferAmount = '100';
            let transferTitle = 'Transfer Title';

            await pageManager.onMojPulpitPage().szybkiPrzelewSendTransfer(pageManager.onMojPulpitPage().szybkiPrzelewToField, 2, transferAmount, transferTitle);
            await pageManager.onMojPulpitPage().szybkiPrzelewCloseComletedTransferDialogAndCheckItWasClosed();
           
        })
    })

    test.describe('Phone top-up', () => {
        test('Check header', async({page}) => {
            const pageManager = new PageManager(page);
            expect(await pageManager.onMojPulpitPage().doladowanieTelefonuBox.locator('.wborder').textContent()).toEqual('doładowanie telefonu')
        })

        test('All fields are required', async({page}) => {
            const pageManager = new PageManager(page);
            const box = page.locator('.box-white', {hasText: 'doładowanie telefonu'});
            const toField = box.locator('.form-row', {hasText: 'wybierz'});
            const amountField = box.locator('.form-row', {hasText: 'kwota'});
            const verificationCheckBox = box.locator('.form-row', {hasText: 'zapozna'});

            await page.waitForTimeout(500);
            await pageManager.onMojPulpitPage().doladowanieTelefonuSubmitButton.click();

            // error message appears
            await pageManager.onMojPulpitPage().checkFieldErrorMessage(pageManager.onMojPulpitPage().doladowanieTelefonuToField, 'pole wymagane', 'has-error');
            await pageManager.onMojPulpitPage().checkFieldErrorMessage(pageManager.onMojPulpitPage().doladowanieTelefonuAmountField, 'pole wymagane', 'has-error');
            await pageManager.onMojPulpitPage().checkFieldErrorMessage(pageManager.onMojPulpitPage().doladowanieTelefonuToField, 'pole wymagane');

            // error message disappears
            await pageManager.onMojPulpitPage().selectDropdownOption(pageManager.onMojPulpitPage().doladowanieTelefonuToField, 2) 
            await pageManager.onMojPulpitPage().doladowanieTelefonuAmountField.getByRole('textbox').fill('100');
            await page.waitForTimeout(500)
            await pageManager.onMojPulpitPage().doladowanieTelefonuVerificationCheckbox.getByRole('checkbox').click();

            await pageManager.onMojPulpitPage().CheckFieldHighlight(pageManager.onMojPulpitPage().doladowanieTelefonuToField, 'is-valid');
            await pageManager.onMojPulpitPage().CheckFieldHighlight(pageManager.onMojPulpitPage().doladowanieTelefonuAmountField, 'is-valid');
        })

        test('Check verification checkbox', async({page}) => {
            const pageManager = new PageManager(page)
            await pageManager.onMojPulpitPage().doladowanieTelefonuCheckboxCheck()
        })

        test('Check dropdown options', async({page}) => {
            const pageManager = new PageManager(page);
            await pageManager.onMojPulpitPage().checkDropdownOptions(pageManager.onMojPulpitPage().doladowanieTelefonuToField, variables.doladoawaniaPage.DropboxOptions)
        })

        // test('Correct top-up data was sent', async({page}) => {

        // })

        // test('Top-up detaild window can be closed', async({page}) => {

        // })

        // test('Tooltip apears if 500, 502, 503 numbers selected', async({page}) => {

        // })

        // test('Minimum top-up sum is 5PLN', async({page}) => {

        // })

        // test('Select for the Amount appers if 504 number selected', async({page}) => {

        // })

        // test('Check options at the Amout dropdown', async({page}) => {

        // })
    })
})