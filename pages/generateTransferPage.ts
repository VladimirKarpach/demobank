import { Locator, Page, expect } from "@playwright/test";


export class GenerateTransferPage {
    readonly page: Page
    accountField: Locator
    receiverFiled: Locator
    availableAmountLabel: Locator
    toAcoountField: Locator
    amountField: Locator
    titleField: Locator

    constructor (page: Page) {
        this.page = page
        this.accountField = page.locator('.form-row', {hasText: 'rachunek'}).first()
        this.receiverFiled = page.locator('.form-row', {hasText: 'nazwa odbiorcy'})
        this.availableAmountLabel = this.accountField.locator('.form-info')
        this.toAcoountField = page.locator('.form-row', {hasText: 'na rachunek'})
        this.amountField = page.locator('.form-row', {hasText: 'kwota'})
        this.titleField = page.locator('.form-row', {hasText: 'tytu'})
    }

    /**
     * This method checks error message and field highlighting
     * @param field - provide field locator here
     * @param errorText - provide error text
     * @param fieldValue - "is-valid" - green highlight, "has-error" - red highlight
     */
    async checkFieldErrorMessage(field:Locator, errorText: string, fieldValue?: string) {
        await expect(field.locator('.error')).toHaveText(errorText);
        if (fieldValue != undefined)
            await this.checkFieldHighlight(field, fieldValue);
    }

    /**
     * This function checks field highlighting
     * @param field - provide field locator here
     * @param fieldValue - "is-valid" - green highlight, "has-error" - red highlight
     */
    async checkFieldHighlight (field: Locator, fieldValue: string) {
            const className = await field.locator('.field').first().getAttribute('class');
            expect(className).toContain(fieldValue)
    }

    /**
     * This method checks is field required or not
     * @param required true - field is required, false - field is not required
     * @param field - field locator
     * @param inputText - text which will be entered to a field
     * @param errorMessage - error message for the required field
     */
    async isInputFiedlRequred (required: boolean, field: Locator, inputText:string, errorMessage: string){
        if(required){
            await this.page.waitForEvent('load');
            await field.getByRole('textbox').click();
            await this.availableAmountLabel.click({force: true});
            await this.checkFieldErrorMessage(field, errorMessage, 'has-error');
            await field.getByRole('textbox').fill(inputText);
            await this.availableAmountLabel.click({force: true});
            await this.checkFieldHighlight(field, 'is-valid');
        } else {
            await this.page.waitForEvent('load');
            await field.getByRole('textbox').click();
            await this.availableAmountLabel.click({force: true});
            await this.checkFieldHighlight(field, 'is-valid');
            await field.getByRole('textbox').fill(inputText);
            await this.availableAmountLabel.click({force: true});
            await this.checkFieldHighlight(field, 'is-valid');
        }
        
    }

}