import { Page } from "@playwright/test";

export class LoginPage {
    readonly page:Page
    constructor(page :Page){
        this.page = page
    }

    async idInput () {
        await this.page.locator('#login_id');
    }

    async passwordField () {
        return this.page.locator('#login_password');
    }

    async submitButton () {
        return this.page.getByRole('button');
    }

    async idFieldTooltipButton () {
        return this.page.locator('#login_id_container i.tooltip');
    }

    async passwordFieldTooltipButton () {
        return this.page.locator('#login_password_container i.tooltip');
    }

    async moreAboutSecurityButton () {
        return this.page.getByText('o bezpiecze');
    }

     async signIn () {
        await this.page.goto('https://demo-bank.vercel.app/');
        await this.page.locator('#login_id').fill('TestUser');
        await this.page.locator('#login_password').fill('TestPass');
        await this.page.getByRole('button').click();
    }
}