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
        this. doladowanieTelefonuToField = this.doladowanieTelefonuBox.locator('.form-row', {hasText: 'wybierz'})
        this.doladowanieTelefonuAmountField = this.doladowanieTelefonuBox.locator('.form-row', {hasText: 'kwota'})
        this.doladowanieTelefonuVerificationCheckbox = this.doladowanieTelefonuBox.locator('.form-row', {hasText: 'zapozna'})
    }

    async szybkiPrzelewCheckTooltipText(TooltipText){
        await expect(this.szybkiPrzelewTooltipButton).toHaveText(TooltipText);
        await expect(this.szybkiPrzelewTooltipButton).toHaveAttribute('aria-describedby');
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
            await this.CheckFieldHighlight(field, fieldValue);
    }

    /**
     * This function checks field highlighting
     * @param field - provide field locator here
     * @param fieldValue - "is-valid" - green highlight, "has error" - red highlight
     */
    async CheckFieldHighlight (field: Locator, fieldValue: string) {
            const className = await field.locator('.grid-space-2').getAttribute('class');
            expect(className).toContain(fieldValue)
    }

    /**
     * This functions checks the content of the Completed Transfer dialog
     * @param receiver - data from the TO field
     * @param transferAmount - data from the Amount firld
     * @param transferTitle - data from the Title field
     */
    async szybkiPrzelewCheckDialodContent (receiver, transferAmount: string, transferTitle: string) {
        await expect(this.szybkiPrzelewTransferCompletedDialogCocntent).toContainText(`Przelew wykonany!Odbiorca:  ${receiver}Kwota: ${transferAmount},00PLN Nazwa: ${transferTitle}`
        );
    }

    async szybkiPrzelewSendTransfer (fieldLocator, dropdownOprion, transferAmount, transferTitle) {
        await this.selectDropdownOption(fieldLocator, dropdownOprion)
        await this.szybkiPrzelewAmountField.getByRole('textbox').fill(transferAmount);
        await this.szybkiPrzelewTitleField.getByRole('textbox').fill(transferTitle);
        await this.szybkiPrzelewSubmitButton.click();
    }

    async szybkiPrzelewCloseComletedTransferDialogAndCheckItWasClosed () {
        expect(await this.page.isVisible('[role="dialog"]')).toBe(true);
        await this.page.locator('[role="dialog"]').getByRole('button').click();
        expect(await this.page.isVisible('[role="dialog"]')).toBe(false);
    }

    async selectDropdownOption (fieldLocator: Locator, optionNumber) {
        await fieldLocator.locator('select').selectOption({index: optionNumber})
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
}