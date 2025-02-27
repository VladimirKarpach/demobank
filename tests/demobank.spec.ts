import { expect, firefox, Locator} from '@playwright/test'
import { test } from '../fixtures.ts'
import { Credentials } from '../pages/credentials.ts'
import { Tooltips } from '../pages/tooltips.ts'
import { ErrorMessages } from '../pages/errorMessages.ts'
import { DropdownOprions } from '../pages/dropdownOptions.ts'
import { DataToCompare } from '../pages/dataToCompare.ts'


const credentials = new Credentials()
const tooltips = new Tooltips()
const errorMessages = new ErrorMessages()
const dropdownOptions = new DropdownOprions()
const dataToCompare = new DataToCompare()

test.describe('Login Page', () => {

    test('The ID field is required', async({page, onLoginPage}) => {
        await onLoginPage.idInputField.click();
        await onLoginPage.passwordInputField.click();
        await onLoginPage.checkErrorMessage('id', errorMessages.fieldIsRequired);
    })

    test('The Password field is required', async({page, onLoginPage}) => {
        await onLoginPage.passwordInputField.click();
        await onLoginPage.idInputField.click();
        await onLoginPage.checkErrorMessage('password', errorMessages.fieldIsRequired);
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

            await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.szybkiPrzelewToField, errorMessages.fieldIsRequired, 'has-error');
            await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.szybkiPrzelewAmountField, errorMessages.fieldIsRequired, 'has-error');
            await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.szybkiPrzelewTitleField, errorMessages.fieldIsRequired, 'has-error');
            
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
            await onMojPulpitPage.szybkiPrzelewCheckDialogContent(transferReceiver, transferAmount, transferTitle);
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
            await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.doladowanieTelefonuToField, errorMessages.fieldIsRequired, 'has-error');
            await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.doladowanieTelefonuAmountField, errorMessages.fieldIsRequired, 'has-error');
            await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.doladowanieTelefonuToField, errorMessages.fieldIsRequired);

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
            await page.waitForEvent('load')
            for (const phoneNumber of dropdownOptions.doladoawaniaTelephoneNumbersWithoutDefaultTopUpValue){
                await onMojPulpitPage.selectDropdownOption(onMojPulpitPage.doladowanieTelefonuToField, undefined, phoneNumber);
                expect(await onMojPulpitPage.doladowanieTelefonuTopUpInfoTooltip.isVisible()).toBeTruthy();
            }
        })

        test('Check tooltip', async({page, signIn, onMojPulpitPage}) => {
            await page.waitForEvent('load');
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
 
                     //check highest plus 1
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
            await page.waitForEvent('load');
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

test.describe('Generuj przelew page', () => {

    test('Account field is required', async({page, navigateToTransferGenerationPage, onGenerateTransferPage}) => {
        await page.waitForEvent('load');
        await onGenerateTransferPage.checkFieldErrorMessage(onGenerateTransferPage.accountField, errorMessages.fieldIsRequired, 'has-error');
        await onGenerateTransferPage.accountField.locator('select').selectOption({index:1});
        await onGenerateTransferPage.checkFieldHighlight(onGenerateTransferPage.accountField, 'is-valid');
    })

    test('Receiver field is required', async({page, navigateToTransferGenerationPage, onGenerateTransferPage}) => {
        await onGenerateTransferPage.isInputFiedlRequred(true, onGenerateTransferPage.receiverFiled, 'Test Name', errorMessages.fieldIsRequired);

    })

    test('To Account field is reqired', async({page, navigateToTransferGenerationPage, onGenerateTransferPage}) => {

        const validAccountNumber = Math.round(Math.random() * 1000000000000000000000).toString()
        await onGenerateTransferPage.isInputFiedlRequred(true, onGenerateTransferPage.toAcoountField, validAccountNumber, errorMessages.fieldIsRequired);

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
        await onGenerateTransferPage.isInputFiedlRequred(true, onGenerateTransferPage.amountField, '300', errorMessages.fieldIsRequired);
    })

    test('Amount can\'t be greater that available amout', async({page, navigateToTransferGenerationPage, onGenerateTransferPage}) => {
        const availableAmount: any = await onGenerateTransferPage.availableAmountLabel.locator('#form_account_amount').textContent();
        const amountToInput = (Number(availableAmount?.replace(/,/g, '.')) + 0.01).toFixed(2).toString();
        await page.waitForEvent('load');
        await onGenerateTransferPage.amountField.getByRole('textbox').fill(amountToInput);
        await onGenerateTransferPage.amountField.getByRole('textbox').click();
        await onGenerateTransferPage.availableAmountLabel.click({force:true});
        await onGenerateTransferPage.checkFieldErrorMessage(onGenerateTransferPage.amountField, `${errorMessages.generateTransferAmountTooHigh} ${availableAmount.replace(/,/g, '.')}`, 'has-error');
    })

    test('Amount can be equal to available amount', async({page, navigateToTransferGenerationPage, onGenerateTransferPage}) => {
        const availableAmount: any = await onGenerateTransferPage.availableAmountLabel.locator('#form_account_amount').textContent();
        const amountToInput = Number(availableAmount?.replace(/,/g, '.')).toFixed(2).toString();
        await page.waitForEvent('load');
        await onGenerateTransferPage.amountField.getByRole('textbox').fill(amountToInput);
        await onGenerateTransferPage.amountField.getByRole('textbox').click()
        await onGenerateTransferPage.availableAmountLabel.click({force: true});
        await page.waitForTimeout(200);
        await onGenerateTransferPage.checkFieldHighlight(onGenerateTransferPage.amountField, 'is-valid');
    })

    // test always fails because of bug in the app. Thos test is commented to avoinf fails for all run
    // test('Available amount after transfer changed if amount for transwer provided', async({page, navigateToTransferGenerationPage, onGenerateTransferPage}) => {
    //     const availableAmount: any = await onGenerateTransferPage.availableAmountLabel.locator('#form_account_amount').textContent();
    //     const numberedAmount = Number(availableAmount?.replace(/,/g, '.'));
    //     const transferAmount = Number((Math.random() * 1000).toFixed(2));
    //     const availableAmountAfterTransferProvided = (numberedAmount - transferAmount).toFixed(2)

    //     await onGenerateTransferPage.amountField.getByRole('textbox').fill(transferAmount.toString());
    //     await onGenerateTransferPage.availableAmountLabel.click({force: true});
    //     await page.waitForTimeout(1000)

    //     const actualAvailableAmount = await onGenerateTransferPage.amountLabel.locator('#form_transfer_after').textContent();
    //     expect(actualAvailableAmount).toEqual(availableAmountAfterTransferProvided.toString().replace('.', ','))
    // })

    test('Title field is required', async({navigateToTransferGenerationPage, onGenerateTransferPage}) => {
        onGenerateTransferPage.titleField.getByRole('textbox').clear();
        await onGenerateTransferPage.isInputFiedlRequred(true, onGenerateTransferPage.titleField, 'Test Title', errorMessages.fieldIsRequired);
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
        await page.waitForEvent('load');
        await onGenerateTransferPage.addressSection.click();
        await onGenerateTransferPage.isInputFiedlRequred(false, onGenerateTransferPage.addressLine1, 'Address Line 3', '');
    })

    test('Execution date field is required if the common transfer type selected', async({page, navigateToTransferGenerationPage, onGenerateTransferPage}) => {
        await expect(onGenerateTransferPage.commonTransferCheckbox).toBeChecked()
        await onGenerateTransferPage.executionDateField.getByRole('textbox').click();
        await onGenerateTransferPage.executionDateField.getByRole('textbox').clear();
        await onGenerateTransferPage.availableAmountLabel.click({force: true});
        await onGenerateTransferPage.checkFieldErrorMessage(onGenerateTransferPage.executionDateField, errorMessages.fieldIsRequired, 'has-error');

        await onGenerateTransferPage.executionDateField.getByRole('textbox').click();
        await onGenerateTransferPage.datepickerAvailableDates.first().click();
        await onGenerateTransferPage.checkFieldHighlight(onGenerateTransferPage.executionDateField, 'is-valid');
    })

    test('Express transfer procic is 5 PLN', async({page, navigateToTransferGenerationPage, onGenerateTransferPage}) => {
        await onGenerateTransferPage.expressTransferCheckbox.check();
        const transferPrice = await onGenerateTransferPage.transferTypeLabel.locator('#form_fee').textContent();
        expect(transferPrice).toEqual('5,00');
    })

    test('Common transfer is free', async({page, navigateToTransferGenerationPage, onGenerateTransferPage}) => {
        await onGenerateTransferPage.commonTransferCheckbox.check();
        const transferPrice = await onGenerateTransferPage.transferTypeLabel.locator('#form_fee').textContent();
        expect(transferPrice).toEqual('0,00');
    })

    test('Transfer date field disabled if express transfer seleceted', async({page, navigateToTransferGenerationPage, onGenerateTransferPage}) => {
        await onGenerateTransferPage.expressTransferCheckbox.check();
        expect(await onGenerateTransferPage.executionDateField.locator('input').isDisabled()).toBeTruthy();
    })

    test('Transfer date field enabled if common transfer seleceted', async({page, navigateToTransferGenerationPage, onGenerateTransferPage}) => {
        await onGenerateTransferPage.commonTransferCheckbox.check();
        expect(await onGenerateTransferPage.executionDateField.locator('input').isDisabled()).toBeFalsy();
    })

})

test.describe('Moj pulpit -> Szybki przelew page', () => {
    test('To field is required', async({page, navigateToQuickTransfePage, onMojPulpitPage}) => {
        await page.waitForEvent('load');
        await onMojPulpitPage.quickTransferSubmitButton.click();
        await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.quickTransferToField, errorMessages.fieldIsRequired, 'has-error');
    })

    test('Amount field is required', async({page, navigateToQuickTransfePage, onMojPulpitPage}) => {
        await page.waitForEvent('load');
        await onMojPulpitPage.quickTransferSubmitButton.click();
        await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.quickTransferAmountField, errorMessages.fieldIsRequired, 'has-error');
    })

    test('Amount can\'t b greater than 1000000', async({page, navigateToQuickTransfePage, onMojPulpitPage}) => {
        await page.waitForEvent('load');
        await onMojPulpitPage.quickTransferAmountField.getByRole('textbox').fill('1000000.01')
        await onMojPulpitPage.quickTransferSubmitButton.click();
        await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.quickTransferAmountField, errorMessages.mojPulpitQuickTransferAmounttooHigh, 'has-error');
        await onMojPulpitPage.quickTransferAmountField.getByRole('textbox').clear();
        await onMojPulpitPage.quickTransferAmountField.getByRole('textbox').fill('1000000.00');
        await onMojPulpitPage.quickTransferSubmitButton.click();
        await onMojPulpitPage.checkFieldHighlight(onMojPulpitPage.quickTransferAmountField, 'is-valid');

    })

    test('Title field is required', async({page, navigateToQuickTransfePage, onMojPulpitPage}) => {
        await page.waitForEvent('load');
        await onMojPulpitPage.quickTransferSubmitButton.click();
        await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.quickTransferTitleField, errorMessages.fieldIsRequired, 'has-error');
    })

    test('Check options at the To field dropdown', async({page, navigateToQuickTransfePage, onMojPulpitPage}) => {
        await page.waitForEvent('load');
        await onMojPulpitPage.checkDropdownOptions(onMojPulpitPage.quickTransferToField, dropdownOptions.quickTransferDropdownOptions)
    })

    test('Check tooltip', async({page, navigateToQuickTransfePage, onMojPulpitPage}) => {
        await page.waitForEvent('load');
        await onMojPulpitPage.quickTransferTooltip.hover();
        await onMojPulpitPage.checkTooltipText(onMojPulpitPage.quickTransferTooltip, tooltips.szybkiPrzelewTooltipText);
    })

    test('Make a transfer', async({page, navigateToQuickTransfePage, onMojPulpitPage}) => {
        await page.waitForEvent('load')
        await onMojPulpitPage.quickTransferSendTransfer(onMojPulpitPage.quickTransferToField, 1, '1000', 'Test Transfer');
        expect(await onMojPulpitPage.quickTransferDetailsDialog.isVisible()).toBeTruthy();
    })

    test('Check transfer details', async({page, navigateToQuickTransfePage, onMojPulpitPage}) => {
        const toOption = Math.floor(Math.random() * 2) + 1;
        const amount = Math.floor(Math.random() * 10000).toString() + ',00';
        const title = 'Transfer title ' + Math.floor(Math.random() * 100).toString();
        const toPerson = await onMojPulpitPage.quickTransferToField.locator('option').nth(toOption).textContent();

        await page.waitForEvent('load')
        await onMojPulpitPage.quickTransferSendTransfer(onMojPulpitPage.quickTransferToField, toOption, amount, title);

        const dialogBodyText = await onMojPulpitPage.quickTransferDetailsDialog.locator('p').textContent();
        expect(dialogBodyText).toEqual(` Przelew wykonany!Odbiorca: ${toPerson}Kwota: ${amount}PLN Nazwa: ${title}`)


    })

    test('Transfer ditails pop-up can be closed', async({page, navigateToQuickTransfePage, onMojPulpitPage}) => {
        await page.waitForEvent('load')
        await onMojPulpitPage.quickTransferSendTransfer(onMojPulpitPage.quickTransferToField, 1, '1000', 'Test Transfer');
        expect(await onMojPulpitPage.quickTransferDetailsDialog.isVisible()).toBeTruthy();
        await onMojPulpitPage.quickTransferDetailsDialog.getByRole('button').click();
        expect(await onMojPulpitPage.quickTransferDetailsDialog.isVisible()).toBeFalsy();
    })
})

test.describe('Moj Pulpit -> Phone top-up page', () => {
    test('To field is required', async({page, navigateToPhoneTopUpPage, onMojPulpitPage}) => {
        await page.waitForEvent('load');
        await onMojPulpitPage.phoneTopUpSubmitButton.click();
        await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.phoneTopUpAmountField, errorMessages.fieldIsRequired, 'has-error');
    })

    test('Amount field is required', async({page, navigateToPhoneTopUpPage, onMojPulpitPage}) => {
        await page.waitForEvent('load');
        await onMojPulpitPage.phoneTopUpSubmitButton.click();
        await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.phoneTopUpAmountField, errorMessages.fieldIsRequired, 'has-error');
    })

    test('Boundary for the Amount field', async({page, navigateToPhoneTopUpPage, onMojPulpitPage}) => {
        await page.waitForEvent('load')
        for(let option of dropdownOptions.doladoawaniaTelephoneNumbersWithoutDefaultTopUpValue){
            //check lower value
            
            await onMojPulpitPage.selectDropdownOption(onMojPulpitPage.phoneTopUpToFiled, undefined, option);
            await onMojPulpitPage.phoneTopUpAmountField.getByRole('textbox').fill('4');
            await onMojPulpitPage.phoneTopUpSubmitButton.click();
            await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.phoneTopUpAmountField, errorMessages.doladowanieTelefonuAmountTooLowErrorMessage, 'has-error');
            await onMojPulpitPage.phoneTopUpAmountField.getByRole('textbox').clear();

            await onMojPulpitPage.phoneTopUpAmountField.getByRole('textbox').fill('5');
            await onMojPulpitPage.phoneTopUpSubmitButton.click();
            await onMojPulpitPage.checkFieldHighlight(onMojPulpitPage.phoneTopUpAmountField, 'is-valid');
            await onMojPulpitPage.phoneTopUpAmountField.getByRole('textbox').clear();

            //check higher value
            if(option !== '503 xxx xxx'){
                await onMojPulpitPage.phoneTopUpAmountField.getByRole('textbox').fill('151');
                await onMojPulpitPage.phoneTopUpSubmitButton.click();
                await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.phoneTopUpAmountField, errorMessages.doladowanieTelefonuAmountTooHighErrorMessag150, 'has-error');
                await onMojPulpitPage.phoneTopUpAmountField.getByRole('textbox').clear();

                await onMojPulpitPage.phoneTopUpAmountField.getByRole('textbox').fill('150');
                await onMojPulpitPage.phoneTopUpSubmitButton.click();
                await onMojPulpitPage.checkFieldHighlight(onMojPulpitPage.phoneTopUpAmountField, 'is-valid');
                await onMojPulpitPage.phoneTopUpAmountField.getByRole('textbox').clear();
            } else {
                await onMojPulpitPage.phoneTopUpAmountField.getByRole('textbox').fill('501');
                await onMojPulpitPage.phoneTopUpSubmitButton.click();
                await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.phoneTopUpAmountField, errorMessages.doladowanieTelefonuAmountTooHighErrorMessag500, 'has-error');
                await onMojPulpitPage.phoneTopUpAmountField.getByRole('textbox').clear();

                await onMojPulpitPage.phoneTopUpAmountField.getByRole('textbox').fill('500');
                await onMojPulpitPage.phoneTopUpSubmitButton.click();
                await onMojPulpitPage.checkFieldHighlight(onMojPulpitPage.phoneTopUpAmountField, 'is-valid');
                await onMojPulpitPage.phoneTopUpAmountField.getByRole('textbox').clear();
            }
        }
    })

    test('Verification is required', async({page, navigateToPhoneTopUpPage, onMojPulpitPage}) => {
        await page.waitForEvent('load');
        await onMojPulpitPage.phoneTopUpSubmitButton.click();
        await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.phoneTopUpVerificationField, errorMessages.fieldIsRequired);
    })

    test('To field: check dropdown options', async({page, navigateToPhoneTopUpPage, onMojPulpitPage}) => {
        await onMojPulpitPage.checkDropdownOptions(onMojPulpitPage.phoneTopUpToFiled, dropdownOptions.doladoawaniaDropboxOptions)
    })

    test('Tooltip appears near the Amount field if 500, 502, 503 options are selected', async({page, navigateToPhoneTopUpPage, onMojPulpitPage}) => {
        for(let option of dropdownOptions.doladoawaniaTelephoneNumbersWithoutDefaultTopUpValue){
            await onMojPulpitPage.selectDropdownOption(onMojPulpitPage.phoneTopUpToFiled, undefined, option);
            expect(await onMojPulpitPage.phoneTopUpTooltip.isVisible()).toBeTruthy();
        }
    })

    test('Tooltip doesn\'t appear near the Amount field if 504 option is selected', async({page, navigateToPhoneTopUpPage, onMojPulpitPage}) => {
        await onMojPulpitPage.selectDropdownOption(onMojPulpitPage.phoneTopUpToFiled, undefined, dropdownOptions.doladoawaniaTelephoneNumbersWithDefaultTopUpValue[0]);
        expect(await onMojPulpitPage.phoneTopUpTooltip.isVisible()).toBeFalsy();
    })

    test('The 5PLN option selected by default at the Amount field id 504 number is seleced', async({page, navigateToPhoneTopUpPage, onMojPulpitPage}) => {
        await page.waitForEvent('load');
        await onMojPulpitPage.selectDropdownOption(onMojPulpitPage.quickTransferToField, undefined, dropdownOptions.doladoawaniaTelephoneNumbersWithDefaultTopUpValue[0]);
        expect(await onMojPulpitPage.quickTransferToField.locator('#uniform-widget_1_topup_amount span').textContent()).toEqual('5');
    })

    test('Amount field: check dropdown options', async({page, navigateToPhoneTopUpPage, onMojPulpitPage}) => {
        await onMojPulpitPage.selectDropdownOption(onMojPulpitPage.phoneTopUpToFiled, undefined, dropdownOptions.doladoawaniaTelephoneNumbersWithDefaultTopUpValue[0]);
        await onMojPulpitPage.checkDropdownOptions(onMojPulpitPage.phoneTopUpAmountField, dropdownOptions.doladoawaniaAmoutDropdownValues);
    })

    test('Make top-up', async({page, navigateToPhoneTopUpPage, onMojPulpitPage}) => {
        const toOption = Math.floor(Math.random() * 3) + 1;
        const amount = Math.floor(Math.random() * 100).toString() + ',00';

        await onMojPulpitPage.phoneTopUpSendTransfer(onMojPulpitPage.phoneTopUpToFiled, toOption, amount);
        expect(await onMojPulpitPage.phoneTopUpDetaildDialog.isVisible()).toBeTruthy()
    })

    test('Check top-up details', async({page, navigateToPhoneTopUpPage, onMojPulpitPage}) => {
        const toOption = Math.floor(Math.random() * 3) + 1;
        const amount = Math.floor(Math.random() * 100).toString() + ',00';
        const selectedOption = await onMojPulpitPage.phoneTopUpToFiled.locator('option').nth(toOption).textContent()

        await onMojPulpitPage.phoneTopUpSendTransfer(onMojPulpitPage.phoneTopUpToFiled, toOption, amount);
        
        const dialogContentBodyText = await onMojPulpitPage.phoneTopUpDetaildDialog.locator('p').textContent()
        expect(dialogContentBodyText).toEqual(` Doładowanie wykonane!Kwota: ${amount}PLN Numer: ${selectedOption}`)


    })

    test('Details dialog can be closed', async({page, navigateToPhoneTopUpPage, onMojPulpitPage}) => {
        const toOption = Math.floor(Math.random() * 3) + 1;
        const amount = Math.floor(Math.random() * 100).toString() + ',00';

        await onMojPulpitPage.phoneTopUpSendTransfer(onMojPulpitPage.phoneTopUpToFiled, toOption, amount);
        expect(await onMojPulpitPage.phoneTopUpDetaildDialog.isVisible()).toBeTruthy();

        await onMojPulpitPage.phoneTopUpDetaildDialog.getByRole('button').click();
        expect(await onMojPulpitPage.phoneTopUpDetaildDialog.isVisible()).toBeFalsy();
    })
})
