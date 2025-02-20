import { expect, Locator} from '@playwright/test'
import { test } from '../fixtures.ts'
import { Credentials } from '../pages/credentials.ts'
import { Tooltips } from '../pages/tooltips.ts'
import { ErrorMessages } from '../pages/errorMessages.ts'
import { DropdownOprions } from '../pages/dropdownOptions.ts'
import { DataToCompare } from '../pages/dataToCompare.ts'
import { on } from 'node:stream'


const credentials = new Credentials()
const tooltips = new Tooltips()
const errorMessages = new ErrorMessages()
const dropdownOptions = new DropdownOprions()
const dataToCompare = new DataToCompare()

test.describe('Login Page', () => {

    test('The ID field is required', async({page, onLoginPage}) => {
        await onLoginPage.idInputField.click();
        await onLoginPage.passwordInputField.click();
        await onLoginPage.checkErrorMessage('id', 'pole wymagane');
    })

    test('The Password field is required', async({page, onLoginPage}) => {
        await onLoginPage.passwordInputField.click();
        await onLoginPage.idInputField.click();
        await onLoginPage.checkErrorMessage('password', 'pole wymagane');
    })

    test('ID must be 8 characters long', async({page, onLoginPage}) => {
        await onLoginPage.idInputField.fill(credentials.incorrectUserId);
        await onLoginPage.signInButton.click({force: true});
        await onLoginPage.checkErrorMessage('id', 'identyfikator ma min. 8 znaków')
        await onLoginPage.checkFieldHighlight('id', 'has-error')

        await onLoginPage.idInputField.fill(credentials.correctUserId);
        await onLoginPage.signInButton.click({force: true});
        await onLoginPage.checkFieldHighlight('id', 'is-valid')
    })

    test('Password must be 8 characters long', async({page, onLoginPage}) => {
        await onLoginPage.passwordInputField.fill(credentials.incorrectPassword);
        await onLoginPage.signInButton.click({force: true});
        await onLoginPage.checkErrorMessage('password', 'hasło ma min. 8 znaków');
        await onLoginPage.checkFieldHighlight('password', 'has-error');
        await onLoginPage.passwordInputField.clear();

        await onLoginPage.passwordInputField.fill(credentials.correctPassword);
        await onLoginPage.signInButton.click({force: true});
        await page.waitForTimeout(1000);
        await onLoginPage.checkFieldHighlight('password', 'is-valid');
    })

    test('Sign In button isn\'t clickable untill all correct data provided', async({page, onLoginPage}) => {   
        //both fields are empty
        await onLoginPage.isSignInButtonActive(false);

        // only id provided
        await onLoginPage.idInputField.fill(credentials.correctUserId);
        await onLoginPage.isSignInButtonActive(false);
        await onLoginPage.idInputField.clear();

        // only password provided
        await onLoginPage.passwordInputField.fill(credentials.correctPassword);
        await onLoginPage.isSignInButtonActive(false);
        await onLoginPage.passwordInputField.clear();

        // correct user id and incorrect password
        await onLoginPage.idInputField.fill(credentials.correctUserId);
        await onLoginPage.passwordInputField.fill(credentials.incorrectPassword);
        await onLoginPage.isSignInButtonActive(false);
        await onLoginPage.idInputField.clear();
        await onLoginPage.passwordInputField.clear();

        // incorrect user id and correct password
        await onLoginPage.idInputField.fill(credentials.incorrectPassword);
        await onLoginPage.passwordInputField.fill(credentials.correctPassword);
        await onLoginPage.isSignInButtonActive(false);
        await onLoginPage.idInputField.clear();
        await onLoginPage.passwordInputField.clear();

        // user id and password are correct
        await onLoginPage.idInputField.fill(credentials.correctUserId);
        await onLoginPage.passwordInputField.fill(credentials.correctPassword);
        await onLoginPage.isSignInButtonActive(true);
    })

    test('Tooltip for ID appears on hover on question mark', async({page, onLoginPage}) => {
        await onLoginPage.idFieldTooltip.hover();
        await onLoginPage.checkTooltip('id', tooltips.loginPageIdTooltipText);

    })

    test('Tooltip for Password appears on hover on question mark', async({page, onLoginPage}) => {
        await onLoginPage.passwordFieldTooltip.hover()
        await onLoginPage.checkTooltip('password', tooltips.loginPagePasswordTooltipText);
    })

    test('Redirection to the "More about security" page', async({page, onLoginPage}) => {
        await expect(onLoginPage.moreAboutSecurityButton).toBeEnabled();
        await onLoginPage.moreAboutSecurityButton.click();
        await expect(page.locator('.login-highlight').first()).toHaveText('Pamiętaj o swoim bezpieczeństwie!');
    })

    test('Rediresction from "More about security" to the "Login" page', async({page, onLoginPage}) => {
        await onLoginPage.moreAboutSecurityButton.click();
        await expect(page.locator('.login-highlight').first()).toHaveText('Pamiętaj o swoim bezpieczeństwie!');
        await page.getByText('do strony logowania').click();
        await expect(page.locator('.wborder#header_2')).toHaveText('Wersja demonstracyjna serwisu Demobank');
    })

})

test.describe('Navigation by tabs', () => {

    test('Navigate to the "mój pulpit" page', async({page, signIn, navigateTo}) => {
        await navigateTo.mojPulpitPage();
        await navigateTo.checkHeaderText('konta osobiste')
    })

    test('Navigate to the "mój pulpit -> szybki przelew" page', async({page, signIn, navigateTo}) => {
        await navigateTo.mojPulpitSzybkiPzelewPage();
        await navigateTo.checkHeaderText('szybki przelew')
    })

    test('Navigate to the "mój pulpit -> doładowanie telefony" page', async({page, signIn, navigateTo}) => {
        await navigateTo.mojPulpitDoladowanieTelefonuPage();
        await navigateTo.checkHeaderText('doładowanie telefonu')
    })

    test('Navigate to the "mój pulpit -> manager finansowy" page', async({page, signIn, navigateTo}) => {
        await navigateTo.mojPulpitManagerFinansowyPage();
        await navigateTo.checkHeaderText('manager finansowy')
    })
    
    test('Navigate to the "konta osobiste" page', async({page, signIn, navigateTo}) => {
        await navigateTo.kontaOsobistePage();
        await navigateTo.checkHeaderText('konta osobiste')
    })

    test('Navigate to the "płatności" page', async({page, signIn, navigateTo}) => {
        await navigateTo.platnosciPage();
        await navigateTo.checkHeaderText('przelew dowolny')
    })
    
    test('Navigat to the "Raporty" page', async({page, signIn, navigateTo}) => {
        await navigateTo.raportyPage();
        await navigateTo.checkHeaderText('Raporty')

    })

    test('Navigat to the "Raporty (iFrame)" page', async({page, signIn, navigateTo}) => {
        await navigateTo.raportyIframePage();
        const frame = page.frameLocator('#main_content iframe');
        await expect(frame.getByRole('heading').first()).toHaveText('Raporty (iframe)');
    })


    test('Navigate to the "generuj przelew" page', async({page, signIn, navigateTo}) => {
        await navigateTo.generujPrzelewPage();
        await navigateTo.checkHeaderText('Generowanie Przelewu')
    })

    test('Navigate to the "wykresy" page', async({page, signIn, navigateTo}) => {
        await navigateTo.wykresyPage();
        await navigateTo.checkHeaderText('Wykresy')
    })

    test('Navigate to the "tabele danych" page', async({page, signIn, navigateTo}) => {
        await navigateTo.tabeleDanychPage();
        await navigateTo.checkHeaderText('Tabele danych')
    })

    test('Navigate to the "ustawienia" page', async({page, signIn, navigateTo}) => {
        await navigateTo.ustawieniaPage();
        await expect(page.locator('.login-highlight')).toHaveText('Strona w budowie!');
    })
})

test('Logout', async({page, signIn}) => {
    await page.getByText('Wyloguj').click();
    await expect(page.locator('.wborder#header_2')).toHaveText('Wersja demonstracyjna serwisu Demobank');
})

test.describe('Mój pulpit page', () => {

    test.describe('Quick transfer', () => {

        test('Check header', async({page, signIn, onMojPulpitPage}) => {
            expect(await onMojPulpitPage.szybkiPrzelewBox.locator('.wborder').textContent()).toEqual('szybki przelew');
        })

        test('Check tooltip', async({page, signIn, onMojPulpitPage}) => {
            await page.waitForLoadState('load');
            await onMojPulpitPage.szybkiPrzelewTooltipButton.hover();
            await onMojPulpitPage.checkTooltipText(onMojPulpitPage.szybkiPrzelewTooltipButton, tooltips.szybkiPrzelewTooltipText);
        })

        test('All fields are required', async({page, signIn, onMojPulpitPage}) => {
            await page.waitForTimeout(500)
            await onMojPulpitPage.szybkiPrzelewSubmitButton.click();

            await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.szybkiPrzelewToField, 'pole wymagane', 'has-error');
            await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.szybkiPrzelewAmountField, 'pole wymagane', 'has-error');
            await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.szybkiPrzelewTitleField, 'pole wymagane', 'has-error');
            
            await onMojPulpitPage.selectDropdownOption(onMojPulpitPage.szybkiPrzelewToField, 2)
            await onMojPulpitPage.szybkiPrzelewTooltipButton.click();
            await onMojPulpitPage.checkFieldHighlight(onMojPulpitPage.szybkiPrzelewToField, 'is-valid');

            await onMojPulpitPage.szybkiPrzelewAmountField.getByRole('textbox').fill('100');
            await onMojPulpitPage.szybkiPrzelewTooltipButton.click();
            await onMojPulpitPage.checkFieldHighlight(onMojPulpitPage.szybkiPrzelewAmountField, 'is-valid');
            
            await onMojPulpitPage.szybkiPrzelewTitleField.getByRole('textbox').fill('Transfer title');
            await onMojPulpitPage.szybkiPrzelewTooltipButton.click();
            await onMojPulpitPage.checkFieldHighlight(onMojPulpitPage.szybkiPrzelewTitleField, 'is-valid');
        })

        test('Check dropdown options', async({page, signIn, onMojPulpitPage}) => {
            await onMojPulpitPage.checkDropdownOptions(onMojPulpitPage.szybkiPrzelewToField, dropdownOptions.szybkiPrzelewDropdownOptions)
        })

        test('Correct transfer data was sent', async({page, signIn, onMojPulpitPage}) => {
            await page.waitForLoadState('load');

            let dropdownOprion = 1;
            let transferAmount = '100';
            let transferTitle = 'Transfer Title';
            let transferReceiver = await onMojPulpitPage.szybkiPrzelewToField.locator('option').nth(dropdownOprion).textContent();

            // send transfer
            await onMojPulpitPage.szybkiPrzelewSendTransfer(onMojPulpitPage.szybkiPrzelewToField, dropdownOprion, transferAmount, transferTitle);

            // check tranfer details
            await expect(onMojPulpitPage.szybkiPrzelewTransferCompletedDialog.locator('.ui-widget-header')).toContainText('Przelew wykonany');
            await onMojPulpitPage.szybkiPrzelewCheckDialodContent(transferReceiver, transferAmount, transferTitle);
        })

        test('Transfer details window can be closed', async({page, signIn, onMojPulpitPage}) => {
            let transferAmount = '100';
            let transferTitle = 'Transfer Title';
            await page.waitForLoadState('load');


            await onMojPulpitPage.szybkiPrzelewSendTransfer(onMojPulpitPage.szybkiPrzelewToField, 2, transferAmount, transferTitle);
            await onMojPulpitPage.closeComletedTransferDialogAndCheckItWasClosed();
           
        })
    })

    test.describe('Phone top-up', () => {
        test('Check header', async({page, signIn, onMojPulpitPage}) => {
            expect(await onMojPulpitPage.doladowanieTelefonuBox.locator('.wborder').textContent()).toEqual('doładowanie telefonu')
        })

        test('All fields are required', async({page, signIn, onMojPulpitPage}) => {
            const box = page.locator('.box-white', {hasText: 'doładowanie telefonu'});
            const toField = box.locator('.form-row', {hasText: 'wybierz'});
            const amountField = box.locator('.form-row', {hasText: 'kwota'});
            const verificationCheckBox = box.locator('.form-row', {hasText: 'zapozna'});

            await page.waitForTimeout(500);
            await onMojPulpitPage.doladowanieTelefonuSubmitButton.click();

            // error message appears
            await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.doladowanieTelefonuToField, 'pole wymagane', 'has-error');
            await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.doladowanieTelefonuAmountField, 'pole wymagane', 'has-error');
            await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.doladowanieTelefonuToField, 'pole wymagane');

            // error message disappears
            await onMojPulpitPage.selectDropdownOption(onMojPulpitPage.doladowanieTelefonuToField, 2) 
            await onMojPulpitPage.doladowanieTelefonuAmountField.getByRole('textbox').fill('100');
            await page.waitForTimeout(500)
            await onMojPulpitPage.doladowanieTelefonuVerificationCheckbox.getByRole('checkbox').click();

            await onMojPulpitPage.checkFieldHighlight(onMojPulpitPage.doladowanieTelefonuToField, 'is-valid');
            await onMojPulpitPage.checkFieldHighlight(onMojPulpitPage.doladowanieTelefonuAmountField, 'is-valid');
        })

        test('Check verification checkbox', async({page, signIn, onMojPulpitPage}) => {
            await onMojPulpitPage.doladowanieTelefonuCheckboxCheck()
        })

        test('Check dropdown options', async({page, signIn, onMojPulpitPage}) => {
            await onMojPulpitPage.checkDropdownOptions(onMojPulpitPage.doladowanieTelefonuToField, dropdownOptions.doladoawaniaDropboxOptions)
        })

        test('Correct top-up data was sent', async({page, signIn, onMojPulpitPage}) => {
            let dropdownOptionIndex = 2;
            let transferAmount = '1000';
            let phoneNumber = await onMojPulpitPage.doladowanieTelefonuToField.locator('option').nth(dropdownOptionIndex).textContent();
            await onMojPulpitPage.doladowanieTelefonuSendTransfer(onMojPulpitPage.doladowanieTelefonuToField, dropdownOptionIndex, transferAmount);

            await expect(onMojPulpitPage.doladowanieTelefonuTransferCompletedDialog.locator('#ui-id-1')).toHaveText('Doładowanie wykonane');
            await expect(onMojPulpitPage.doladowanieTelefonuTransferCompletedDialogCocntent).toHaveText(` Doładowanie wykonane!Kwota: ${transferAmount},00PLN Numer: ${phoneNumber}`);
        })

        test('Top-up detaild window can be closed', async({page, signIn, onMojPulpitPage}) => {
            await onMojPulpitPage.doladowanieTelefonuSendTransfer(onMojPulpitPage.doladowanieTelefonuToField, 3, '200');
            await onMojPulpitPage.closeComletedTransferDialogAndCheckItWasClosed();
        })

        test('Tooltip apears if 500, 502, 503 numbers selected', async({page, signIn, onMojPulpitPage}) => {
            for (const phoneNumber of dropdownOptions.doladoawaniaTelephoneNumbersWithoutDefaultTopUpValue){
                await onMojPulpitPage.selectDropdownOption(onMojPulpitPage.doladowanieTelefonuToField, undefined, phoneNumber);
                expect(await onMojPulpitPage.doladowanieTelefonuTopUpInfoTooltip.isVisible()).toBeTruthy();
            }
        })

        test('Check tooltip', async({page, signIn, onMojPulpitPage}) => {
            for (const phoneNumber of dropdownOptions.doladoawaniaTelephoneNumbersWithoutDefaultTopUpValue){
                await onMojPulpitPage.selectDropdownOption(onMojPulpitPage.doladowanieTelefonuToField, undefined, phoneNumber);
                await onMojPulpitPage.doladowanieTelefonuTopUpInfoTooltip.hover();
                expect(await onMojPulpitPage.doladowanieTelefonuTopUpInfoTooltip.isVisible()).toBeTruthy();
                if (phoneNumber === '503 xxx xxx'){
                    await onMojPulpitPage.checkTooltipText(onMojPulpitPage.doladowanieTelefonuTopUpInfoTooltip, tooltips.doladowanieTelefonuTopUpInfoTooltipText500);
                } else {
                    await onMojPulpitPage.checkTooltipText(onMojPulpitPage.doladowanieTelefonuTopUpInfoTooltip, tooltips.doladowanieTelefonuTopUpInfoTooltipText150);
                }
            }
        } )

        test('Boundary for the amount field for numbers 500, 502, 503', async ({page, signIn, onMojPulpitPage}) => {
            for (const phoneNumber of dropdownOptions.doladoawaniaTelephoneNumbersWithoutDefaultTopUpValue){
                await onMojPulpitPage.selectDropdownOption(onMojPulpitPage.doladowanieTelefonuToField, undefined, phoneNumber);
                if (phoneNumber === '503 xxx xxx'){
                    // valid values range is 5 - 500

                    //check lowest minus 1
                    await onMojPulpitPage.doladowanieTelefonuProvideDataToAmountField('4');
                    await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.doladowanieTelefonuAmountField, errorMessages.doladowanieTelefonuAmountTooLowErrorMessage, 'has-error');
                    await onMojPulpitPage.doladowanieTelefonuAmountField.getByRole('textbox').clear();
                    
                    //check lowest
                    await onMojPulpitPage.doladowanieTelefonuProvideDataToAmountField('5');
                    await onMojPulpitPage.checkFieldHighlight(onMojPulpitPage.doladowanieTelefonuAmountField, 'is-valid');
                    await onMojPulpitPage.doladowanieTelefonuAmountField.getByRole('textbox').clear();
                    
                    // check middle
                    await onMojPulpitPage.doladowanieTelefonuProvideDataToAmountField('348');
                    await onMojPulpitPage.checkFieldHighlight(onMojPulpitPage.doladowanieTelefonuAmountField, 'is-valid');
                    await onMojPulpitPage.doladowanieTelefonuAmountField.getByRole('textbox').clear();

                    //check highest
                    await onMojPulpitPage.doladowanieTelefonuProvideDataToAmountField('500');
                    await onMojPulpitPage.checkFieldHighlight(onMojPulpitPage.doladowanieTelefonuAmountField, 'is-valid');
                    await onMojPulpitPage.doladowanieTelefonuAmountField.getByRole('textbox').clear();

                    //check highect plust 1
                    await onMojPulpitPage.doladowanieTelefonuProvideDataToAmountField('501');
                    await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.doladowanieTelefonuAmountField, errorMessages.doladowanieTelefonuAmountTooHighErrorMessag500, 'has-error');
                    await onMojPulpitPage.doladowanieTelefonuAmountField.getByRole('textbox').clear();
                } else {
                    // valid values range is 5 - 150

                     //check lowest minus 1
                     await onMojPulpitPage.doladowanieTelefonuProvideDataToAmountField('4');
                     await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.doladowanieTelefonuAmountField, errorMessages.doladowanieTelefonuAmountTooLowErrorMessage, 'has-error');
                     await onMojPulpitPage.doladowanieTelefonuAmountField.getByRole('textbox').clear();
                     
                     //check lowest
                     await onMojPulpitPage.doladowanieTelefonuProvideDataToAmountField('5');
                     await onMojPulpitPage.checkFieldHighlight(onMojPulpitPage.doladowanieTelefonuAmountField, 'is-valid');
                     await onMojPulpitPage.doladowanieTelefonuAmountField.getByRole('textbox').clear();
                     
                     // check middle
                     await onMojPulpitPage.doladowanieTelefonuProvideDataToAmountField('112');
                     await onMojPulpitPage.checkFieldHighlight(onMojPulpitPage.doladowanieTelefonuAmountField, 'is-valid');
                     await onMojPulpitPage.doladowanieTelefonuAmountField.getByRole('textbox').clear();
 
                     //check highest
                     await onMojPulpitPage.doladowanieTelefonuProvideDataToAmountField('150');
                     await onMojPulpitPage.checkFieldHighlight(onMojPulpitPage.doladowanieTelefonuAmountField, 'is-valid');
                     await onMojPulpitPage.doladowanieTelefonuAmountField.getByRole('textbox').clear();
 
                     //check highect plust 1
                     await onMojPulpitPage.doladowanieTelefonuProvideDataToAmountField('151');
                     await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.doladowanieTelefonuAmountField, errorMessages.doladowanieTelefonuAmountTooHighErrorMessag150, 'has-error');
                     await onMojPulpitPage.doladowanieTelefonuAmountField.getByRole('textbox').clear();
                }
            }
        })

        test('Select for the Amount appers if 504 number selected', async({page, signIn, onMojPulpitPage}) => {
            await onMojPulpitPage.selectDropdownOption(onMojPulpitPage.doladowanieTelefonuToField, undefined, dropdownOptions.doladoawaniaTelephoneNumbersWithDefaultTopUpValue[0]);
            await expect(onMojPulpitPage.doladowanieTelefonuAmountField.locator('#uniform-widget_1_topup_amount')).toHaveClass('selector fixedWidth')
        })

        test('Check options at the Amout dropdown', async({page, signIn, onMojPulpitPage}) => {
            await onMojPulpitPage.selectDropdownOption(onMojPulpitPage.doladowanieTelefonuToField, undefined, dropdownOptions.doladoawaniaTelephoneNumbersWithDefaultTopUpValue[0]);
            await onMojPulpitPage.doladowanieTelefonuAmountField.click();
            await onMojPulpitPage.checkDropdownOptions(onMojPulpitPage.doladowanieTelefonuAmountField, dropdownOptions.doladoawaniaAmoutDropdownValues)
        })
    })

    test.describe('Konto na życie', () => {
        test('Section collapsed by default', async({page, signIn, onMojPulpitPage}) => {
            expect(await onMojPulpitPage.kontoNaZycieBlokadyNaKoncieField.isVisible()).toBeFalsy();
            expect(await onMojPulpitPage.kontoNaZycieLimitKredytowyField.isVisible()).toBeFalsy();
            expect(await onMojPulpitPage.kontoNaZyciePosiadaczField.isVisible()).toBeFalsy();
        })
        test('Section can be expanded by click on it', async({page, signIn, onMojPulpitPage}) => {
            await page.waitForLoadState('load');
            await onMojPulpitPage.kontoNaZycieBox.click();
            expect(await onMojPulpitPage.kontoNaZycieBlokadyNaKoncieField.isVisible()).toBeTruthy();
            expect(await onMojPulpitPage.kontoNaZycieLimitKredytowyField.isVisible()).toBeTruthy();
            expect(await onMojPulpitPage.kontoNaZyciePosiadaczField.isVisible()).toBeTruthy();
        })

        test('Section can be expended by click on the More button', async({page, signIn, onMojPulpitPage}) => {
            await page.waitForLoadState('load');
            await onMojPulpitPage.kontoNaZycieMoreButton.click();
            expect(await onMojPulpitPage.kontoNaZycieBlokadyNaKoncieField.isVisible()).toBeTruthy();
            expect(await onMojPulpitPage.kontoNaZycieLimitKredytowyField.isVisible()).toBeTruthy();
            expect(await onMojPulpitPage.kontoNaZyciePosiadaczField.isVisible()).toBeTruthy();
        })

        test('Check account number', async({page, signIn, onMojPulpitPage}) => {
            const accountNumber = await onMojPulpitPage.kontoNaZycieBox.locator('#account_number').textContent();
            expect(accountNumber).toContain('41 4100 1111 1111 1111 1111 0000');
        })

        test('Check available amount', async({page, signIn, onMojPulpitPage}) => {
            let availableAmount
            availableAmount = await onMojPulpitPage.kontoNaZycieBox.locator('.table-header .fancy-amount').textContent();
            availableAmount = availableAmount.replace(/\s+/g, '').trim();
            expect(availableAmount).toContain('13159,20PLN');
        })

        test('Check blocked amout', async({page, signIn, onMojPulpitPage}) => {
            await page.waitForLoadState('load');
            await onMojPulpitPage.kontoNaZycieBox.click();
            expect(await onMojPulpitPage.kontoNaZycieBlokadyNaKoncieField.isVisible()).toBeTruthy();
            let blockedAmount
            blockedAmount = await onMojPulpitPage.kontoNaZycieBlokadyNaKoncieField.locator('.fancy-amount').textContent();
            blockedAmount = blockedAmount.replace(/\s+/g, '').trim();
            expect(blockedAmount).toContain('300,00PLN');
        })

        test('Ceck the credit limit', async({page, signIn, onMojPulpitPage}) => {
            await page.waitForLoadState('load');
            await onMojPulpitPage.kontoNaZycieBox.click();
            expect(await onMojPulpitPage.kontoNaZycieLimitKredytowyField.isVisible()).toBeTruthy();
            let creditLimit
            creditLimit = await onMojPulpitPage.kontoNaZycieLimitKredytowyField.locator('.fancy-amount').textContent();
            creditLimit = creditLimit.replace(/\s+/g, '').trim();
            expect(creditLimit).toContain('10000,00PLN');
        })

        test('Check the account owner', async({page, signIn, onMojPulpitPage}) => {
            await page.waitForLoadState('load');
            await onMojPulpitPage.kontoNaZycieBox.click();
            expect(await onMojPulpitPage.kontoNaZyciePosiadaczField.isVisible()).toBeTruthy();
            let owner
            owner = await onMojPulpitPage.kontoNaZyciePosiadaczField.locator('#owner').textContent();
            owner = owner.replace(/\s+/g, ' ').trim('');
            expect(owner).toContain('Jan Demobankowy');
        })

        test('Verify that block collapsed by click on it', async({page, signIn, onMojPulpitPage}) => {
            await page.waitForLoadState('load');

            // expand section
            await onMojPulpitPage.kontoNaZycieMoreButton.click();
            expect(await onMojPulpitPage.kontoNaZycieBlokadyNaKoncieField.isVisible()).toBeTruthy();
            expect(await onMojPulpitPage.kontoNaZycieLimitKredytowyField.isVisible()).toBeTruthy();
            expect(await onMojPulpitPage.kontoNaZyciePosiadaczField.isVisible()).toBeTruthy();

            //collapse section
            await onMojPulpitPage.kontoNaZycieBox.click();
            await page.waitForTimeout(500);
            expect(await onMojPulpitPage.kontoNaZycieBlokadyNaKoncieField.isVisible()).toBeFalsy();
            expect(await onMojPulpitPage.kontoNaZycieLimitKredytowyField.isVisible()).toBeFalsy();
            expect(await onMojPulpitPage.kontoNaZyciePosiadaczField.isVisible()).toBeFalsy();
        })
    })

    test.describe ('Last operations', () => {
        test('Section has correct header', async({page, signIn, onMojPulpitPage}) => {
            const headerText = await onMojPulpitPage.lastOperationsBox.locator('.wborder').textContent();
            expect(headerText).toEqual('ostatnie operacje');
        })

        test('Verify operations dates', async({page, signIn, onMojPulpitPage}) => {
            await onMojPulpitPage.lastOperationsBox.locator('tr').first().waitFor();
            let numberOfRows = await onMojPulpitPage.lastOperationsBox.locator('tr').count();
            const datesFromBox: any[] = [];
            for (let i = 0; i < numberOfRows; i++){
                let date  = await onMojPulpitPage.lastOperationsBox.locator('tr').nth(i).locator('td').first().textContent();
                datesFromBox.push(date);
            }
            expect(datesFromBox).toEqual(dataToCompare.lastOperationsDates);
        })

        test('Verify operations titles', async({page, signIn, onMojPulpitPage}) => {
            await onMojPulpitPage.lastOperationsBox.locator('tr').first().waitFor();
            let numberOfRows = await onMojPulpitPage.lastOperationsBox.locator('tr').count();
            const titlesFromBox: any[] = [];
            for (let i = 0; i < numberOfRows; i++){
                let name
                name  = await onMojPulpitPage.lastOperationsBox.locator('tr').nth(i).locator('td').nth(2).locator('.short').textContent();
                name = name.replace(/\s+/g, '').trim();
                titlesFromBox.push(name);
            }
            expect(titlesFromBox).toEqual(dataToCompare.lastOperationsNames);
        })

        test('Verify operations amount', async({page, signIn, onMojPulpitPage}) => {
            await onMojPulpitPage.lastOperationsBox.locator('tr').first().waitFor();
            let numberOfRows = await onMojPulpitPage.lastOperationsBox.locator('tr').count();
            const amountFromBox: any[] = [];
            for (let i = 0; i < numberOfRows; i++){
                let amount
                amount  = await onMojPulpitPage.lastOperationsBox.locator('tr').nth(i).locator('td').nth(3).locator('.fancy-amount').textContent();
                amount = amount.replace(/\s+/g, '').trim();
                amountFromBox.push(amount);
            }
            expect(amountFromBox).toEqual(dataToCompare.lastOperationsAmount);
        })
    })
})

test.describe('Generu przelew page', () => {

    test('Account field is required', async({page, navigateToTransferGenerationPage, onGenerateTransferPage}) => {
        await page.waitForEvent('load');
        await onGenerateTransferPage.checkFieldErrorMessage(onGenerateTransferPage.accountField, 'pole wymagane', 'has-error');
        await onGenerateTransferPage.accountField.locator('select').selectOption({index:1});
        await onGenerateTransferPage.checkFieldHighlight(onGenerateTransferPage.accountField, 'is-valid');
    })

    test('Receiver field is required', async({page, navigateToTransferGenerationPage, onGenerateTransferPage}) => {
        await onGenerateTransferPage.isInputFiedlRequred(true, onGenerateTransferPage.receiverFiled, 'Test Name', 'pole wymagane');

    })

    test('To Account field is reqired', async({page, navigateToTransferGenerationPage, onGenerateTransferPage}) => {
        const validAccountNumber = Math.round(Math.random() * 1000000000000000000000).toString()
        await onGenerateTransferPage.isInputFiedlRequred(true, onGenerateTransferPage.toAcoountField, validAccountNumber, 'pole wymagane');

    })

    test('Receiver account numner must be 26 characters long', async({page, navigateToTransferGenerationPage, onGenerateTransferPage}) => {
        const invalidAccountNumber = Math.round(Math.random() * 100000000000000000000).toString();
        const validAccountNumber = Math.round(Math.random() * 1000000000000000000000).toString();

        await page.waitForEvent('load');
        // there is a bug provided ot the field. Field become valid if 21 dicits provided. In real live this test will fail and find a bug
        await onGenerateTransferPage.toAcoountField.getByRole('textbox').fill(invalidAccountNumber);
        await onGenerateTransferPage.availableAmountLabel.click({force: true});
        await onGenerateTransferPage.checkFieldErrorMessage(onGenerateTransferPage.toAcoountField, errorMessages.generateTransferAccountNumberTooShort, 'has-error');
        await onGenerateTransferPage.toAcoountField.getByRole('textbox').fill(validAccountNumber);
        await onGenerateTransferPage.availableAmountLabel.click({force: true});
        await page.waitForTimeout(500);
        await onGenerateTransferPage.checkFieldHighlight(onGenerateTransferPage.toAcoountField, 'is-valid');
        
    })

    test('Amount field is required', async({navigateToTransferGenerationPage, onGenerateTransferPage}) => {
        await onGenerateTransferPage.isInputFiedlRequred(true, onGenerateTransferPage.amountField, '300', 'pole wymagane');
    })

    test('Title field is required', async({navigateToTransferGenerationPage, onGenerateTransferPage}) => {
        onGenerateTransferPage.titleField.getByRole('textbox').clear();
        await onGenerateTransferPage.isInputFiedlRequred(true, onGenerateTransferPage.titleField, 'Test Title', 'pole wymagane');
    })

    test('Address Line 1 is oprional', async({page, navigateToTransferGenerationPage, onGenerateTransferPage}) => {
        await page.waitForEvent('load');
        await onGenerateTransferPage.addressSection.click();
        await onGenerateTransferPage.isInputFiedlRequred(false, onGenerateTransferPage.addressLine1, 'Address Line 1', '');
  
    })

    test('Address Line 2 is oprional', async({page, navigateToTransferGenerationPage, onGenerateTransferPage}) => {
        await page.waitForEvent('load');
        await onGenerateTransferPage.addressSection.click();
        await onGenerateTransferPage.isInputFiedlRequred(false, onGenerateTransferPage.addressLine1, 'Address Line 2', '');
    })

    test('Address Line 3 is oprional', async({page, navigateToTransferGenerationPage, onGenerateTransferPage}) => {
        page.waitForEvent('load');
        await onGenerateTransferPage.addressSection.click();
        await onGenerateTransferPage.isInputFiedlRequred(false, onGenerateTransferPage.addressLine1, 'Address Line 3', '');
    })
})

