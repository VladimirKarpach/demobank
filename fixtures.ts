import {test as base} from '@playwright/test'
import { LoginPage } from './pages/loginPage';
import { Navigation } from './pages/bankPage';
import { MojPuplitPage } from './pages/mojPolpitPage';

export type Fixtures = {
    setup: string
    signIn: string
    onLoginPage: LoginPage
    onMojPulpitPage: MojPuplitPage
    navigateTo: Navigation
}

export const test = base.extend<Fixtures>({
    onLoginPage: async({page}, use) => {
        const onLoginPage = new LoginPage(page);
        await use(onLoginPage);
    },

    onMojPulpitPage: async({page}, use) => {
        const onMojPulpitPage = new MojPuplitPage(page);
        await use(onMojPulpitPage);
    },

    navigateTo: async({page}, use) => {
        const navigateTo = new Navigation(page);
        await use(navigateTo);
    },

    setup: [async({page}, use) => {
        await page.goto('https://demo-bank.vercel.app/');
        await use('');
    },{auto: true}],

    signIn: async({page, onLoginPage}, use) => {
        await onLoginPage.idInputField.fill('TestUser');
        await onLoginPage.passwordInputField.fill('TestPass');
        await page.getByRole('button').click();
        await use('');
    }
})