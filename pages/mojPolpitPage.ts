import { Page, expect, Locator } from "@playwright/test";

export class MojPuplitPage {
    private readonly page: Page
    szybkiPrzelewBox: Locator
    szybkiPrzelewTooltipButton: Locator
    szybkiPrzelewToField: Locator
    szybkiPrzelewAmountField: Locator
    szybkiPrzelewTitleField: Locator
    szybkiPrzelewSubmitButton: Locator
    szybkiPrzelewTransferCompletedDialog: Locator
    szybkiPrzelewTransferCompletedDialogCocntent: Locator 
    doladowanieTelefonuBox: Locator
    doladowanieTelefonuSubmitButton: Locator
    doladowanieTelefonuToField: Locator
    doladowanieTelefonuAmountField: Locator
    doladowanieTelefonuVerificationCheckbox: Locator
    doladowanieTelefonuTransferCompletedDialog: Locator
    doladowanieTelefonuTransferCompletedDialogCocntent: Locator
    doladowanieTelefonuTopUpInfoTooltip: Locator
    kontoNaZycieBox: Locator
    kontoNaZycieBlokadyNaKoncieField: Locator
    kontoNaZycieLimitKredytowyField: Locator
    kontoNaZyciePosiadaczField: Locator
    kontoNaZycieMoreButton: Locator
    lastOperationsBox: Locator
    quickTransferToField: Locator
    quickTransferAmountField: Locator
    quickTransferTitleField: Locator
    quickTransferSubmitButton: Locator
    quickTransferTooltip: Locator
    quickTransferDetailsDialog: Locator

    constructor(page: Page) {
        this.page = page
        this.szybkiPrzelewBox = page.locator('.box-white', {hasText: 'przelew'})
        this.szybkiPrzelewTooltipButton = this.szybkiPrzelewBox.locator('i')
        this.szybkiPrzelewToField = this.szybkiPrzelewBox.locator('.form-row', {hasText: 'do'})
        this.szybkiPrzelewAmountField = this.szybkiPrzelewBox.locator('.form-row', {hasText: 'kwota'})
        this.szybkiPrzelewTitleField = this.szybkiPrzelewBox.locator('.form-row', {hasText: 'tytu'})
        this.szybkiPrzelewSubmitButton = this.szybkiPrzelewBox.getByRole('button')
        this.szybkiPrzelewTransferCompletedDialog = page.getByRole('dialog')
        this.szybkiPrzelewTransferCompletedDialogCocntent = this.szybkiPrzelewTransferCompletedDialog.locator('.hide.ui-widget-content')
        this.doladowanieTelefonuBox = page.locator('.box-white', {hasText: 'telefonu'})
        this.doladowanieTelefonuSubmitButton = this.doladowanieTelefonuBox.getByRole('button')
        this.doladowanieTelefonuToField = this.doladowanieTelefonuBox.locator('.form-row', {hasText: 'wybierz'})
        this.doladowanieTelefonuAmountField = this.doladowanieTelefonuBox.locator('.form-row', {hasText: 'kwota'})
        this.doladowanieTelefonuVerificationCheckbox = this.doladowanieTelefonuBox.locator('.form-row', {hasText: 'zapozna'})
        this.doladowanieTelefonuTransferCompletedDialog = page.getByRole('dialog')
        this.doladowanieTelefonuTransferCompletedDialogCocntent = this.doladowanieTelefonuTransferCompletedDialog.locator('.hide.ui-widget-content')
        this.doladowanieTelefonuTopUpInfoTooltip = this.doladowanieTelefonuBox.locator('.tooltip')
        this.kontoNaZycieBox = page.locator('.row', {hasText: '41 4100 1111 1111 1111 1111 0000'})
        this.kontoNaZycieBlokadyNaKoncieField = this.kontoNaZycieBox.locator('.form-row', {hasText: 'blokady'})
        this.kontoNaZycieLimitKredytowyField = this.kontoNaZycieBox.locator('.form-row', {hasText: 'limit'})
        this.kontoNaZyciePosiadaczField = this.kontoNaZycieBox.locator('.form-row', {hasText: 'posiadacz'})
        this.kontoNaZycieMoreButton = this.kontoNaZycieBox.locator('.btn')
        this.lastOperationsBox = page.locator('.box-white', {hasText: 'ostatnie operacje'})
        this.quickTransferSubmitButton = page.getByRole('button')
        this.quickTransferToField = page.locator('.form-row', {hasText: 'do'})
        this.quickTransferAmountField = page.locator('.form-row', {hasText: 'kwota'})
        this.quickTransferTitleField = page.locator('.form-row', {hasText: 'tytu'})
        this.quickTransferTooltip = page.locator('.tooltip')
        this.quickTransferDetailsDialog = page.locator('.ui-dialog')
    }

    async checkTooltipText(fieldName, tooltipText){
        //await expect(fieldName).toHaveText(tooltipText);
        let text = await fieldName.textContent();
        text = text.replace(/\s+/g, ' ').trim();

        expect(text).toEqual(tooltipText)
        await expect(fieldName).toHaveAttribute('aria-describedby');
    }

    /**
     * This method checks error message and field highlighting
     * @param field - provide field locator here
     * @param errorText - provide error text
     * @param fieldValue - "is-valid" - green highlight, "has error" - red highlight
     */
    async checkFieldErrorMessage(field:Locator, errorText: string, fieldValue?: string) {
        await expect(field.locator('.error')).toHaveText(errorText);
        if (fieldValue != undefined)
            await this.checkFieldHighlight(field, fieldValue);
    }

    /**
     * This function checks field highlighting
     * @param field - provide field locator here
     * @param fieldValue - "is-valid" - green highlight, "has error" - red highlight
     */
    async checkFieldHighlight (field: Locator, fieldValue: string) {
            const className = await field.locator('.grid-space-2').getAttribute('class');
            expect(className).toContain(fieldValue)
    }

    /**
     * This functions checks the content of the Completed Transfer dialog
     * @param receiver - data from the TO field
     * @param transferAmount - data from the Amount firld
     * @param transferTitle - data from the Title field
     */
    async szybkiPrzelewCheckDialogContent (receiver, transferAmount: string, transferTitle: string) {
        await expect(this.szybkiPrzelewTransferCompletedDialogCocntent).toContainText(`Przelew wykonany!Odbiorca:  ${receiver}Kwota: ${transferAmount},00PLN Nazwa: ${transferTitle}`
        );
    }

    async szybkiPrzelewSendTransfer (fieldLocator, dropdownOprion, transferAmount, transferTitle) {
        await this.selectDropdownOption(fieldLocator, dropdownOprion)
        await this.szybkiPrzelewAmountField.getByRole('textbox').fill(transferAmount);
        await this.szybkiPrzelewTitleField.getByRole('textbox').fill(transferTitle);
        await this.szybkiPrzelewSubmitButton.click();
    }

    async closeComletedTransferDialogAndCheckItWasClosed () {
        expect(await this.page.isVisible('[role="dialog"]')).toBe(true);
        await this.page.locator('[role="dialog"]').getByRole('button').click();
        expect(await this.page.isVisible('[role="dialog"]')).toBe(false);
    }

    async selectDropdownOption (fieldLocator: Locator, optionNumber?, optionName?) {
        if (optionNumber){
            await fieldLocator.locator('select').selectOption({index: optionNumber});
        }
        if (optionName){
            await this.page.waitForTimeout(200);
            await fieldLocator.locator('select').selectOption({label: optionName});
        }
    }

    async doladowanieTelefonuCheckboxCheck () {
        await expect(this.doladowanieTelefonuVerificationCheckbox.getByRole('checkbox')).not.toBeChecked();
        await this.doladowanieTelefonuVerificationCheckbox.getByRole('checkbox').check();
        await expect(this.doladowanieTelefonuVerificationCheckbox.getByRole('checkbox')).toBeChecked();
    }

    /**
     * This method compare oprions from dropdown to array of options
     * @param dropdownLocator - locator for dropdown you want check
     * @param optionsToCompare - array of options ot compare
     */
    async checkDropdownOptions (dropdownLocator, optionsToCompare) {
        await dropdownLocator.click();
        await expect(dropdownLocator.getByRole('option')).toHaveText(optionsToCompare);
    }
    /**
     * This method send transfer
     * @param fieldLocator - locator for the dropdown
     * @param dropdownOption - dropdown select index
     * @param transferAmount - provide amount of transfer
     */
    async doladowanieTelefonuSendTransfer (fieldLocator, dropdownOption, transferAmount) {
        await this.selectDropdownOption(fieldLocator, dropdownOption)
        await this.doladowanieTelefonuAmountField.getByRole('textbox').fill(transferAmount);
        await this.doladowanieTelefonuCheckboxCheck()
        await this.doladowanieTelefonuSubmitButton.click();
    }

    async doladowanieTelefonuProvideDataToAmountField (amount) {
        await this.doladowanieTelefonuAmountField.getByRole('textbox').fill(amount);
        await this.doladowanieTelefonuSubmitButton.click();
    }

    async quickTransferSendTransfer (fieldLocator, dropdownOprion, transferAmount, transferTitle) {
        await this.selectDropdownOption(fieldLocator, dropdownOprion)
        await this.quickTransferAmountField.getByRole('textbox').fill(transferAmount);
        await this.quickTransferTitleField.getByRole('textbox').fill(transferTitle);
        await this.quickTransferSubmitButton.click();
    }

}