import { Page, expect } from "@playwright/test";
import { LoginPage } from '../page-objects/loginPage';
import { Navigation } from '../page-objects/bankPage';

export class PageManager {
    private readonly page: Page
    private readonly loginPage: LoginPage
    private readonly navigation: Navigation

    constructor (page: Page){
        this.page = page
        this.loginPage = new LoginPage(this.page)
        this.navigation = new Navigation(this.page)
    }

    onLoginPage () {
        return this.loginPage
    }

    navigateTo () {
        return this.navigation
    }
}