import { Locator, Page, expect } from "@playwright/test";

export class LoginPage {
    readonly page:Page
    idInputField: Locator
    passwordInputField: Locator
    idFieldTooltip: Locator
    passwordFieldTooltip: Locator
    moreAboutSecurityButton: Locator
    signInButton: Locator

    constructor(page :Page){
        this.page = page
        this.idInputField = page.locator('#login_id')
        this.passwordInputField = page.locator('#login_password')
        this.idFieldTooltip =  page.locator('#login_id_container i.tooltip')
        this.passwordFieldTooltip = page.locator('#login_password_container i.tooltip')
        this.moreAboutSecurityButton = page.getByText('o bezpiecze')
        this.signInButton = page.getByText('zaloguj')
    }

    /**
     * Thish method checks Login Page fields error message
     * @param fieldName - "id" - for the id field, "password" - for the password field
     * @param errorMessageText - provide message you want to check
     */
    async checkErrorMessage (fieldName, errorMessageText) {
        await expect(this.page.locator(`#error_login_${fieldName}`)).toHaveText(errorMessageText)
    }

    /**
     * Thish method checks Login Page fields highlighting.
     * @param fieldName - "id" - for the id field, "password" - for the password field
     * @param containerValue - "is-valid" - for the valid data, "has-error" - for the invalid data
     */
    async checkFieldHighlight (fieldName, containerValue){
        expect(this.page.locator(`#login_${fieldName}_container .grid-20`)).toHaveClass(`grid-20 grid-ms-48 grid-space-1 field ${containerValue}`);
    }

    /**
     * This method checks SignIn button to be desabled or enabled
     * @param isActive - true - button enabled, false - button disabled
     */
    async isSignInButtonActive(isActive: boolean){
        if (isActive){
            await expect(this.signInButton).toBeEnabled()
        } else {
            await expect(this.signInButton).toBeDisabled()
        }
        
    }

    /**
     * Thish method checks Tooltip for the fields at the Login Page
     * @param fieldName - "id" - for the id field, "password" - for the password field
     * @param tooltipText - text to verify
     */
    async checkTooltip (fieldName, tooltipText) {
        await expect(this.page.locator(`#login_${fieldName}_container i.tooltip`)).toHaveAttribute('aria-describedby');
        await expect(this.page.locator(`#login_${fieldName}_container i.tooltip`)).toHaveText(tooltipText);
    }
    

}