import { expect} from '@playwright/test'
import { test } from '../fixtures.ts'
import { Variables } from '../pages/variables'

const variables = new Variables();

test.describe('Login Page', () => {

    test('The ID field is required', async({page, openSite, onLoginPage}) => {
        await onLoginPage.idInputField.click();
        await onLoginPage.passwordInputField.click();
        await onLoginPage.checkErrorMessage('id', 'pole wymagane');
    })

    test('The Password field is required', async({page, openSite, onLoginPage}) => {
        await onLoginPage.passwordInputField.click();
        await onLoginPage.idInputField.click();
        await onLoginPage.checkErrorMessage('password', 'pole wymagane');
    })

    test('ID must be 8 characters long', async({page, openSite, onLoginPage}) => {
        await onLoginPage.idInputField.fill(variables.loginPage.incorrectUserId);
        await onLoginPage.signInButton.click({force: true});
        await onLoginPage.checkErrorMessage('id', 'identyfikator ma min. 8 znaków')
        await onLoginPage.checkFieldHighlight('id', 'has-error')

        await onLoginPage.idInputField.fill(variables.loginPage.correctUserId);
        await onLoginPage.signInButton.click({force: true});
        await onLoginPage.checkFieldHighlight('id', 'is-valid')
    })

    test('Password must be 8 characters long', async({page, openSite, onLoginPage}) => {
        await onLoginPage.passwordInputField.fill(variables.loginPage.incorrectPassword);
        await onLoginPage.signInButton.click({force: true});
        await onLoginPage.checkErrorMessage('password', 'hasło ma min. 8 znaków')
        await onLoginPage.checkFieldHighlight('password', 'has-error')

        await onLoginPage.passwordInputField.fill(variables.loginPage.correctPassword);
        await onLoginPage.signInButton.click({force: true});
        await onLoginPage.checkFieldHighlight('password', 'is-valid')
    })

    test('Sign In button isn\'t clickable untill all correct data provided', async({page, openSite, onLoginPage}) => {   
        //both fields are empty
        await onLoginPage.isSignInButtonActive(false);

        // only id provided
        await onLoginPage.idInputField.fill(variables.loginPage.correctUserId);
        await onLoginPage.isSignInButtonActive(false);
        await onLoginPage.idInputField.clear();

        // only password provided
        await onLoginPage.passwordInputField.fill(variables.loginPage.correctPassword);
        await onLoginPage.isSignInButtonActive(false);
        await onLoginPage.passwordInputField.clear();

        // correct user id and incorrect password
        await onLoginPage.idInputField.fill(variables.loginPage.correctUserId);
        await onLoginPage.passwordInputField.fill(variables.loginPage.incorrectPassword);
        await onLoginPage.isSignInButtonActive(false);
        await onLoginPage.idInputField.clear();
        await onLoginPage.passwordInputField.clear();

        // incorrect user id and correct password
        await onLoginPage.idInputField.fill(variables.loginPage.incorrectUserId);
        await onLoginPage.passwordInputField.fill(variables.loginPage.correctPassword);
        await onLoginPage.isSignInButtonActive(false);
        await onLoginPage.idInputField.clear();
        await onLoginPage.passwordInputField.clear();

        // user id and password are correct
        await onLoginPage.idInputField.fill(variables.loginPage.correctUserId);
        await onLoginPage.passwordInputField.fill(variables.loginPage.correctPassword);
        await onLoginPage.isSignInButtonActive(true);
    })

    test('Tooltip for ID appears on hover on question mark', async({page, openSite, onLoginPage}) => {
        await onLoginPage.idFieldTooltip.hover();
        await onLoginPage.checkTooltip('id', variables.loginPage.idTooltipText);

    })

    test('Tooltip for Password appears on hover on question mark', async({page, openSite, onLoginPage}) => {
        await onLoginPage.passwordFieldTooltip.hover()
        await onLoginPage.checkTooltip('password', variables.loginPage.passwordTooltipText);
    })

    test('Redirection to the "More about security" page', async({page, openSite, onLoginPage}) => {
        await expect(onLoginPage.moreAboutSecurityButton).toBeEnabled();
        await onLoginPage.moreAboutSecurityButton.click();
        await expect(page.locator('.login-highlight').first()).toHaveText('Pamiętaj o swoim bezpieczeństwie!');
    })

    test('Rediresction from "More about security" to the "Login" page', async({page, openSite, onLoginPage}) => {
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
            await onMojPulpitPage.checkTooltipText(onMojPulpitPage.szybkiPrzelewTooltipButton, variables.szybkiPrzelewPage.tooltipText);
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
            await onMojPulpitPage.checkDropdownOptions(onMojPulpitPage.szybkiPrzelewToField, variables.szybkiPrzelewPage.dropdownOptions)
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
            await onMojPulpitPage.checkDropdownOptions(onMojPulpitPage.doladowanieTelefonuToField, variables.doladoawaniaPage.dropboxOptions)
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
            for (const phoneNumber of variables.doladoawaniaPage.telephoneNumbersWithoutDefaultTopUpValue){
                await onMojPulpitPage.selectDropdownOption(onMojPulpitPage.doladowanieTelefonuToField, undefined, phoneNumber);
                expect(await onMojPulpitPage.doladowanieTelefonuTopUpInfoTooltip.isVisible()).toBeTruthy();
            }
        })

        test('Check tooltip', async({page, signIn, onMojPulpitPage}) => {
            for (const phoneNumber of variables.doladoawaniaPage.telephoneNumbersWithoutDefaultTopUpValue){
                await onMojPulpitPage.selectDropdownOption(onMojPulpitPage.doladowanieTelefonuToField, undefined, phoneNumber);
                await onMojPulpitPage.doladowanieTelefonuTopUpInfoTooltip.hover();
                expect(await onMojPulpitPage.doladowanieTelefonuTopUpInfoTooltip.isVisible()).toBeTruthy();
                if (phoneNumber === '503 xxx xxx'){
                    await onMojPulpitPage.checkTooltipText(onMojPulpitPage.doladowanieTelefonuTopUpInfoTooltip, variables.doladoawaniaPage.doladowanieTelefonuTopUpInfoTooltipText500);
                } else {
                    await onMojPulpitPage.checkTooltipText(onMojPulpitPage.doladowanieTelefonuTopUpInfoTooltip, variables.doladoawaniaPage.doladowanieTelefonuTopUpInfoTooltipText150);
                }
            }
        } )

        test('Boundary for the amount field for numbers 500, 502, 503', async ({page, signIn, onMojPulpitPage}) => {
            for (const phoneNumber of variables.doladoawaniaPage.telephoneNumbersWithoutDefaultTopUpValue){
                await onMojPulpitPage.selectDropdownOption(onMojPulpitPage.doladowanieTelefonuToField, undefined, phoneNumber);
                if (phoneNumber === '503 xxx xxx'){
                    // valid values range is 5 - 500

                    //check lowest minus 1
                    await onMojPulpitPage.doladowanieTelefonuProvideDataToAmountField('4');
                    await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.doladowanieTelefonuAmountField, variables.doladoawaniaPage.amountTooLowErrorMessage, 'has-error');
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
                    await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.doladowanieTelefonuAmountField, variables.doladoawaniaPage.amountTooHighErrorMessag500, 'has-error');
                    await onMojPulpitPage.doladowanieTelefonuAmountField.getByRole('textbox').clear();
                } else {
                    // valid values range is 5 - 150

                     //check lowest minus 1
                     await onMojPulpitPage.doladowanieTelefonuProvideDataToAmountField('4');
                     await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.doladowanieTelefonuAmountField, variables.doladoawaniaPage.amountTooLowErrorMessage, 'has-error');
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
                     await onMojPulpitPage.checkFieldErrorMessage(onMojPulpitPage.doladowanieTelefonuAmountField, variables.doladoawaniaPage.amountTooHighErrorMessag150, 'has-error');
                     await onMojPulpitPage.doladowanieTelefonuAmountField.getByRole('textbox').clear();
                }
            }
        })

        test('Select for the Amount appers if 504 number selected', async({page, signIn, onMojPulpitPage}) => {
            await onMojPulpitPage.selectDropdownOption(onMojPulpitPage.doladowanieTelefonuToField, undefined, variables.doladoawaniaPage.telephoneNumbersWithDefaultTopUpValue[0]);
            await expect(onMojPulpitPage.doladowanieTelefonuAmountField.locator('#uniform-widget_1_topup_amount')).toHaveClass('selector fixedWidth')
        })

        test('Check options at the Amout dropdown', async({page, signIn, onMojPulpitPage}) => {
            await onMojPulpitPage.selectDropdownOption(onMojPulpitPage.doladowanieTelefonuToField, undefined, variables.doladoawaniaPage.telephoneNumbersWithDefaultTopUpValue[0]);
            await onMojPulpitPage.doladowanieTelefonuAmountField.click();
            await onMojPulpitPage.checkDropdownOptions(onMojPulpitPage.doladowanieTelefonuAmountField, variables.doladoawaniaPage.amoutDropdownValues)
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

