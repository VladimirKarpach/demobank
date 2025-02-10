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
        const pm = new PageManager(page);
        await pm.onLoginPage().idInputField.click();
        await pm.onLoginPage().passwordInputField.click();
        await pm.onLoginPage().checkErrorMessage('id', 'pole wymagane');
    })

    test('The Password field is required', async({page}) => {
        const pm = new PageManager(page);
        await pm.onLoginPage().passwordInputField.click();
        await pm.onLoginPage().idInputField.click();
        await pm.onLoginPage().checkErrorMessage('password', 'pole wymagane');
    })

    test('ID must be 8 characters long', async({page}) => {
        const pm = new PageManager(page);
        await pm.onLoginPage().idInputField.fill(variables.loginPage.incorrectUserId);
        await pm.onLoginPage().signInButton.click({force: true});
        await pm.onLoginPage().checkErrorMessage('id', 'identyfikator ma min. 8 znaków')
        await pm.onLoginPage().checkFieldHighlight('id', 'has-error')

        await pm.onLoginPage().idInputField.fill(variables.loginPage.correctUserId);
        await pm.onLoginPage().signInButton.click({force: true});
        await pm.onLoginPage().checkFieldHighlight('id', 'is-valid')
    })

    test('Password must be 8 characters long', async({page}) => {
        const pm = new PageManager(page);
        await pm.onLoginPage().passwordInputField.fill(variables.loginPage.incorrectPassword);
        await pm.onLoginPage().signInButton.click({force: true});
        await pm.onLoginPage().checkErrorMessage('password', 'hasło ma min. 8 znaków')
        await pm.onLoginPage().checkFieldHighlight('password', 'has-error')

        await pm.onLoginPage().passwordInputField.fill(variables.loginPage.correctPassword);
        await pm.onLoginPage().signInButton.click({force: true});
        await pm.onLoginPage().checkFieldHighlight('password', 'is-valid')
    })

    test('Sign In button isn\'t clickable untill all correct data provided', async({page}) => {   
        const pm = new PageManager(page);
        //both fields are empty
        await pm.onLoginPage().isSignInButtonActive(false);

        // only id provided
        await pm.onLoginPage().idInputField.fill(variables.loginPage.correctUserId);
        await pm.onLoginPage().isSignInButtonActive(false);
        await pm.onLoginPage().idInputField.clear();

        // only password provided
        await pm.onLoginPage().passwordInputField.fill(variables.loginPage.correctPassword);
        await pm.onLoginPage().isSignInButtonActive(false);
        await pm.onLoginPage().passwordInputField.clear();

        // correct user id and incorrect password
        await pm.onLoginPage().idInputField.fill(variables.loginPage.correctUserId);
        await pm.onLoginPage().passwordInputField.fill(variables.loginPage.incorrectPassword);
        await pm.onLoginPage().isSignInButtonActive(false);
        await pm.onLoginPage().idInputField.clear();
        await pm.onLoginPage().passwordInputField.clear();

        // incorrect user id and correct password
        await pm.onLoginPage().idInputField.fill(variables.loginPage.incorrectUserId);
        await pm.onLoginPage().passwordInputField.fill(variables.loginPage.correctPassword);
        await pm.onLoginPage().isSignInButtonActive(false);
        await pm.onLoginPage().idInputField.clear();
        await pm.onLoginPage().passwordInputField.clear();

        // user id and password are correct
        await pm.onLoginPage().idInputField.fill(variables.loginPage.correctUserId);
        await pm.onLoginPage().passwordInputField.fill(variables.loginPage.correctPassword);
        await pm.onLoginPage().isSignInButtonActive(true);
    })

    test('Tooltip for ID appears on hover on question mark', async({page}) => {
        const pm = new PageManager(page);
        await pm.onLoginPage().idFieldTooltip.hover();
        await pm.onLoginPage().checkTooltip('id', variables.loginPage.idTooltipText);

    })

    test('Tooltip for Password appears on hover on question mark', async({page}) => {
        const pm = new PageManager(page);
        await pm.onLoginPage().passwordFieldTooltip.hover()
        await pm.onLoginPage().checkTooltip('password', variables.loginPage.passwordTooltipText);
    })

    test('Redirection to the "More about security" page', async({page}) => {
        const pm = new PageManager(page);
        await expect(pm.onLoginPage().moreAboutSecurityButton).toBeEnabled();
        await pm.onLoginPage().moreAboutSecurityButton.click();
        await expect(page.locator('.login-highlight').first()).toHaveText('Pamiętaj o swoim bezpieczeństwie!');
    })

    test('Rediresction from "More about security" to the "Login" page', async({page}) => {
        const pm = new PageManager(page);
        await pm.onLoginPage().moreAboutSecurityButton.click();
        await expect(page.locator('.login-highlight').first()).toHaveText('Pamiętaj o swoim bezpieczeństwie!');
        await page.getByText('do strony logowania').click();
        await expect(page.locator('.wborder#header_2')).toHaveText('Wersja demonstracyjna serwisu Demobank');
    })

})

test.describe('Navigation by tabs', () => {
    test.beforeEach(async({page}) => {
        const pm = new PageManager(page);
        pm.onLoginPage().signIn();
    })

    test('Navigate to the "mój pulpit" page', async({page}) => {
        const pm = new PageManager(page);
        await pm.navigateTo().mojPulpitPage();
        await pm.navigateTo().checkHeaderText('konta osobiste')
    })

    test('Navigate to the "mój pulpit -> szybki przelew" page', async({page}) => {
        const pm = new PageManager(page);
        await pm.navigateTo().mojPulpitSzybkiPzelewPage();
        await pm.navigateTo().checkHeaderText('szybki przelew')
    })

    test('Navigate to the "mój pulpit -> doładowanie telefony" page', async({page}) => {
        const pm = new PageManager(page);
        await pm.navigateTo().mojPulpitDoladowanieTelefonuPage();
        await pm.navigateTo().checkHeaderText('doładowanie telefonu')
    })

    test('Navigate to the "mój pulpit -> manager finansowy" page', async({page}) => {
        const pm = new PageManager(page);
        await pm.navigateTo().mojPulpitManagerFinansowyPage();
        await pm.navigateTo().checkHeaderText('manager finansowy')
    })
    
    test('Navigate to the "konta osobiste" page', async({page}) => {
        const pm = new PageManager(page);
        await pm.navigateTo().kontaOsobistePage();
        await pm.navigateTo().checkHeaderText('konta osobiste')
    })

    test('Navigate to the "płatności" page', async({page}) => {
        const pm = new PageManager(page);
        await pm.navigateTo().platnosciPage();
        await pm.navigateTo().checkHeaderText('przelew dowolny')
    })
    
    test('Navigat to the "Raporty" page', async({page}) => {
        const pm = new PageManager(page);
        await pm.navigateTo().raportyPage();
        await pm.navigateTo().checkHeaderText('Raporty')

    })

    test('Navigat to the "Raporty (iFrame)" page', async({page}) => {
        const pm = new PageManager(page);
        await pm.navigateTo().raportyIframePage();
        const frame = page.frameLocator('#main_content iframe');
        await expect(frame.getByRole('heading').first()).toHaveText('Raporty (iframe)');
    })


    test('Navigate to the "generuj przelew" page', async({page}) => {
        const pm = new PageManager(page);
        await pm.navigateTo().generujPrzelewPage();
        await pm.navigateTo().checkHeaderText('Generowanie Przelewu')
    })

    test('Navigate to the "wykresy" page', async({page}) => {
        const pm = new PageManager(page);
        await pm.navigateTo().wykresyPage();
        await pm.navigateTo().checkHeaderText('Wykresy')
    })

    test('Navigate to the "tabele danych" page', async({page}) => {
        const pm = new PageManager(page);
        await pm.navigateTo().tabeleDanychPage();
        await pm.navigateTo().checkHeaderText('Tabele danych')
    })

    test('Navigate to the "ustawienia" page', async({page}) => {
        const pm = new PageManager(page)
        await pm.navigateTo().ustawieniaPage();
        await expect(page.locator('.login-highlight')).toHaveText('Strona w budowie!');
    })
})

test('Logout', async({page}) => {
    const pm = new PageManager(page);
    await page.goto('https://demo-bank.vercel.app/');
    pm.onLoginPage().signIn();
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
            const pm = new PageManager(page);
            expect(await pm.onMojPulpitPage().szybkiPrzelewBox.locator('.wborder').textContent()).toEqual('szybki przelew');
        })

        test('Check tooltip', async({page}) => {
            const pm = new PageManager(page);
            await page.waitForLoadState('load');
            await pm.onMojPulpitPage().szybkiPrzelewTooltipButton.hover();
            await pm.onMojPulpitPage().checkTooltipText(pm.onMojPulpitPage().szybkiPrzelewTooltipButton, variables.szybkiPrzelewPage.tooltipText);
        })

        test('All fields are required', async({page}) => {
            const pm = new PageManager(page)

            await page.waitForTimeout(500)
            await pm.onMojPulpitPage().szybkiPrzelewSubmitButton.click();

            await pm.onMojPulpitPage().checkFieldErrorMessage(pm.onMojPulpitPage().szybkiPrzelewToField, 'pole wymagane', 'has-error');
            await pm.onMojPulpitPage().checkFieldErrorMessage(pm.onMojPulpitPage().szybkiPrzelewAmountField, 'pole wymagane', 'has-error');
            await pm.onMojPulpitPage().checkFieldErrorMessage(pm.onMojPulpitPage().szybkiPrzelewTitleField, 'pole wymagane', 'has-error');
            
            await pm.onMojPulpitPage().selectDropdownOption(pm.onMojPulpitPage().szybkiPrzelewToField, 2)
            await pm.onMojPulpitPage().szybkiPrzelewTooltipButton.click();
            await pm.onMojPulpitPage().checkFieldHighlight(pm.onMojPulpitPage().szybkiPrzelewToField, 'is-valid');

            await pm.onMojPulpitPage().szybkiPrzelewAmountField.getByRole('textbox').fill('100');
            await pm.onMojPulpitPage().szybkiPrzelewTooltipButton.click();
            await pm.onMojPulpitPage().checkFieldHighlight(pm.onMojPulpitPage().szybkiPrzelewAmountField, 'is-valid');
            
            await pm.onMojPulpitPage().szybkiPrzelewTitleField.getByRole('textbox').fill('Transfer title');
            await pm.onMojPulpitPage().szybkiPrzelewTooltipButton.click();
            await pm.onMojPulpitPage().checkFieldHighlight(pm.onMojPulpitPage().szybkiPrzelewTitleField, 'is-valid');
        })

        test('Check dropdown options', async({page}) => {
            const pm = new PageManager(page);
            // await pm.onMojPulpitPage().szybkiPrzelewToField.click();
            // await expect(pm.onMojPulpitPage().szybkiPrzelewToField.getByRole('option')).toHaveText(szybkiPrzelewDropdownOptions);
            await pm.onMojPulpitPage().checkDropdownOptions(pm.onMojPulpitPage().szybkiPrzelewToField, variables.szybkiPrzelewPage.dropdownOptions)
        })

        test('Correct transfer data was sent', async({page}) => {
            const pm = new PageManager(page);
            await page.waitForLoadState('load');

            let dropdownOprion = 1;
            let transferAmount = '100';
            let transferTitle = 'Transfer Title';
            let transferReceiver = await pm.onMojPulpitPage().szybkiPrzelewToField.locator('option').nth(dropdownOprion).textContent();

            // send transfer
            await pm.onMojPulpitPage().szybkiPrzelewSendTransfer(pm.onMojPulpitPage().szybkiPrzelewToField, dropdownOprion, transferAmount, transferTitle);

            // check tranfer details
            await expect(pm.onMojPulpitPage().szybkiPrzelewTransferCompletedDialog.locator('.ui-widget-header')).toContainText('Przelew wykonany');
            await pm.onMojPulpitPage().szybkiPrzelewCheckDialodContent(transferReceiver, transferAmount, transferTitle);
        })

        test('Transfer details window can be closed', async({page}) => {
            const pm = new PageManager(page);
            let transferAmount = '100';
            let transferTitle = 'Transfer Title';
            await page.waitForLoadState('load');


            await pm.onMojPulpitPage().szybkiPrzelewSendTransfer(pm.onMojPulpitPage().szybkiPrzelewToField, 2, transferAmount, transferTitle);
            await pm.onMojPulpitPage().closeComletedTransferDialogAndCheckItWasClosed();
           
        })
    })

    test.describe('Phone top-up', () => {
        test('Check header', async({page}) => {
            const pm = new PageManager(page);
            expect(await pm.onMojPulpitPage().doladowanieTelefonuBox.locator('.wborder').textContent()).toEqual('doładowanie telefonu')
        })

        test('All fields are required', async({page}) => {
            const pm = new PageManager(page);
            const box = page.locator('.box-white', {hasText: 'doładowanie telefonu'});
            const toField = box.locator('.form-row', {hasText: 'wybierz'});
            const amountField = box.locator('.form-row', {hasText: 'kwota'});
            const verificationCheckBox = box.locator('.form-row', {hasText: 'zapozna'});

            await page.waitForTimeout(500);
            await pm.onMojPulpitPage().doladowanieTelefonuSubmitButton.click();

            // error message appears
            await pm.onMojPulpitPage().checkFieldErrorMessage(pm.onMojPulpitPage().doladowanieTelefonuToField, 'pole wymagane', 'has-error');
            await pm.onMojPulpitPage().checkFieldErrorMessage(pm.onMojPulpitPage().doladowanieTelefonuAmountField, 'pole wymagane', 'has-error');
            await pm.onMojPulpitPage().checkFieldErrorMessage(pm.onMojPulpitPage().doladowanieTelefonuToField, 'pole wymagane');

            // error message disappears
            await pm.onMojPulpitPage().selectDropdownOption(pm.onMojPulpitPage().doladowanieTelefonuToField, 2) 
            await pm.onMojPulpitPage().doladowanieTelefonuAmountField.getByRole('textbox').fill('100');
            await page.waitForTimeout(500)
            await pm.onMojPulpitPage().doladowanieTelefonuVerificationCheckbox.getByRole('checkbox').click();

            await pm.onMojPulpitPage().checkFieldHighlight(pm.onMojPulpitPage().doladowanieTelefonuToField, 'is-valid');
            await pm.onMojPulpitPage().checkFieldHighlight(pm.onMojPulpitPage().doladowanieTelefonuAmountField, 'is-valid');
        })

        test('Check verification checkbox', async({page}) => {
            const pm = new PageManager(page)
            await pm.onMojPulpitPage().doladowanieTelefonuCheckboxCheck()
        })

        test('Check dropdown options', async({page}) => {
            const pm = new PageManager(page);
            await pm.onMojPulpitPage().checkDropdownOptions(pm.onMojPulpitPage().doladowanieTelefonuToField, variables.doladoawaniaPage.dropboxOptions)
        })

        test('Correct top-up data was sent', async({page}) => {
            const pm = new PageManager (page);
            let dropdownOptionIndex = 2;
            let transferAmount = '1000';
            let phoneNumber = await pm.onMojPulpitPage().doladowanieTelefonuToField.locator('option').nth(dropdownOptionIndex).textContent();
            await pm.onMojPulpitPage().doladowanieTelefonuSendTransfer(pm.onMojPulpitPage().doladowanieTelefonuToField, dropdownOptionIndex, transferAmount);

            await expect(pm.onMojPulpitPage().doladowanieTelefonuTransferCompletedDialog.locator('#ui-id-1')).toHaveText('Doładowanie wykonane');
            await expect(pm.onMojPulpitPage().doladowanieTelefonuTransferCompletedDialogCocntent).toHaveText(` Doładowanie wykonane!Kwota: ${transferAmount},00PLN Numer: ${phoneNumber}`);
        })

        test('Top-up detaild window can be closed', async({page}) => {
            const pm = new PageManager(page);
            await pm.onMojPulpitPage().doladowanieTelefonuSendTransfer(pm.onMojPulpitPage().doladowanieTelefonuToField, 3, '200');
            await pm.onMojPulpitPage().closeComletedTransferDialogAndCheckItWasClosed();
        })

        test('Tooltip apears if 500, 502, 503 numbers selected', async({page}) => {
            const pm = new PageManager(page);

            for (const phoneNumber of variables.doladoawaniaPage.telephoneNumbersWithoutDefaultTopUpValue){
                await pm.onMojPulpitPage().selectDropdownOption(pm.onMojPulpitPage().doladowanieTelefonuToField, undefined, phoneNumber);
                expect(await pm.onMojPulpitPage().doladowanieTelefonuTopUpInfoTooltip.isVisible()).toBeTruthy();
            }
        })

        test('Check tooltip', async({page}) => {
            const pm = new PageManager(page);
            for (const phoneNumber of variables.doladoawaniaPage.telephoneNumbersWithoutDefaultTopUpValue){
                await pm.onMojPulpitPage().selectDropdownOption(pm.onMojPulpitPage().doladowanieTelefonuToField, undefined, phoneNumber);
                await pm.onMojPulpitPage().doladowanieTelefonuTopUpInfoTooltip.hover();
                expect(await pm.onMojPulpitPage().doladowanieTelefonuTopUpInfoTooltip.isVisible()).toBeTruthy();
                if (phoneNumber === '503 xxx xxx'){
                    await pm.onMojPulpitPage().checkTooltipText(pm.onMojPulpitPage().doladowanieTelefonuTopUpInfoTooltip, variables.doladoawaniaPage.doladowanieTelefonuTopUpInfoTooltipText500);
                } else {
                    await pm.onMojPulpitPage().checkTooltipText(pm.onMojPulpitPage().doladowanieTelefonuTopUpInfoTooltip, variables.doladoawaniaPage.doladowanieTelefonuTopUpInfoTooltipText150);
                }
            }
        } )

        test('Boundary for the amount field for numbers 500, 502, 503', async ({page}) => {
            const pm = new PageManager(page);
            for (const phoneNumber of variables.doladoawaniaPage.telephoneNumbersWithoutDefaultTopUpValue){
                await pm.onMojPulpitPage().selectDropdownOption(pm.onMojPulpitPage().doladowanieTelefonuToField, undefined, phoneNumber);
                if (phoneNumber === '503 xxx xxx'){
                    // valid values range is 5 - 500

                    //check lowest minus 1
                    await pm.onMojPulpitPage().doladowanieTelefonuProvideDataToAmountField('4');
                    await pm.onMojPulpitPage().checkFieldErrorMessage(pm.onMojPulpitPage().doladowanieTelefonuAmountField, variables.doladoawaniaPage.amountTooLowErrorMessage, 'has-error');
                    await pm.onMojPulpitPage().doladowanieTelefonuAmountField.getByRole('textbox').clear();
                    
                    //check lowest
                    await pm.onMojPulpitPage().doladowanieTelefonuProvideDataToAmountField('5');
                    await pm.onMojPulpitPage().checkFieldHighlight(pm.onMojPulpitPage().doladowanieTelefonuAmountField, 'is-valid');
                    await pm.onMojPulpitPage().doladowanieTelefonuAmountField.getByRole('textbox').clear();
                    
                    // check middle
                    await pm.onMojPulpitPage().doladowanieTelefonuProvideDataToAmountField('348');
                    await pm.onMojPulpitPage().checkFieldHighlight(pm.onMojPulpitPage().doladowanieTelefonuAmountField, 'is-valid');
                    await pm.onMojPulpitPage().doladowanieTelefonuAmountField.getByRole('textbox').clear();

                    //check highest
                    await pm.onMojPulpitPage().doladowanieTelefonuProvideDataToAmountField('500');
                    await pm.onMojPulpitPage().checkFieldHighlight(pm.onMojPulpitPage().doladowanieTelefonuAmountField, 'is-valid');
                    await pm.onMojPulpitPage().doladowanieTelefonuAmountField.getByRole('textbox').clear();

                    //check highect plust 1
                    await pm.onMojPulpitPage().doladowanieTelefonuProvideDataToAmountField('501');
                    await pm.onMojPulpitPage().checkFieldErrorMessage(pm.onMojPulpitPage().doladowanieTelefonuAmountField, variables.doladoawaniaPage.amountTooHighErrorMessag500, 'has-error');
                    await pm.onMojPulpitPage().doladowanieTelefonuAmountField.getByRole('textbox').clear();
                } else {
                    // valid values range is 5 - 150

                     //check lowest minus 1
                     await pm.onMojPulpitPage().doladowanieTelefonuProvideDataToAmountField('4');
                     await pm.onMojPulpitPage().checkFieldErrorMessage(pm.onMojPulpitPage().doladowanieTelefonuAmountField, variables.doladoawaniaPage.amountTooLowErrorMessage, 'has-error');
                     await pm.onMojPulpitPage().doladowanieTelefonuAmountField.getByRole('textbox').clear();
                     
                     //check lowest
                     await pm.onMojPulpitPage().doladowanieTelefonuProvideDataToAmountField('5');
                     await pm.onMojPulpitPage().checkFieldHighlight(pm.onMojPulpitPage().doladowanieTelefonuAmountField, 'is-valid');
                     await pm.onMojPulpitPage().doladowanieTelefonuAmountField.getByRole('textbox').clear();
                     
                     // check middle
                     await pm.onMojPulpitPage().doladowanieTelefonuProvideDataToAmountField('112');
                     await pm.onMojPulpitPage().checkFieldHighlight(pm.onMojPulpitPage().doladowanieTelefonuAmountField, 'is-valid');
                     await pm.onMojPulpitPage().doladowanieTelefonuAmountField.getByRole('textbox').clear();
 
                     //check highest
                     await pm.onMojPulpitPage().doladowanieTelefonuProvideDataToAmountField('150');
                     await pm.onMojPulpitPage().checkFieldHighlight(pm.onMojPulpitPage().doladowanieTelefonuAmountField, 'is-valid');
                     await pm.onMojPulpitPage().doladowanieTelefonuAmountField.getByRole('textbox').clear();
 
                     //check highect plust 1
                     await pm.onMojPulpitPage().doladowanieTelefonuProvideDataToAmountField('151');
                     await pm.onMojPulpitPage().checkFieldErrorMessage(pm.onMojPulpitPage().doladowanieTelefonuAmountField, variables.doladoawaniaPage.amountTooHighErrorMessag150, 'has-error');
                     await pm.onMojPulpitPage().doladowanieTelefonuAmountField.getByRole('textbox').clear();
                }
            }
        })

        test('Select for the Amount appers if 504 number selected', async({page}) => {
            const pm = new PageManager(page);
            await pm.onMojPulpitPage().selectDropdownOption(pm.onMojPulpitPage().doladowanieTelefonuToField, undefined, variables.doladoawaniaPage.telephoneNumbersWithDefaultTopUpValue[0]);
            await expect(pm.onMojPulpitPage().doladowanieTelefonuAmountField.locator('#uniform-widget_1_topup_amount')).toHaveClass('selector fixedWidth')
        })

        test('Check options at the Amout dropdown', async({page}) => {
            const pm = new PageManager(page);
            await pm.onMojPulpitPage().selectDropdownOption(pm.onMojPulpitPage().doladowanieTelefonuToField, undefined, variables.doladoawaniaPage.telephoneNumbersWithDefaultTopUpValue[0]);
            await pm.onMojPulpitPage().doladowanieTelefonuAmountField.click();
            await pm.onMojPulpitPage().checkDropdownOptions(pm.onMojPulpitPage().doladowanieTelefonuAmountField, variables.doladoawaniaPage.amoutDropdownValues)
        })
    })

    // test.describe('Konto na życie', () => {
    //     test('Section collapsed by default', async({page}) => {

    //     })
    //     test('Section can be expended by click on it', async({page}) => {

    //     })

    //     test('Section can be expended by click on the More button', async({page}) => {

    //     })

    //     test('Check account number', async({page}) => {

    //     })

    //     test('Check available amount', async({page}) => {

    //     })

    //     test('Check blocked amout', async({page}) => {

    //     })

    //     test('Ceck the credit lomit', async({page}) => {

    //     })

    //     test('Check the account owner', async({page}) => {

    //     })
    // })
})

