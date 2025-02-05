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
    }

    async szybkiPrzelewCheckTooltipText(TooltipText){
        await expect(this.szybkiPrzelewTooltipButton).toHaveText(TooltipText);
        await expect(this.szybkiPrzelewTooltipButton).toHaveAttribute('aria-describedby');
    }

    async szybkiPrzelewCheckErrorMessage(field:Locator, errorText: string, fieldValue: string) {
        await expect(field.locator('.error')).toHaveText(errorText);
        await this.szybkiPrzelewCheckFieldHighlight(field, fieldValue);
    }

    /**
     * This function checks field highlighting
     * @param field - provide field locator here
     * @param fieldValue - "is-valid" - green highlight, "has error" - red highlight
     */
    async  szybkiPrzelewCheckFieldHighlight (field: Locator, fieldValue: string) {
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

    async szybkiPrzelewSendTransfer (dropdownOprion, transferAmount, transferTitle) {
        await this.szybkiPrzelewToField.locator('select').selectOption({index: dropdownOprion});
        await this.szybkiPrzelewAmountField.getByRole('textbox').fill(transferAmount);
        await this.szybkiPrzelewTitleField.getByRole('textbox').fill(transferTitle);
        await this.szybkiPrzelewSubmitButton.click();
    }

    async szybkiPrzelewCloseComletedTransferDialogAndCheckItWasClosed () {
        expect(await this.page.isVisible('[role="dialog"]')).toBe(true);
        await this.page.locator('[role="dialog"]').getByRole('button').click();
        expect(await this.page.isVisible('[role="dialog"]')).toBe(false);
    }
}